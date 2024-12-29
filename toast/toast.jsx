import React, { createContext, useEffect, useRef, useState } from 'react';

import { __, data_pointer, getRandomString } from '../helpers.jsx';
import * as style from './toast.module.scss';
import { Ripple } from '../dynamic-svg/ripple.jsx';

import icon_success from '../static/images/Icon-check.svg';
import icon_warning from '../static/images/Icon-info-circle.svg';
import icon_error from '../static/images/Icon-cross.svg';

export const ContextToast = createContext();

const status_icons = {
    success: icon_success,
    warning: icon_warning,
    error: icon_error
};

export function ToastWrapper({children, configs={}}) {
    const ref = useRef();

    const [state, setState] = useState({
        mouse_over: false,
        toasts: []
    });

    const registerCloser = (id) => {
        setTimeout(() => {
            if (!state.mouse_over) {
                dismissToast(id);
            } else {
                registerCloser(id);
            }
        }, 4000);
    };

    const addToast = (toast) => {
        const new_id = getRandomString();
        const { toasts = [] } = state;

        if (typeof toast === 'string') {
            toast = {
                message: toast,
                dismissible: true
            };
        }

        // Push new toast in the array
        toasts.push({
            ...toast,
            id: new_id
        });

        // Update state with the toasts
        setState({
            ...state,
            toasts
        });

        // Register closer to close it after certain times
        registerCloser(new_id);
    };

    const ajaxToast = (response) => {
        const { success, data } = typeof response === 'object' ? response || {} : {};
        const { message, status } = data || {};

        addToast({
            message: message ? message : (success ? __('Done') : __('Something went wrong!')),
            dismissible: true,
            status: status || (success ? 'success' : 'error')
        });
    };

    const dismissToast = (id) => {
        const { toasts = [] } = state;
        const index = toasts.findIndex((t) => t.id === id);
        toasts.splice(index, 1);
        setState({
            ...state,
            toasts
        });
    };

    const setMouseState = (over) => {
        setState({
            ...state,
            mouse_over: over
        });
    };

    // Scroll to last to show latest one
    useEffect(() => {
        if (!state.toasts.length || !ref?.current) {
            return;
        }
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [state.toasts.length]);

    return <ContextToast.Provider value={{ addToast, ajaxToast }}>

		{children}

		{
			!state.toasts.length ? null :
			<div
				ref={ref}
				className={`toast ${configs.top ? 'top' : ''}`.classNames(style)}
				onMouseOver={() => setMouseState(true)}
				onMouseOut={() => setMouseState(false)}
			>
				{state.toasts.map((toast) => {

					const { id, message, dismissible, onClick, status, image } = toast;

					const _img = image || status_icons[status];

					return <div
						key={id}
						className={`d-flex align-items-center border-radius-5`.classNames()}
						onClick={e=>{
							if ( onClick ) {
								e.stopPropagation();
								onClick();
							}
						}}
					>
						<div
							className={`flex-1 d-flex align-items-center row-gap-10 padding-15`.classNames()}
						>
							<div
								className={'d-inline-flex'.classNames()}
							>
								{
									!_img ? 
									<Ripple color={window[data_pointer].colors?.text || '#000000'}/> : 
									<img 
										className={'padding-5'.classNames()} 
										src={_img}
										style={{
											width: '36px', 
											height: image ? '36px' : 'auto', 
											objectFit: image ? 'cover' : 'initial', 
											objectPosition: 'center'
										}}
									/>
								}
							</div>

							<span
								className={`d-inline-block margin-left-10 font-size-15 font-weight-500 line-height-18 color-text`.classNames()}
							>
								{message}
							</span>
						</div>

						{
							!dismissible ? null :
							<div
								className={`d-flex flex-direction-column border-left-1 b-color-text-60`.classNames()}
							>
								{
									!dismissible ? null :
									<div
										className={'padding-vertical-10 padding-horizontal-20'.classNames()}
									>
										<span
											className={`font-size-13 font-weight-500 line-height-22 color-text cursor-pointer`.classNames()}
											onClick={e => {
												e.stopPropagation();
												dismissToast(id);
											}}
										>
											{__('Dismiss')}
										</span>
									</div>
								}
							</div>
						}
					</div>
				})}
			</div>
		}
	</ContextToast.Provider>
}
