import React from "react";

import style from './style.module.scss';

const color_map = {
	pending: 'warning',
	publish: 'success',
	approved: 'success',
	published: 'success',
	rejected: 'error',
	revoked: 'error',
	banned: 'error',
}

export function DropDownStatus({options, value, onChange, disabled}) {

	return <div className={`select-wrapper ${color_map[value] || 'default'} ${disabled ? 'disabled' : ''}`.classNames(style)}>
		<select 
			onChange={e=>onChange(e.currentTarget.value)} 
			value={value}
			disabled={disabled}
		>
			{
				options.map(option=>{
					return <option key={option.id} value={option.id}>
						{option.label}
					</option>
				})
			}
		</select>
		<i className={`${'icon2'.classNames(style)} ${'ch-icon ch-icon-arrow-down'.classNames()}`}></i>
	</div>
}
