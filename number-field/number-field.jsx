import React, { useRef, useState } from 'react';
import { input_class as className } from '../classes.jsx';

import style from './number-field.module.scss'
import { useEffect } from 'react';

export function NumberField(props) {
	
	const { 
		onChange, 
		value, 
		max, 
		min, 
		disabled, 
		placeholder, 
		width,
		decimal_point,
		name
	} = props;

	const ref = useRef();
	const [state, setState] = useState({
		focused: false,
		cursor_position: 0
	});

	const changeValue = (shift, val) => {

		setState({
			...state,
			cursor_position: ref.current.selectionStart
		});

		if ( disabled ) {
			return;
		}

		// Focu the field to apply styles
		ref.current.focus();

		// Collect value and dispatch
		let parser = decimal_point ? parseFloat : parseInt;
		let value = parser(val === undefined ? ref?.current?.value : val) || 0;

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

		if (decimal_point) {
			value = value.toFixed(2);
		}

		// Dispatch to parent level caller
		onChange( value );
	};

	const toggleFocusState = (focused) => {
		setState({
			...state,
			focused
		});
	};

	useEffect(()=>{
		ref.current.setSelectionRange(state.cursor_position, state.cursor_position);
	}, [value]);

	const controller_class = 'font-size-20 cursor-pointer color-text-50'.classNames();

	return <div
		className={
			`d-flex align-items-center bg-color-white ${disabled ? 'cursor-not-allowed' : ''} ${
				state.focused ? 'active color-active-parent' : ''
			}`.classNames() + 'number-field'.classNames(style) + className
		}
		style={{width}}
	>
		<div className={'height-20'.classNames()}>
			<i
				className={'ch-icon ch-icon-minus-square color-text-70 interactive'.classNames() + controller_class}
				onClick={() => changeValue(-1)}
			></i>
		</div>
		<div className={'flex-1'.classNames()}>
			<input
				ref={ref}
				name={name}
				type="text"
				disabled={disabled}
				onChange={(e) => changeValue(null, e.currentTarget.value)}
				value={value ?? 0}
				onFocus={() => toggleFocusState(true)}
				onBlur={() => toggleFocusState(false)}
				placeholder={placeholder}
				className={'text-field-flat text-align-center color-text'.classNames()}
				onKeyDown={e=>{
					
					if ( e.key === "ArrowUp" ) {
						
						e.preventDefault();
						changeValue( 1 );

					} else if ( e.key === "ArrowDown" ) {
						e.preventDefault();
						changeValue( -1 );
					}
				}}
			/>
		</div>
		<div className={'height-20'.classNames()}>
			<i
				className={'ch-icon ch-icon-add-square color-text-70 interactive'.classNames() + controller_class}
				onClick={() => changeValue(1)}
			></i>
		</div>
	</div>
}
