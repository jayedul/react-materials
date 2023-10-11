import React from 'react';

import style from './loading.module.scss';
import { Conditional } from '../conditional.jsx';

export function LoadingIcon({
    show = true,
    center = false,
    className
}) {
    return (
        <Conditional show={show}>
            <div
                data-crewhrm-selector="loading-icon"
                className={
                    `${center ? 'd-block text-align-center' : 'd-inline-block'}`.classNames() +
                    className
                }
            >
                <i className={'ch-icon ch-icon-loading'.classNames() + 'rotate'.classNames(style)}></i>
            </div>
        </Conditional>
    );
}
