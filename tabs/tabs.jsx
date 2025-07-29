import React, { useEffect, useRef, useState } from 'react';

import * as style from './tabs.module.scss';

export function Tabs(props) {
	
    const { 
		onNavigate, 
		active, 
		tabs = [], 
		theme, 
		className = '', 
		style: cssStyle = {}, 
		scrollIntoViewOnChange=false 
	} = props;

    const active_index = tabs.findIndex((tab) => tab.id == active);

	const ref = useRef();

	const [state, setState] = useState({
		mounted: false
	});

	useEffect(()=>{
		if ( ! scrollIntoViewOnChange ) {
			return;
		}
		
		if ( !state.mounted ) {
			setState({...state, mounted: true});
			return;
		}

		// Brig the tab at the top
		if( ref?.current ) {
			ref.current.scrollIntoView(true);
		}

	}, [active]);

    return (
        <div
            className={`tabs theme-${theme}`.classNames(style) + className}
            style={cssStyle}
			ref={ref}
        >
            {tabs.map((tab, index) => {
                let { id, label } = tab;

                let fill_class = '';
                fill_class += index <= active_index ? 'fill-left ' : '';
                fill_class += index < active_index ? 'fill-right' : '';
                fill_class += index == active_index ? 'fill-right-gradient' : '';

                return (
                    <div
                        key={id}
                        className={
                            `single-step ${id === active ? 'active' : ''}`.classNames(style) +
                            `${onNavigate ? 'cursor-pointer' : ''}`.classNames()
                        }
                        onClick={() => ((onNavigate && id!=active) ? onNavigate(id) : null)}
                    >
                        {label}
                    </div>
                );
            })}
        </div>
    );
}