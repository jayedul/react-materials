import React, { useEffect, useRef, useState } from 'react';

import { Conditional } from '../conditional.jsx';
import { input_class as className, input_class_error } from '../classes.jsx';

import style from './text-field.module.scss';

export function TextField(props) {
    const {
        iconClass,
        image,
        icon_position = 'left',
        type = 'text',
        onChange,
        onIconClick: clickHandler,
        placeholder,
        pattern, // For date field ideally
        value,
        inputDelay,
        maxLength = null,
        expandable = false,
		disabled,
		readOnly,
		regex=null, // For input validation and highlighiting field with red border for now.
		style: cssStyle,
		autofocus,
		showErrorsAlways=false
    } = props;

    const input_ref = useRef();

    const [text, setText] = useState(value || '');
	const [textInstant, setTextInstant] = useState(value || '');

    const [state, setState] = useState({
        expanded: !expandable,
        focused: false,
    });

	const [errorState, setErrorState] = useState({
		error_triggered: false,
		has_error: false
	});

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
		const has_error = regex && (!textInstant || !regex.test(textInstant));

		setErrorState({
			...errorState,
			error_triggered: errorState.error_triggered || has_error,
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
		if ( errorState.error_triggered ) {
			highlightError();
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
        onFocus: () => toggleFocusState(true),
        onBlur: e => {
			highlightError();
			toggleFocusState(false);
		},
        className: 'text-field-flat font-size-15 font-weight-500 letter-spacing--15 flex-1'.classNames()
    };

    const separator = state.expanded ? (
        <span className={'d-inline-block width-6'.classNames()}></span>
    ) : null;

    return (
        <label
            data-crewhrm-selector="text-field"
            className={
                `text-field`.classNames(style) +
                `d-flex align-items-center cursor-text ${
                    icon_position == 'right' ? 'flex-direction-row-reverse' : 'flex-direction-row'
                } ${state.focused ? 'active' : ''} ${disabled ? 'cursor-not-allowed' : ''}`.classNames() + 
				(!errorState.has_error ? className : input_class_error)
            }
			style={{
				height: type==='textarea' ? '100px' : undefined,
				...cssStyle
			}}
        >
            <Conditional show={iconClass}>
                <i className={iconClass} onClick={() => onIconClick()}></i>
                {separator}
            </Conditional>

            <Conditional show={image && state.expanded}>
                <img
                    src={image}
                    className={'image'.classNames(style)}
                    onClick={() => onIconClick()}
                />
                {separator}
            </Conditional>

            <Conditional show={state.expanded}>
                <Conditional show={type !== 'textarea'}>
                    <input {...attr} />
                </Conditional>

                <Conditional show={type === 'textarea'}>
                    <textarea {...attr} style={{resize: 'none'}}></textarea>
                </Conditional>
            </Conditional>
        </label>
    );
}
