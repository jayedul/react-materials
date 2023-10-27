import React, { useEffect, useRef, useState } from 'react';
import { __ } from '../helpers.jsx';
import { Conditional } from '../conditional.jsx';

import style from './exp.module.scss';

export function ExpandableContent(props) {
    const [state, setState] = useState({
        expanded: false,
        show_control: false
    });

    const wrapper_ref = useRef();
    const content_ref = useRef();
    let {
        children,
        see_more_text = __('See full view'),
        see_less_text = __('See short view'),
        className = '',
    } = props;

    const adjustLayout = () => {
        if (!wrapper_ref.current || !content_ref.current) {
            return;
        }

        const { offsetHeight: wrapper_height } = wrapper_ref.current;
        const { offsetHeight: content_height } = content_ref.current;
        const show_control = content_height > wrapper_height;

        setState({
            ...state,
            show_control,
            expanded: false
        });
    };

    const toggleView = () => {
        setState({
            ...state,
            expanded: !state.expanded
        });
    };

    useEffect(() => {
        adjustLayout();
        window.addEventListener('resize', adjustLayout);

        return () => {
            window.removeEventListener('resize', adjustLayout);
        };
    }, [children]);

    return (
        <div data-crew="expandable-content" className={className}>
            <div
                data-crew="content"
                ref={wrapper_ref}
                className={`exp-wrapper ${state.expanded ? 'expanded' : ''}`.classNames(style)}
            >
                <div ref={content_ref} className={'content'.classNames(style)}>
                    {children}
                </div>

				<Conditional show={state.show_control && !state.expanded}>
					<div
                        data-crew="overlay"
                        className={'overlay'.classNames(style)}
                    ></div>
				</Conditional>
            </div>

			<Conditional show={state.show_control}>
				<span
                    data-crew="controller"
                    className={'d-inline-block font-size-15 font-weight-500 line-height-22 letter-spacing--15 color-text cursor-pointer margin-top-10 hover-underline'.classNames()}
                    onClick={toggleView}
                >
                    {state.expanded ? see_less_text : see_more_text}
                </span>
			</Conditional>
        </div>
    );
}
