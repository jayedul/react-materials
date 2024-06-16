import Swal from 'sweetalert2';
import { data_pointer } from './helpers';

const {colors={}} = window[data_pointer];

export function confirm(title, text, callback) {
	Swal.fire({
		title,
		text: typeof text=='function' ? undefined : text,
		icon: "warning",
		showCancelButton: true,
		cancelButtonColor: 'gray',
		confirmButtonColor: colors.material,
		confirmButtonText: "Yes",
		reverseButtons: true,
		customClass: {
			title: 'font-weight-500'.classNames()
		}
	}).then((result) => {
		if (result.isConfirmed) {
			const func = typeof text=='function' ? text : callback;
			func();
		}
	});
}
