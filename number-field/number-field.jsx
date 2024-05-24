import React, { useRef, useState } from 'react';
import { input_class as className } from '../classes.jsx';

import style from './number-field.module.scss'

export function NumberField(props) {
	const { onChange, value, max, min, disabled, placeholder, width } = props;
	const ref = useRef();
	const [state, setState] = useState({
		focused: false
	});

	const changeValue = (shift, val) => {

		if ( disabled ) {
			return;
		}

		// Focu the field to apply styles
		ref.current.focus();

		// Collect value and dispatch
		let value = parseInt(val === undefined ? ref?.current?.value : val) || 0;

		// Apply controller action
		if (shift === 1 || shift === -1) {
			value = value + shift;
		}

		// Apply validation
		if (!isNaN(min) && value < min) {
			value = min;
		}
		if (!isNaN(max) && value > max) {
			value = max;
		}

		// Dispatch to parent level caller
		onChange(value);
	};

	const toggleFocusState = (focused) => {
		setState({
			...state,
			focused
		});
	};

	const controller_class =
        'font-size-20 cursor-pointer color-text-light color-active-child-primary'.classNames();

	return (
		<div
			className={
				`d-flex align-items-center bg-color-white ${disabled ? 'cursor-not-allowed' : ''} ${
					state.focused ? 'active color-active-parent' : ''
				}`.classNames() + 'number-field'.classNames(style) + className
			}
			style={{width}}
		>
			<div className={'height-20'.classNames()}>
				<i
					className={'ch-icon ch-icon-minus-square'.classNames() + controller_class}
					onClick={() => changeValue(-1)}
				></i>
			</div>
			<div className={'flex-1'.classNames()}>
				<input
					ref={ref}
					type="text"
					disabled={disabled}
					onChange={(e) => changeValue(null, e.currentTarget.value)}
					value={value ?? 0}
					onFocus={() => toggleFocusState(true)}
					onBlur={() => toggleFocusState(false)}
					placeholder={placeholder}
					className={'text-field-flat text-align-center'.classNames()}
					onKeyDown={e=>{
						
						let v = parseInt( e.currentTarget.value );

						if ( e.key === "ArrowUp" ) {
							changeValue( 1, v );
						} else if ( e.key === "ArrowDown" ) {
							changeValue( -1, v );
						}
					}}
				/>
			</div>
			<div className={'height-20'.classNames()}>
				<i
					className={'ch-icon ch-icon-add-square'.classNames() + controller_class}
					onClick={() => changeValue(1)}
				></i>
			</div>
		</div>
	);
}
