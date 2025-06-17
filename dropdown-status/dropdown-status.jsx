import React from "react";

import * as style from './style.module.scss';

const color_map = {
	complete: 'success',
	publish: 'success',
	published: 'success',
	
	unpublish: 'initial',
	unpublished: 'initial',
	private: 'initial',
	draft: 'incomplete',
	cancelled: 'incomplete',

	sent: 'success',
	approved: 'success',

	pending: 'warning',
	processing: 'warning',
	
	rejected: 'error',
	revoked: 'error',
	banned: 'error',
}

export function DropDownStatus({options=[], value, onChange, disabled, placeholder}) {

	const _options = placeholder ? [{id: '', label: placeholder}, ...options] : options;

	return <div className={`select-wrapper ${color_map[value] || 'default'} ${disabled ? 'disabled' : ''}`.classNames(style)}>
		<select 
			onChange={e=>onChange(e.currentTarget.value)} 
			value={value}
			disabled={disabled}
		>
			{
				_options.map(option=>{
					return <option key={option.id} value={option.id}>
						{option.label}
					</option>
				})
			}
		</select>
		<i className={`${'icon2'.classNames(style)} ${'sicon sicon-arrow-down'.classNames()}`}></i>
	</div>
}
