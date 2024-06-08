import React, { useEffect, useRef, useState } from 'react';

import { Conditional } from '../conditional.jsx';

import { 
	input_class_raw as input_class, 
	input_class_error_raw as input_class_error 
} from '../classes.jsx';

import style from './text-field.module.scss';
import { isEmpty } from '../helpers.jsx';

export function TextField(props) {
    const {
        iconClass: input_icon_class,
        image,
		content,
        icon_position: _icon_position = 'left',
        type: input_type = 'text',
        onChange,
        onIconClick: iconClickHandler,
        placeholder,
        pattern, // For date field ideally
        value,
        inputDelay,
        maxLength = null,
		min,
		max,
        expandable = false,
		disabled,
		readOnly,
		regex=null, // For input validation and highlighiting field with red border for now.
		required, // If explicitly not specified, then it will be required if there's regex. If false, then regex will be validated only if the value is not empty.
		style: cssStyle,
		autofocus,
		resize='none',
		showErrorsAlways=false,
		onBlur,
		onFocus,
		onKeyDown,
		onKeyUp,
    } = props;

    const input_ref = useRef();
    const [text, setText] = useState(value || '');
	const [textInstant, setTextInstant] = useState(value || '');

    const [state, setState] = useState({
        expanded: !expandable,
        focused: false,
		show_password: false
    });

	const [errorState, setErrorState] = useState({
		mounted: false,
		has_error: false
	});

	// Set controls per field type
	const presets = {
		password: {
			type: state.show_password ? 'text' : 'password',
			iconClass: `ch-icon ${state.show_password ? 'ch-icon-eye' : 'ch-icon-eye-slash'} font-size-20`.classNames(),
			clickHandler: ()=>setState({...state, show_password: !state.show_password}),
			icon_position: 'right'
		},
		search: {
			iconClass: `ch-icon ch-icon-search-normal-1 font-size-16`.classNames(),
			icon_position: 'right'
		}
	}

	const {
		type          = input_type,
		iconClass     = input_icon_class,
		clickHandler  = iconClickHandler,
		icon_position = _icon_position
	} = presets[input_type] || {};
	
    const dispatchChange = (v) => {
        if (maxLength !== null && v.length > maxLength) {
            return;
        }

        onChange(v);
    };

    const onIconClick = () => {
        if (clickHandler) {
            clickHandler(() => {
                if (input_ref?.current) {
                    input_ref.current.focus();
                }
            });
            return;
        }

        if (!expandable) {
            return;
        }

        setState({
            ...state,
            expanded: !state.expanded
        });
    };

	const highlightError=()=>{
		
		let has_error = false;

		if ( regex ) {
			if ( required === false && isEmpty( textInstant ) ) {
				// No need to force regex rule as it is empty, and not required.
			} else {
				// Check regex even though if it is not required, however the field is not empty.
				has_error = isEmpty( textInstant ) || !regex.test(textInstant);
			}
		}

		setErrorState({
			...errorState,
			has_error
		});
	}

    const toggleFocusState = (focused) => {
        setState({
            ...state,
            focused
        });
    };

	useEffect(()=>{
		// Run highlighter on every change to remove error state once it was marked as has error.
		if ( errorState.mounted ) {
			highlightError();
		} else {
			setErrorState({...errorState, mounted: true})
		}
	}, [textInstant]);

	// No matter what, show error right now. Especially triggered on submit button click.
	useEffect(()=>{
		if ( showErrorsAlways ) {
			highlightError();
		}
	}, [showErrorsAlways]);

	// Simple autofocus on component mount
	useEffect(()=>{
		if( autofocus && input_ref && input_ref.current ) {
			input_ref.current.focus();
		}
	}, []);

	// Expand text field on search icon click ideally. So far it is used in dashboard page in job opening component.
    useEffect(() => {
        if (!state.expanded || !input_ref?.current) {
            return;
        }

        if (props.expandable) {
            input_ref.current.focus();
        }
    }, [state.expanded]);

	// Apply input delay, normally used in search fields for rate limiting.
    useEffect(() => {
		if ( ! inputDelay ) {
			return;
		}
		
        const timer = window.setTimeout(() => {
            dispatchChange(text);
        }, inputDelay);

        return () => window.clearInterval(timer);
    }, [text]);

    const attr = {
		min,
		max,
        type,
        pattern,
		disabled,
		readOnly,
        placeholder,
        ref: input_ref,
        value: !inputDelay ? value : text,
        onChange: (e) =>{
			const {value} = e.currentTarget;

			setTextInstant(value);
			
			if (!inputDelay) {
				dispatchChange(value)
			} else {
				setText(value);
			}
		},
        onFocus: () => {
			toggleFocusState(true);
			if ( onFocus ) {
				onFocus();
			}
		},
        onBlur: e => {
			highlightError();
			toggleFocusState(false);
			if ( onBlur ) {
				onBlur();
			}
		},
		onKeyDown,
		onKeyUp,
		className: 'text-field-flat font-size-15 font-weight-400 letter-spacing--15 flex-1 color-text'.classNames()
    };

    const separator = state.expanded ? (
        <span className={'d-inline-block width-6'.classNames()}></span>
    ) : null;

	let wrapper_class = !errorState.has_error ? input_class : input_class_error;
	wrapper_class = type==='textarea' ? wrapper_class.replace('padding-vertical-0', 'padding-vertical-10') : wrapper_class;
    
    return (
        <label
            className={
                `text-field`.classNames(style) +
                `d-flex align-items-center cursor-text ${
                    icon_position == 'right' ? 'flex-direction-row-reverse' : 'flex-direction-row'
                } ${state.focused ? 'active' : ''} ${disabled ? 'cursor-not-allowed' : ''}`.classNames() + 
				wrapper_class.classNames() + `${!state.expanded ? 'b-color-transparent': ''}`.classNames()
            }
			style={{
				height: type==='textarea' ? '100px' : undefined,
				margin: 0,
				...cssStyle
			}}
        >
            <Conditional show={iconClass}>
                <i className={iconClass + `${(clickHandler || expandable) ? 'cursor-pointer' : ''}`.classNames()} onClick={() => onIconClick()}></i>
                {separator}
            </Conditional>

            <Conditional show={image && state.expanded}>
                <img
                    src={image}
                    className={'image'.classNames(style) + `${(clickHandler || expandable) ? 'cursor-pointer' : ''}`.classNames()}
                    onClick={() => onIconClick()}
                />
                {separator}
            </Conditional>

			{content}

            <Conditional show={state.expanded}>
                <Conditional show={type !== 'textarea'}>
                    <input {...attr} />
                </Conditional>

                <Conditional show={type === 'textarea'}>
                    <textarea {...attr} style={{resize, paddingTop: '15px', paddingBottom: '15px'}}></textarea>
                </Conditional>
            </Conditional>
        </label>
    );
}
