import currencySymbol from "currency-symbol-map/map";
import { countries_object, patterns } from './data.jsx';

// Determine the unique data pointer
var script = document.currentScript;
const url = script.src;
const regex = /\/([^/]+)\/wp-content\/(plugins|themes)\/([^/]+)\/.*/;
const matches = url.match(regex);
const parsedString = `CrewMat_${matches[1]}_${matches[3]}`.toLowerCase();
export const data_pointer = parsedString.replace(/[^a-zA-Z0-9_]/g, '');

export const currency_symbol = currencySymbol[window[data_pointer].currency_code];

export const months = [
	__('January'), __('February'), __('March'), __('April'), __('May'), __('June'),
	__('July'), __('August'), __('September'), __('October'), __('November'), __('December')
];

export const months_en = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

export const days = [
	__('Sunday'), __('Monday'), __('Tuesday'), __('Wednesday'), __('Thursday'), __('Friday'), __('Saturday')
];

export const days_en = [
	'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

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

export function getRandomString(prefix='r', postfix='r') {
	const timestamp = new Date().getTime().toString();
	const randomPortion = Math.random().toString(36).substring(2);
	return prefix + timestamp + randomPortion + postfix;
}

export function __(txt, domain=window[data_pointer]?.text_domain) {

	const { __ } = window.wp?.i18n || {};

	if ( txt === null || txt === undefined || typeof txt === 'boolean' || txt === '' || typeof __ !== 'function' ) {
		return txt;
	}

	return isNaN(txt) ? __(txt, domain) : txt.toString().split('.').map(t=>t.split('').map(n=>__(n, domain)).join('')).join('.');
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

export async function pasteFromClipboard( field, text ) {
	if ( ! text ) {
		text = await navigator.clipboard.readText();
	}
	field.focus();
	document.execCommand('insertText', false, text);
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

export function getAddress(props, prefix = '') {
	
	const street_address  = props[`${prefix}street_address`];
	const city            = props[`${prefix}city`];
	const province        = props[`${prefix}province`];
	const zip_code        = props[`${prefix}zip_code`];
	const country_code    = props[`${prefix}country_code`];
	const attendance_type = props[`${prefix}attendance_type`];

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

export function hasTextInHTML(htmlString) {
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
export function formatDate( date, pattern = (window[data_pointer]?.date_format || 'Y-m-d'), translate = true ) {

	date = getLocalDate(date);

	if( ! date || isNaN( date ) || ! ( date instanceof Date ) ) {
		return null;
	}

	const _t = content => {
		return translate ? __(content) : content;
	}

	const _month = date.getMonth();
	const _months = translate ? months : months_en;
	const _days = translate ? days : days_en;

	let formattedDate = pattern;
	formattedDate = formattedDate.replaceAll(/\bF\b/g, _months[_month]);
	formattedDate = formattedDate.replaceAll(/\bM\b/g, _months[_month]?.substring(0, 3));
	formattedDate = formattedDate.replaceAll(/\bm\b/g, _t(String(_month+1).padStart(2, '0')));
	formattedDate = formattedDate.replaceAll(/\bj\b/g, _t(date.getDate()));
	formattedDate = formattedDate.replaceAll(/\bd\b/g, _t(String(date.getDate()).padStart(2, '0')));
	formattedDate = formattedDate.replaceAll(/\bl\b/g, _days[date.getDay()]);
	formattedDate = formattedDate.replaceAll(/\bD\b/g, _days[date.getDay()]?.substring(0, 3));
	formattedDate = formattedDate.replaceAll(/\bY\b/g, _t(date.getFullYear()));
	formattedDate = formattedDate.replaceAll(/\bg\b/g, _t(String(date.getHours() % 12 || 12).padStart(2, '0')));
	formattedDate = formattedDate.replaceAll(/\bH\b/g, _t(String(date.getHours()).padStart(2, '0')));
	formattedDate = formattedDate.replaceAll(/\bi\b/g, _t(String(date.getMinutes()).padStart(2, '0')));
	formattedDate = formattedDate.replaceAll(/\bA\b/g, date.getHours() >= 12 ? _t('PM') : _t('AM'));
	formattedDate = formattedDate.replaceAll(/\ba\b/g, date.getHours() >= 12 ? _t('pm') : _t('am'));

	return formattedDate;
}

export const formatDateTime=(d)=>formatDate(d, `${window[data_pointer]?.date_format || 'Y-m-d'} ${window[data_pointer]?.time_format || 'g:i a'}`)

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

export function isDateGreaterThan(date1, date2) {
	date1 = getLocalDate(date1);
	date2 = getLocalDate(date2);
	return date1.getTime() > date2.getTime();
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
      return years === 1 ? sprintf(__('%s year from now'), __(years)) : sprintf(__('%s years from now'), __(years));
    } else if (months > 0) {
      return months === 1 ? sprintf(__('%s month from now'), __(months)) : sprintf(__('%s months from now'), __(months));
    } else if (weeks > 0) {
      return weeks === 1 ? sprintf(__('%s week from now'), __(weeks)) : sprintf(__('%s weeks from now'), __(weeks));
    } else if (days > 0) {
      return days === 1 ? sprintf(__('%s day from now'), __(days)) : sprintf(__('%s days from now'), __(days));
    } else if (hours > 0) {
      return hours === 1 ? sprintf(__('%s hour from now'), __(hours)) : sprintf(__('%s hours from now'), __(hours));
    } else if (minutes > 0) {
      return minutes === 1 ? sprintf(__('%s minute from now'), __(minutes)) : sprintf(__('%s minutes from now'), __(minutes));
    } else {
      return __('Less than a minute from now');
    }
  } else {
    if (years > 0) {
      return years === 1 ? sprintf(__('%s year ago'), __(years)) : sprintf(__('%s years ago'), __(years));
    } else if (months > 0) {
      return months === 1 ? sprintf(__('%s month ago'), __(months)) : sprintf(__('%s months ago'), __(months));
    } else if (weeks > 0) {
      return weeks === 1 ? sprintf(__('%s week ago'), __(weeks)) : sprintf(__('%s weeks ago'), __(weeks));
    } else if (days > 0) {
      return days === 1 ? sprintf(__('%s day ago'), __(days)) : sprintf(__('%s days ago'), __(days));
    } else if (hours > 0) {
      return hours === 1 ? sprintf(__('%s hour ago'), __(hours)) : sprintf(__('%s hours ago'), __(hours));
    } else if (minutes > 0) {
      return minutes === 1 ? sprintf(__('%s minute ago'), __(minutes)) : sprintf(__('%s minutes ago'), __(minutes));
    } else {
      return seconds === 1 ? sprintf(__('%s second ago'), __(seconds)) : sprintf(__('%s seconds ago'), __(seconds));
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

export function trimTextMiddle(text, maxlength=40) {
    if (text.length <= maxlength) {
        return text;
    }

    var middle      = Math.floor(text.length / 2); // Find the middle index of the text
    var trimLength  = text.length - (maxlength - 3); // Calculate the length of text to be trimmed
    var trimmedText = text.slice(0, middle - Math.ceil(trimLength / 2)) + '...' + text.slice(middle + Math.floor(trimLength / 2)); // Trim text from the middle and replace with three dots

    // Ensure the final text is not more than maxlength characters
    if (trimmedText.length > maxlength) {
        var excess = trimmedText.length - maxlength;
        trimmedText = trimmedText.slice(0, trimmedText.length - excess - 3) + '...';
    }

    return trimmedText;
}

export function addKsesPrefix(_obj, keys) {

	if ( ! Array.isArray(keys) ) {
		keys = [keys];
	}

	const obj = {..._obj};
	
	for ( let k in obj ) {
		if ( typeof obj[k] === 'object' && ! Array.isArray(obj[k]) && ! isEmpty(obj[k]) ) {
			obj[k] = addKsesPrefix( obj[k], keys );

		} else if (keys.indexOf(k)>-1) {
			obj[ 'kses_' + k ] = obj[k];
			delete obj[k];
		}
	}

	return obj;
}

export function convertOffsetToTimezone(offset) {
    // Convert the offset to minutes
    var totalMinutes = Math.abs(offset) * 60;
    
    // Calculate hours and minutes
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    
    // Determine the sign of the offset
    var sign = offset >= 0 ? '+' : '-';
    
    // Format the result as "hh:mm"
    var formattedHours = hours < 10 ? '0' + hours : hours;
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return sign + formattedHours + ':' + formattedMinutes;
}

export const getDashboardPath=(rel_path)=>{

	const {
		settings: {
			general: {
				frontend_dashboard_path
			}
		}, 
		is_admin
	} = window[data_pointer];

	return getPath( `${is_admin ? '' : frontend_dashboard_path}${rel_path.indexOf('/')===0 ? '' : '/'}${rel_path}` );
}

export function getPath(path) {
	let _path = (window[data_pointer].is_admin ? '/' : window[data_pointer].home_path) + path;
	return _path.replace(/\/+/g, '/');
}

export const is_production = process.env.NODE_ENV === 'production';
