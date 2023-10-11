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
                className={
                    `${center ? 'd-block text-align-center' : 'd-inline-block'}`.classNames() +
                    className
                }
            >
                <i className={'ch-icon ch-icon-loading d-inline-block position-relative top-2'.classNames() + 'rotate'.classNames(style)}></i>
            </div>
        </Conditional>
    );
}
