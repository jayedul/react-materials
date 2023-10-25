/**
 * Ajax request wrapper
 * @param {string} action Ajax request handler method name
 * @param {object?} payload Post data including File object
 * @param {function?} callback Response handler
 * @param {function?} progressCallback File upload progress callback
 */
export function request(action, payload = {}, callback, progressCallback) {
	// Append action and nonce
	payload = {
		...payload,
		action: window[window.CrewPointer || 'CrewHRM'].app_name + '_' + action,
		nonce: window[window.CrewPointer || 'CrewHRM'].nonce,
		nonce_action: window[window.CrewPointer || 'CrewHRM'].nonce_action
	};

	// Build form data
	const formData = new FormData();

	// Function to flatten nested JSON into a flat object and append files to FormData.
	function flattenObject(obj, formData, parentKey = '') {
		// Loop through object
		for (let key in obj) {
			// Do not enclose for first level key
			const _key = parentKey === '' ? key : `${parentKey}[${key}]`;

			// Process object even if it is array
			if (typeof obj[key] === 'object') {
				// Process if it is array
				if (Array.isArray(obj[key])) {
					// Put empty array manually. Otherwise it doesn't get submitted as forEach method doesn't cover it.
					// The post data should go through castRecursive method in the backend to convert this string array[] to real empty array.
					if (!obj[key].length) {
						formData.append(`${_key}`, '[]');
					}

					// Loop through array elements
					obj[key].forEach((item, index) => {
						// If the element is uploaded file
						if (item instanceof File) {
							// Put file object which is an array element
							formData.append(`${_key}[${index}]`, item, item.name);
						} else if (!Array.isArray(item) && typeof item !== 'object') {
							// If it is singular array item
							formData.append(`${_key}[${index}]`, item);
						} else {
							// Run recurson for singular values
							flattenObject(item, formData, `${_key}[${index}]`);
						}
					});
				} else if (obj[key] instanceof File) {
					// Process file object
					formData.append(`${_key}`, obj[key]);
				} else {
					// Process singluar elements in the object recursively
					flattenObject(obj[key], formData, `${_key}`);
				}
			} else if( obj[key] !== undefined ) {
				// Put non object data directly
				formData.append(`${_key}`, obj[key]);
			}
		}
	}

	// Flatten the nested JSON and append files to FormData
	flattenObject(payload, formData);

	window.jQuery.ajax({
		url: window[window.CrewPointer || 'CrewHRM'].ajaxurl,
		type: 'POST',
		data: formData,
		contentType: false,
		cache: false,
		processData: false,
		success: function (response) {
			if (typeof callback == 'function') {
				callback({
					...response,
					success: response.success || false,
					data: response.data || {}
				});
			}
		},
		error: function () {
			callback({
				success: false,
				data: {}
			});
		},
		xhr: function () {
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener(
				'progress',
				function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = (evt.loaded / evt.total) * 100;
						if (typeof progressCallback == 'function') {
							progressCallback(percentComplete);
						}
					}
				},
				false
			);
			return xhr;
		}
	});
}
