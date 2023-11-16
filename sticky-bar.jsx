import React from 'react';
import { Helmet } from 'react-helmet';

import {Conditional} from './conditional.jsx';
import { data_pointer } from './helpers.jsx';

import logo from './static/images/logo.svg';

export function StickyBar({ title, children, canBack, midWidth }) {
    const is_children_array = Array.isArray(children);

    return (
        <>
            <Helmet>
                <link rel="icon" type="image/x-icon" href={window[data_pointer]?.white_label?.app_logo || logo} />
                <title>{window[data_pointer]?.white_label?.app_label || 'CrewHRM'} - {title}</title>
            </Helmet>
            <div
                data-crew="sticky-bar"
				style={{zIndex: 9989, height: '68px'}}
                className={
                    'position-sticky top-32 width-p-100 padding-vertical-15 padding-horizontal-30 bg-color-white box-shadow-thin'.classNames()
                }
            >
                <div className={'d-flex align-items-center'.classNames()}>
                    {/* First column is always flex-1 */}
                    <div className={'flex-1'.classNames()}>
                        <span className={'d-flex align-items-center column-gap-15'.classNames()}>
							<Conditional show={canBack}>
								<i
									className={`ch-icon ch-icon-arrow-left cursor-pointer font-size-15 color-hover-secondary color-text`.classNames()}
									onClick={() => window.history.back()}
								></i>
							</Conditional>
                            
                            <span
                                className={'font-size-15 font-weight-500 letter-spacing--3 color-text vertical-align-middle'.classNames()}
                            >
                                {title}
                            </span>
                        </span>
                    </div>

                    {/* Second column will be either flex-1 or specific width specified. */}
                    <div
                        className={`${!midWidth ? 'flex-1' : ''} d-flex align-items-center ${
                            is_children_array ? 'justify-content-center' : 'justify-content-end'
                        }`.classNames()}
                        style={midWidth ? { width: midWidth } : {}}
                    >
                        <div>{is_children_array ? children[0] : children}</div>
                    </div>

                    {/* Third column also will be flex-1 to maintain consitent width both side regardles of middle one */}
                    {(is_children_array && (
                        <div
                            className={'flex-1 d-flex align-items-center justify-content-end'.classNames()}
                        >
                            <div>{children[1]}</div>
                        </div>
                    )) ||
                        null}
                </div>
            </div>
        </>
    );
}
