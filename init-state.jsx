import React from 'react';
import { LoadingIcon } from './loading-icon/loading-icon.jsx';

export function InitState({ fetching, error_message }) {
	if (fetching) {
		return (
			<div className={'padding-vertical-10'.classNames()}>
				<LoadingIcon center={true} show={fetching}/>
			</div>
		);
	}

	if (error_message) {
		return (
			<div className={'bg-color-white padding-vertical-20 color-error text-align-center border-radius-5'.classNames()}>
				{error_message}
			</div>
		);
	}
}
