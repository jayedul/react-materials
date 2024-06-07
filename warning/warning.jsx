import React, { createContext, useState } from 'react';

import style from './warning.module.scss';
import { __ } from '../helpers.jsx';
import { LoadingIcon } from '../loading-icon/loading-icon.jsx';
import { Modal } from '../modal.jsx';

export const ContextWarning = createContext();

const btn_class =
    'font-size-15 font-weight-400 letter-spacing--3 padding-vertical-10 padding-horizontal-15 border-radius-5 border-1 b-color-text-40 cursor-pointer'.classNames();

export function WarningWrapper({ children }) {
	
	const initial = {
		message: null,
        onConfirm: () => {},
        onClose: () => {},
        confirmText: null,
        closeText: null,
		mode: 'normal'
	}
	
    const [state, setState] = useState({...initial});
    const [loading, setLoading] = useState(false);

    const closeWarning = () => {
        if ( typeof state.onClose==='function' ) {
            state.onClose();
        }

        setState({...initial});
        setLoading(false);
    };

    return (
        <ContextWarning.Provider value={{
			showWarning: w=>setState({...state, ...w}), 
			closeWarning, 
			loadingState: setLoading
		}}>
            {!state.message ? null : (
                <Modal>
					<div
						className={
							'confirm'.classNames(style) +
							'padding-vertical-40 padding-horizontal-50 text-align-center'.classNames()
						}
					>
						<span
							className={'d-block font-size-24 font-weight-500 line-height-32 letter-spacing--3 color-text margin-bottom-30'.classNames()}
						>
							{state.message || __('Sure to proceed?')}
						</span>
						<button
							className={
								'cancel-button'.classNames(style) + btn_class + 'margin-right-20'.classNames()
							}
							onClick={() => closeWarning()}
						>
							{state.closeText || __('Cancel')}
						</button>
						<button
							disabled={loading}
							className={`action-button ${state.mode}`.classNames(style) + btn_class}
							onClick={() => state.onConfirm()}
						>
							{state.confirmText || __('OK')} <LoadingIcon show={loading}/>
						</button>
					</div>
                </Modal>
            )}
            {children}
        </ContextWarning.Provider>
    );
}
