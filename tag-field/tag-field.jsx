import React from 'react';

import { isEmpty } from '../helpers.jsx';
import style from './tag.module.scss';

export function TagField({
    theme,
    value,
    options,
    onChange = () => {},
    className = '',
    behavior,
    fullWidth,
	showErrorsAlways,
	required
}) {
    const dispatchChange = (id, checked) => {
        if (behavior == 'radio') {
            onChange(id);
            return;
        }

        let _value = value;
        let index = _value.indexOf(id);

        if (index > -1) {
            _value.splice(index, 1);
        } else {
            _value.push(id);
        }

        onChange(_value);
    };

    const real_control = theme === 'button-control';

    return (
        <div
            className={
                `tag theme-${theme} ${fullWidth ? 'full-width' : ''}`.classNames(style) + className
            }
        >
            {options.map((option) => {
                const { id, label, icon } = option;
                const is_selected = behavior === 'radio' ? value === id : value.indexOf(id) > -1;

                return (
                    <div
                        key={id}
                        className={
							`${is_selected ? 'active' : ''} ${(required && isEmpty(value) && showErrorsAlways) ? 'error' : ''}`.classNames(style) +
							'd-flex align-items-center column-gap-8'.classNames()
						}
                        onClick={() => dispatchChange(id)}
                    >
						{
							!icon ? null : <div className={'d-flex'.classNames()}>
								<i className={icon + `font-size-13`.classNames()}></i>
							</div>
						}
                        {!real_control ? null : <input type={behavior} checked={is_selected} onChange={(e) => {}} />} {label}
                    </div>
                );
            })}
        </div>
    );
}
