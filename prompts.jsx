import Swal from 'sweetalert2';
import { data_pointer } from './helpers';

const {colors={}} = window[data_pointer];

export function confirm(title, text, callback, configs) {

	const has_text = typeof text === 'string';

	const params = {
		title,
		text: has_text ? text : undefined,
		icon: "question",
		showCancelButton: true,
		cancelButtonColor: 'gray',
		confirmButtonColor: colors.material,
		confirmButtonText: "Yes",
		reverseButtons: true,
		customClass: {
			container: 'solidie-swal',
			title: 'font-weight-600'.classNames()
		}
	}

	let _configs = has_text ? configs : callback;
	_configs     = ( _configs && typeof _configs === 'object' ) ? _configs : {};

	Swal.fire({...params, ..._configs}).then((result) => {
		if (result.isConfirmed) {
			const func = has_text ? callback : text;
			func();
		}
	});
}
