import React from 'react';

import { TextField } from './text-field/text-field.jsx';
import { DropDown } from './dropdown/dropdown.jsx';
import { __ } from './helpers.jsx';
import { countries_array } from './data.jsx';

export function AddressFields({values:{street_address, city, zip_code, province, country_code}, onChange, regex}) {
	return <div>
		<TextField
			value={street_address || ''}
			onChange={(v) => onChange('street_address', v)}
			placeholder={__('Street Address')}
			style={{marginBottom: '10px'}}
			regex={regex}
		/>

		<div className={'d-flex align-items-center column-gap-10 margin-bottom-10'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={city || ''}
					onChange={(v) => onChange('city', v)}
					placeholder={__('City')}
					regex={regex}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={province || ''}
					onChange={(v) => onChange('province', v)}
					placeholder={__('Province')}
					regex={regex}
				/>
			</div>
		</div>

		<div className={'d-flex align-items-center column-gap-10'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={zip_code || ''}
					onChange={(v) => onChange('zip_code', v)}
					placeholder={__('Postal/Zip Code')}
					regex={regex}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<DropDown
					value={country_code}
					onChange={(v) => onChange('country_code', v)}
					options={countries_array}
					regex={regex}/>
			</div>
		</div>
	</div>
}
