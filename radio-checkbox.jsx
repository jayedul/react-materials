import React, { useEffect, useState } from 'react';

import {isEmpty} from './helpers.jsx';

export function checkBoxRadioValue(e, values) {
	const { type, value: _value, checked } = e.currentTarget;

	if (type === 'radio') {
		return _value;
	}

	let _values = [...(Array.isArray(values) ? values : [])];
	let index = _values.indexOf(_value);

	if (checked) {
		if (index === -1) {
			_values.push(_value);
		}
	} else if (index >= 0) {
		_values.splice(index, 1);
	}

	return _values;
}

export function RadioCheckbox({
	name,
	value,
	type,
	options = [],
	onChange,
	className,
	spanClassName,
	required=false,
	showErrorsAlways=false
}) {
	const [errorState, setErrorState] = useState(null);

	const highlightError=()=>{
		setErrorState(required && isEmpty(value));
	}

	useEffect(()=>{
		// Do not highlight at first mount
		if ( errorState===null ) {
			setErrorState(false);
			return;
		}

		highlightError();

	}, [value]);

	useEffect(()=>{
		if( showErrorsAlways ) {
			highlightError();
		}
	}, [showErrorsAlways]);

	return options.map((option) => {
		let { label, id, disabled } = option;
		return (
			<div key={id}>
				<label
					className={`d-inline-flex align-items-center column-gap-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`.classNames() + className}
				>
					<input
						type={type}
						name={name}
						value={id}
						disabled={disabled}
						checked={type === 'radio' ? value === id : (Array.isArray(value) ? value : []).indexOf(id) > -1}
						onChange={(e) => onChange(checkBoxRadioValue(e, value))}
						className={`${errorState ? 'error' : ''}`.classNames()}
					/>
					<span className={spanClassName}>{label}</span>
				</label>
			</div>
		);
	});
}
