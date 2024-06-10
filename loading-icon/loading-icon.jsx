import React from 'react';

import style from './loading.module.scss';

export function LoadingIcon({ show, center = false, className }) {
    return !show ? null : <div
		className={
			`${center ? 'd-block text-align-center' : 'd-inline-block'}`.classNames() +
			className
		}
	>
		<i className={'ch-icon ch-icon-loading d-inline-block position-relative top-2 color-material-90'.classNames() + 'rotate'.classNames(style)}></i>
	</div>
}
