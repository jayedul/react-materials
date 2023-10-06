import React, {useState} from 'react';
import { TextField } from './text-field/text-field.jsx';
import { __ } from './helpers.jsx';
import { input_class } from './classes.jsx';

export function DateField(props) {
	let { onChange, className=input_class, inputClassName, value } = props;

	return (
		<TextField
			type="date"
			pattern="\d{4}-\d{2}-\d{2}"
			{...{ onChange, className, inputClassName, value: value || '' }}
		/>
	);
}

export function DateTimePeriodField(props) {
	let { onChange, labelClassName } = props;

	const [state, setState] = useState({
		date: '',
		time_start: '',
		time_end: ''
	});

	const setVal = (name, value) => {
		setState({
			...state,
			[name]: value
		});

	};

	return (
		<div data-crewhrm-selector="date-time-period" className={'d-flex'.classNames()}>
			<div className={'flex-5 margin-right-20'.classNames()}>
				<span className={labelClassName}>{__('Date')}</span>
				<DateField onChange={(v) => setVal('date', v)}/>
			</div>
			<div className={'flex-6'.classNames()}>
				<span className={labelClassName}>{__('Time')}</span>
				<div className={'d-flex align-items-center'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<TextField type="time" onChange={v=>setVal('time_start', v)}/>
					</div>
					<div className={'margin-left-10 margin-right-10'.classNames()}>
						-
					</div>
					<div className={'flex-1'.classNames()}>
						<TextField type="time" onChange={v=>setVal('time_end', v)}/>
					</div>
				</div>
			</div>
		</div>
	);
}
