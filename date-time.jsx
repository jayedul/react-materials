import React, {useState, useEffect, useContext} from 'react';
import { TextField } from './text-field/text-field.jsx';
import { __, formatDate, getLocalFromUnix, getUnixTimestamp } from './helpers.jsx';
import { patterns } from './data.jsx';
import { ContextToast } from './toast/toast.jsx';

export function DateField(props) {
	let { 
		onChange, 
		value, 
		required, 
		showErrorsAlways, 
		style,
		min,
		max
	} = props;

	return (
		<TextField
			type="date"
			regex={required ? patterns.date : null }
			{...{style, min, max, showErrorsAlways, onChange, value: value || '' }}
		/>
	);
}

export function DateTimePeriodField(props) {

	const {addToast} = useContext(ContextToast);

	let { 
		onChange, 
		labelClassName, 
		requires=['starts_at'], 
		value={} 
	} = props;

	const date      = value.starts_at ? getLocalFromUnix(value.starts_at) : '';
	const starts_at = date ? formatDate( date, 'H:i', false ) : '';

	const end_date  = value.ends_at ? getLocalFromUnix(value.ends_at) : '';
	const ends_at   = end_date ? formatDate( end_date, 'H:i', false ) : '';

	const [state, setState] = useState({
		date: date ? formatDate(date, 'Y-m-d', false) : '',
		starts_at,
		ends_at
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

		if ( ends_at!==null && starts_at>=ends_at ) {
			addToast(__('End time must be later than start time'));
			return;
		}

		onChange({starts_at, ends_at});

	}, [state.date, state.starts_at, state.ends_at]);

	return (
		<div className={'d-flex'.classNames()}>
			
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
