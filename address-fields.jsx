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
		unit_field = false,
		name_prefix='',
		values={}, 
	} = props;

	const getName=name=>`${name_prefix}${name}`;

	const unit_flat      = values[ getName('unit_flat') ];
	const street_address = values[ getName('street_address') ];
	const city           = values[ getName('city') ];
	const zip_code       = values[ getName('zip_code') ];
	const province       = values[ getName('province') ];
	const country_code   = values[ getName('country_code') ];

	const regex = required ? /\S+/ : null;

	return <div>
		<div className={'d-flex column-gap-10'.classNames()}>
			{
				!unit_field ? null :
				<div style={{width: '104px'}}>
					<TextField
						value={unit_flat || ''}
						onChange={(v) => onChange(getName('unit_flat'), v)}
						placeholder={__('Unit\\Flat')}
						style={{marginBottom: '10px'}}
						regex={regex}
						showErrorsAlways={showErrorsAlways}
					/>
				</div>
			}
			<div className={'flex-1'.classNames()}>
				<TextField
					value={street_address || ''}
					onChange={(v) => onChange(getName('street_address'), v)}
					placeholder={__('Street Address')}
					style={{marginBottom: '10px'}}
					regex={regex}
					showErrorsAlways={showErrorsAlways}
				/>
			</div>
		</div>
		
		<div className={'d-flex align-items-center column-gap-10 margin-bottom-10'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={city || ''}
					onChange={(v) => onChange(getName('city'), v)}
					placeholder={__('City')}
					regex={regex}
					showErrorsAlways={showErrorsAlways}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={province || ''}
					onChange={(v) => onChange(getName('province'), v)}
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
					onChange={(v) => onChange(getName('zip_code'), v)}
					placeholder={__('Postal/Zip Code')}
					regex={required ? patterns.zip_code : null}
					showErrorsAlways={showErrorsAlways}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<DropDown
					placeholder={__('Select Country')}
					value={country_code}
					onChange={(v) => onChange(getName('country_code'), v)}
					options={countries_array}
					required={required}
					showErrorsAlways={showErrorsAlways}
					clearable={false}/>
			</div>
		</div>
	</div>
}
