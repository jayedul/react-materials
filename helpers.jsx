import { countries_object, patterns } from './data.jsx';

export function getElementDataSet(element) {
	let { dataset = {} } = element;
	let data = {};

	for (let k in dataset) {
		let _json;
		try {
			_json = JSON.parse(dataset[k]);
		} catch (error) {

		}

		data[k] = _json ? _json : dataset[k];
	}

	return data;
}

export function getRandomString() {
	const timestamp = new Date().getTime().toString();
	const randomPortion = Math.random().toString(36).substring(2);
	return '_' + timestamp + randomPortion;
}

export function __(txt) {
	const { __ } = window.wp?.i18n || {};
	return typeof __ == 'function' ? __(txt, 'crewhrm') : txt;
}

export function sprintf(str, ...params) {
	let find = '%s';

	while (true) {
		let replace = params.shift();
		if (replace === undefined || str.indexOf(find) === -1) {
			break;
		}

		str = str.replace(find, replace);
	}

	return str;
}

export function getFlag(countryCode) {
	const codePoints = (countryCode || '')
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}

export function replaceUrlsWithAnchors(text, props = {}) {
	if (typeof text !== 'string') {
		return text;
	}

	let { className = '' } = props;

	// Regular expression to match URLs in the text
	var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

	// Replace URLs with anchor tags
	var replacedText = text.replace(urlRegex, function (url) {
		return (
			'<a href="' +
            url +
            '" target="_blank" rel="noopener noreferrer nofollow" class="' +
            className +
            '">' +
            url +
            '</a>'
		);
	});

	return replacedText;
}

export function copyToClipboard(text, addToast) {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			addToast(__('Copied to clipboard'));
		})
		.catch((error) => {
			addToast(__('Error copying to clipboard'));
		});
}

export function getInitials(name) {
	const words = name.trim().split(' ');

	if (words.length === 0) {
		return '';
	}

	const initials = words
		.map((word) => word.charAt(0).toUpperCase())
		.join('')
		.substring(0, 2);

	return initials;
}

export function generateBackgroundColor(name) {
	// Generate a hash value from the user's name
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Use a fixed range of hues (0-360 degrees) based on the hash value for consistency
	const hue = Math.abs(hash) % 360;

	// Use random saturation and lightness values for variability
	const saturation = 30 + 0.5 * 40; // Adjust the range (40) for more variability
	const lightness = 40 + 0.5 * 40; // Adjust the range (40) for more variability
	const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

	return color;
}

export function getFileId(file) {
	if (file instanceof File) {
		// If it is uploaded file from system
		const { lastModified, name, size, type } = file;
		return lastModified + '_' + size + '_' + type + '_' + (name || '').replaceAll(' ', '_');
	} else if (typeof file === 'object') {
		// If it is from WP media selection
		return file.file_id;
	}
}

export function scrollLock(lock) {
	document.getElementsByTagName('html')[0].style.overflow = lock ? 'hidden' : '';
	document.getElementsByTagName('body')[0].style.overflow = lock ? 'hidden' : '';
}

export function getAddress({ street_address, city, province, zip_code, country_code, attendance_type }) {
	
	if( Array.isArray(attendance_type) && arrayEquals(attendance_type, ['remote']) ) {
		return __('Remote');
	}

	return [street_address, city, (province || '') + ' ' + (zip_code || ''), countries_object[country_code]]
		.map((a) => (a || '').trim())
		.filter((a) => a)
		.join(', ');
}

export function filterUniqueColumn(array, column) {
	let _values = [];

	return array.filter((a) => {
		let _v = a[column];

		if (_values.indexOf(_v) > -1) {
			return false;
		}

		_values.push(_v);
		return true;
	});
}

/**
 * Filter object elements like array element filter
 * @param {object} ob The object to filter elements of
 * @param {function} cb The callback function that determine whether to keep an element or not
 * @returns {object}
 */
export function filterObject(ob, cb) {
	const new_object = {};
	const _ob = {...ob};

	for (let k in _ob) {
		if (cb(_ob[k], k)) {
			new_object[k] = _ob[k];
		}
	}

	return new_object;
}

function hasTextInHTML(htmlString) {
	// Create a DOMParser instance
	const parser = new DOMParser();

	// Parse the HTML string
	const doc = parser.parseFromString(htmlString, 'text/html');

	// Get the text content of the parsed document
	const textContent = doc.documentElement.textContent.trim();

	// Check if there is any non-whitespace text content
	return textContent.length > 0;
}

export function isEmpty(value, treatNumericAsEmpty = false) {
	// Check for undefined and null values
	if (value === undefined || value === null || value === 'undefined') {
		return true;
	}

	// Check for empty strings
	if (typeof value === 'string' && (value.trim() === '' || !hasTextInHTML(value))) {
		return true;
	}

	// Check for empty arrays
	if (Array.isArray(value) && value.length === 0) {
		return true;
	}

	// Check for empty objects
	if (typeof value === 'object' && !(value instanceof File) && Object.keys(value).length === 0) {
		return true;
	}

	// Check for numeric values (optional)
	if (treatNumericAsEmpty && typeof value === 'number') {
		return !value || isNaN(value);
	}

	return false; // If none of the above conditions are met, the value is not empty
}

export function parseParams(searchParam) {
	const queryParams = {};
	for (const [key, value] of searchParam) {
		queryParams[key] = value;
	}
	return queryParams;
}

export function storage(name, local = false) {
	const store = local ? 'localStorage' : 'sessionStorage';
	const _name = 'crewhrm_' + name;

	return {
		setItem: (value) => {
			window[store].setItem(_name, JSON.stringify(value));
		},
		getItem: (_default) => {
			let json;
			try {
				json = JSON.parse(window[store].getItem(_name));
			} catch (e) {}
			return json ?? _default;
		},
		removeItem: () => {
			window[store].removeItem(_name);
		}
	};
}

export function flattenArray(arr) {
    const result = [];

    function recursiveFlatten(innerArr) {
        for (let i = 0; i < innerArr.length; i++) {
            if (Array.isArray(innerArr[i])) {
                // If the element is an array, recursively flatten it
                recursiveFlatten(innerArr[i]);
            } else {
                // If it's not an array, push it to the result
                result.push(innerArr[i]);
            }
        }
    }

    recursiveFlatten( Array.isArray( arr ) ? arr : [] );
    return result;
}

export function validateValues(values={}, rules=[]) {
	
	// Loop through rules
	for ( let i=0; i<rules.length; i++ ) {
		
		// Rules
		const { 
			validate: validate_as, 
			required, 
			name 
		} = rules[i];

		const value = values[name];
		const empty_value = isEmpty( value );

		if ( required && empty_value ) {
			return false;
		}

		// No need to check format on optional empty values
		if ( empty_value ) {
			continue;
		}
		
		switch(validate_as) {
			case 'phone' :
			case 'url':
			case 'zip_code':
			case 'email' :
				if ( ! patterns[validate_as].test( value ) ) {
					return false;
				}
				break;

			default:
				if ( validate_as ) {
					console.error('Unresolved validator', validate_as);
					return false;
				}
		}
	}
	
	return true;
}

/**
 * Format date output string
 * 
 * @param {Date|string|number} date Date object, date string or unix timestamp seconds
 * @param {string} pattern Format pattern.
 * @returns {string}
 */
export function formatDate( date, pattern = window[window.CrewPointer || 'CrewHRM'].date_format ) {

	date = getLocalDate(date);

	if( ! date || isNaN( date ) || ! ( date instanceof Date ) ) {
		return null;
	}

	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	const days = [
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	];

	let formattedDate = pattern;
	formattedDate = formattedDate.replace("F", months[date.getMonth()]);
	formattedDate = formattedDate.replace("M", months[date.getMonth()]?.substring(0, 3));
	formattedDate = formattedDate.replace("m", date.getMonth()+1);
	formattedDate = formattedDate.replace("j", date.getDate());
	formattedDate = formattedDate.replace("d", String(date.getDate()).padStart(2, '0'));
	formattedDate = formattedDate.replace("l", days[date.getDay()]);
	formattedDate = formattedDate.replace("D", days[date.getDay()]?.substring(0, 3));
	formattedDate = formattedDate.replace("Y", date.getFullYear());
	formattedDate = formattedDate.replace("g", String(date.getHours() % 12 || 12).padStart(2, '0'));
	formattedDate = formattedDate.replace("H", String(date.getHours()).padStart(2, '0'));
	formattedDate = formattedDate.replace("i", String(date.getMinutes()).padStart(2, '0'));
	formattedDate = formattedDate.replace("A", date.getHours() >= 12 ? 'PM' : 'AM');
	formattedDate = formattedDate.replace("a", date.getHours() >= 12 ? 'pm' : 'am');

	return formattedDate;
}

/**
 * Returns unix timestamp seconds
 * 
 * @param {Date} date The date object to get unix timestamp seconds from. Default is current Date.
 * @returns {number}
 */
export function getUnixTimestamp(date = new Date()) {
	date = getLocalDate(date);
	return Math.floor(date.getTime() / 1000);
}

export function getLocalFromUnix(unixTimestampInSeconds) {

	// Create a Date object from the Unix timestamp in UTC
	const utcDate = new Date(unixTimestampInSeconds * 1000);

	// Get the local timezone offset in minutes
	const timezoneOffsetMinutes = utcDate.getTimezoneOffset();

	// Adjust the Date object for the local timezone offset
	return new Date(utcDate.getTime() - (timezoneOffsetMinutes * 60 * 1000));
}

export function areDatesEqual(date1, date2) {
	date1 = getLocalDate(date1);
	date2 = getLocalDate(date2);

	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

/**
 * Get date object from unix seconds, date string
 * @param {Date|string|number} date 
 * @returns {Date}
 */
export function getLocalDate(date) {

	if ( ! ( date instanceof Date ) ) {

		if ( typeof date === 'string' ) {
			date = new Date(date);

		} else if( ! isNaN( date ) ) {
			date = getLocalFromUnix( parseInt( date ) );

		} else {
			date = null;
		}
	}
	
	return date;
}

// Function to check if two Date objects have the same date and time (down to the millisecond)
export function areDateTimesEqual(date1, date2) {
	date1 = getLocalDate(date1);
	date2 = getLocalDate(date2);
  	return date1.getTime() === date2.getTime();
}

export function getLastOfMonth(date) {
	const year = date.getFullYear();
	const month = date.getMonth();

	// Get the last day of the next month (which might be the first day of the following month)
	const lastDayOfNextMonth = new Date(year, month + 1, 0);

	// Check if the last day of the next month is actually the first day of the following month
	// If so, it means we are currently in a month with 31 days, and the last day of this month is 31
	if (lastDayOfNextMonth.getDate() === 1) {
		// Go back one day to get the last day of the current month
		return new Date(year, month, 31, 23, 59, 59); // Set hours, minutes, and seconds to the last values
	}

	// Set hours, minutes, and seconds to the last values for months with 28 or 30 days
	lastDayOfNextMonth.setHours(23, 59, 59);

	return lastDayOfNextMonth;
}

export function getFirstOfMonth(date) {
	return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
}

export function getFirstOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

export function getLastOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}

export function timeAgoOrAfter(timestamp) {
  const currentDate = new Date();
  const currentTimestamp = currentDate.getTime();
  const elapsed = currentTimestamp - getLocalFromUnix(timestamp).getTime();
  const future = elapsed < 0;
  const elapsedAbs = Math.abs(elapsed);

  const seconds = Math.floor(elapsedAbs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44); // Average number of days in a month
  const years = Math.floor(days / 365.25); // Average number of days in a year

  if (future) {
    if (years > 0) {
      return years === 1 ? sprintf(__('%s year from now'), years) : sprintf(__('%s years from now'), years);
    } else if (months > 0) {
      return months === 1 ? sprintf(__('%s month from now'), months) : sprintf(__('%s months from now'), months);
    } else if (weeks > 0) {
      return weeks === 1 ? sprintf(__('%s week from now'), weeks) : sprintf(__('%s weeks from now'), weeks);
    } else if (days > 0) {
      return days === 1 ? sprintf(__('%s day from now'), days) : sprintf(__('%s days from now'), days);
    } else if (hours > 0) {
      return hours === 1 ? sprintf(__('%s hour from now'), hours) : sprintf(__('%s hours from now'), hours);
    } else if (minutes > 0) {
      return minutes === 1 ? sprintf(__('%s minute from now'), minutes) : sprintf(__('%s minutes from now'), minutes);
    } else {
      return __('Less than a minute from now');
    }
  } else {
    if (years > 0) {
      return years === 1 ? sprintf(__('%s year ago'), years) : sprintf(__('%s years ago'), years);
    } else if (months > 0) {
      return months === 1 ? sprintf(__('%s month ago'), months) : sprintf(__('%s months ago'), months);
    } else if (weeks > 0) {
      return weeks === 1 ? sprintf(__('%s week ago'), weeks) : sprintf(__('%s weeks ago'), weeks);
    } else if (days > 0) {
      return days === 1 ? sprintf(__('%s day ago'), days) : sprintf(__('%s days ago'), days);
    } else if (hours > 0) {
      return hours === 1 ? sprintf(__('%s hour ago'), hours) : sprintf(__('%s hours ago'), hours);
    } else if (minutes > 0) {
      return minutes === 1 ? sprintf(__('%s minute ago'), minutes) : sprintf(__('%s minutes ago'), minutes);
    } else {
      return seconds === 1 ? sprintf(__('%s second ago'), seconds) : sprintf(__('%s seconds ago'), seconds);
    }
  }
}

export function arrayEquals(arr1, arr2, case_sensitive=false) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
		let same = case_sensitive ? sortedArr1[i] === sortedArr2[i] : sortedArr1[i] == sortedArr2[i];
        if (!same) {
            return false;
        }
    }

    return true;
}

export const is_production = process.env.NODE_ENV === 'production';
