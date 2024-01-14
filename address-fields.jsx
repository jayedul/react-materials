import React from 'react';

import { TextField } from './text-field/text-field.jsx';
import { DropDown } from './dropdown/dropdown.jsx';
import { __ } from './helpers.jsx';
import { countries_array, patterns } from './data.jsx';

export function AddressFields(props) {

	const {
		required, 
		onChange, 
		showErrorsAlways,
		values:{
			street_address, 
			city, 
			zip_code, 
			province, 
			country_code
		}, 
	} = props;

	const regex = required ? /\S+/ : null;

	return <div>
		<TextField
			value={street_address || ''}
			onChange={(v) => onChange('street_address', v)}
			placeholder={__('Street Address')}
			style={{marginBottom: '10px'}}
			regex={regex}
			showErrorsAlways={showErrorsAlways}
		/>

		<div className={'d-flex align-items-center column-gap-10 margin-bottom-10'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={city || ''}
					onChange={(v) => onChange('city', v)}
					placeholder={__('City')}
					regex={regex}
					showErrorsAlways={showErrorsAlways}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={province || ''}
					onChange={(v) => onChange('province', v)}
					placeholder={__('Province')}
					regex={regex}
					showErrorsAlways={showErrorsAlways}
				/>
			</div>
		</div>

		<div className={'d-flex align-items-center column-gap-10'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={zip_code || ''}
					onChange={(v) => onChange('zip_code', v)}
					placeholder={__('Postal/Zip Code')}
					regex={required ? patterns.zip_code : null}
					showErrorsAlways={showErrorsAlways}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<DropDown
					value={country_code}
					onChange={(v) => onChange('country_code', v)}
					options={countries_array}
					required={required}
					showErrorsAlways={showErrorsAlways}
					clearable={false}/>
			</div>
		</div>
	</div>
}
