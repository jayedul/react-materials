import React, {useState, useEffect} from 'react';
import { TextField } from './text-field/text-field.jsx';
import { __, getUnixTimestamp } from './helpers.jsx';
import { input_class } from './classes.jsx';

export function DateField(props) {
	let { onChange, className=input_class, inputClassName, value } = props;

	return (
		<TextField
			type="date"
			{...{ onChange, className, inputClassName, value: value || '' }}
		/>
	);
}

export function DateTimePeriodField(props) {
	let { onChange, labelClassName, requires=['starts_at'], value={} } = props;

	const [state, setState] = useState({
		date: '',
		starts_at: '',
		ends_at: ''
	});

	const setVal = (name, value) => {
		setState({
			...state,
			[name]: value
		});
	};

	useEffect(()=>{
		if ( !state.date || !state.starts_at || ( requires.indexOf('ends_at')>-1 && !state.ends_at ) ) {
			return;
		}

		const starts_at = getUnixTimestamp( `${state.date} ${state.starts_at}` );
		const ends_at = state.ends_at ? getUnixTimestamp( `${state.date} ${state.ends_at}` ) : null;

		onChange({starts_at, ends_at});

	}, [state]);

	return (
		<div data-crewhrm-selector="date-time-period" className={'d-flex'.classNames()}>
			<div className={'flex-5 margin-right-20'.classNames()}>
				<span className={labelClassName}>{__('Date')}</span>
				<DateField onChange={(v) => setVal('date', v)} value={state.date}/>
			</div>
			<div className={'flex-6'.classNames()}>
				<span className={labelClassName}>{__('Time')}</span>
				<div className={'d-flex align-items-center'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<TextField type="time" onChange={v=>setVal('starts_at', v)} value={state.starts_at}/>
					</div>
					<div className={'margin-left-10 margin-right-10'.classNames()}>
						-
					</div>
					<div className={'flex-1'.classNames()}>
						<TextField type="time" onChange={v=>setVal('ends_at', v)} value={state.ends_at}/>
					</div>
				</div>
			</div>
		</div>
	);
}
