import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import {ErrorBoundary} from './error-boundary.jsx';
import {data_pointer} from './helpers.jsx';

export function RenderExternal({className='', component: Comp, payload={}}) {

	if ( ! Comp ) {
		return null;
	}

	const reff = useRef();
	const is_internal = Comp.length!==2; // 2 means it is from external script.

	useEffect(()=>{
		// If not internal componenet, call the function, so it can render their contents. 
		if ( ! is_internal && reff?.current) {
			Comp(reff.current, payload);
		}
	}, [payload]);

	// If internal component, then simply embed as usual. External component can only be called as function through useEffect hook.
	return is_internal ? 
			<ErrorBoundary>
				<Comp className={className} {...payload}/>
			</ErrorBoundary> 
			: 
			<div ref={reff} className={className}></div>
}

export function mountExternal( id, el, component) {

	const {mountpoints={}} = window[data_pointer];
	const current_session = el.getAttribute('data-solidie-mountpoint') === id;

	el.setAttribute('data-solidie-mountpoint', id);

	if ( ! current_session || ! mountpoints[id] ) {
		window[data_pointer].mountpoints[id] = createRoot(el);
	}

	window[data_pointer].mountpoints[id].render(component);
}
