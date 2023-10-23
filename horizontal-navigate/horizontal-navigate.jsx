import React from 'react';

import style from './navigate.module.scss';

export function HorizontalNavigate({children, onPrevious, onNext, keepOpened=false}) {
	return <div className={'d-flex align-items-stretch'.classNames() + `navigate ${keepOpened ? 'keep-opened' : ''}`.classNames(style)}>
		<div className={'d-flex align-items-center justify-content-flex-start'.classNames() + 'control'.classNames(style)}>
			<i className={`ch-icon ch-icon-arrow-left-2 cursor-pointer font-size-17`.classNames() + 'icon'.classNames(style)} onClick={onPrevious}></i>
		</div>
		<div className={'flex-1'.classNames()}>
			{children}
		</div>
		<div className={'d-flex align-items-center justify-content-flex-end'.classNames() + 'control'.classNames(style)}>
			<i className={`ch-icon ch-icon-arrow-right-2 cursor-pointer font-size-17`.classNames() + 'icon'.classNames(style)} onClick={onNext}></i>
		</div>
	</div>
}
