import React, { useEffect, useRef } from 'react';

export function WpDashboardFullPage(props) {

    const { children } = props;

	const ref = useRef();

	const setHeight=()=>{
		if ( ref?.current ) {
			ref.current.style.minHeight = (window.innerHeight - 32)+'px';
		}
	}

    useEffect(() => {
        const wrapper = document.getElementById('wpcontent');
        wrapper.style.padding = 0;
        wrapper.style.paddingLeft = 0;
        wrapper.style.paddingRight = 0;
        wrapper.style.paddingBottom = 0;
		
		setTimeout(()=>{
			if( ref?.current ) {
				ref.current.scrollIntoView(true)
			}
		}, 500);

		setHeight();
		window.addEventListener('resize', setHeight);
		return ()=>window.removeEventListener('resize', setHeight);
    }, []);

    return <div ref={ref} className={'d-flex width-p-100'.classNames()}>
		<div className={'flex-1 width-p-100'.classNames()}>
			{children}
		</div>
	</div>
}
