import { __, data_pointer, getHighestUnitFromBytes, sprintf } from "./helpers.jsx";

const {_token} = window[data_pointer];

const error_message = {
    'timeout'     : __('The request timed out.'),
    'error'       : __('Request error'),
    'abort'       : __('Request aborted.'),
    'parsererror' : __('Failed to parse the response.')
};

function calculateFormDataSize(formData) {
	
	const {max_filesize, max_post_size} = window[data_pointer].configs || {};

	if ( isNaN( max_filesize ) || isNaN( max_post_size ) ) {
		return true;
	}

    let totalSize = 0;

    for (let entry of formData.entries()) {

        const [key, value] = entry;

		totalSize += key.length;

        if ( value instanceof File ) {

			totalSize += value.size;

			if ( value.size > max_filesize ) {
				return sprintf( __( 'File size must be less than %s' ), getHighestUnitFromBytes( max_filesize ) );
			}

        } else {
            // Add size of non-file fields (strings, etc.)
            totalSize += new Blob([value]).size;
        }
    }

    return totalSize > max_post_size ? sprintf( __( 'Total size must be less than %s'), getHighestUnitFromBytes(max_post_size) ) : true;
}

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
		action: action.indexOf('wp_ajax_') === 0 ? action.replace('wp_ajax_', '') : ((window[data_pointer]?.app_id || '') + '_' + action),
		nonce: window[data_pointer]?.nonce || null,
		nonce_action: window[data_pointer]?.nonce_action || null,
		browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	};

	// Build form data
	const formData = new FormData();
	formData.append('_token', _token);

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

	const size_err = calculateFormDataSize(formData);
	if ( typeof size_err === 'string' ) {
		callback({
			success: false,
			data: {
				message: size_err
			}
		});
		return;
	}


	window.jQuery.ajax({
		url: window[data_pointer].permalinks.ajaxurl,
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
		error: function (xhr, status, error) {
			callback({
				success: false,
				data: {message: error_message[status] || __('Something went wrong!')}
			});
		},
		xhr: function () {
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener(
				'progress',
				function (evt) {
					if (typeof progressCallback == 'function' && evt.lengthComputable) {
						progressCallback(Math.round((evt.loaded / evt.total) * 100));
					}
				},
				false
			);
			return xhr;
		}
	});
}
