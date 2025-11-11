import React, { useRef, useState } from 'react';
import { input_class as className } from '../classes.jsx';

import * as style from './number-field.module.scss'

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
		value
	});

	const [focused, setFocused] = useState(false);

	const changeValue = (shift) => {

		let val = state.value;

		if ( disabled ) {
			return;
		}

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

		setState({...state, value});
	};

	const controller_class = 'font-size-20 cursor-pointer color-text-50'.classNames();

	return <div
		className={
			`d-flex align-items-center bg-color-white ${disabled ? 'cursor-not-allowed' : ''} ${
				focused ? 'active' : ''
			}`.classNames() + 'number-field'.classNames(style) + className
		}
		style={{width}}
	>
		<div className={'height-20'.classNames()}>
			<i
				className={'jcon jcon-minus-square color-text-70 interactive'.classNames() + controller_class}
				onClick={() => changeValue(-1)}
			></i>
		</div>
		<div className={'flex-1'.classNames()}>
			<input
				ref={ref}
				name={name}
				type="text"
				disabled={disabled}
				onChange={(e) => setState({...state, value: e.currentTarget.value})}
				value={state.value ?? 0}
				onFocus={() => setFocused(true)}
				onBlur={() => {changeValue(); setFocused(false);}}
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
				className={'jcon jcon-add-square color-text-70 interactive'.classNames() + controller_class}
				onClick={() => changeValue(1)}
			></i>
		</div>
	</div>
}
