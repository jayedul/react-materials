import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import {ErrorBoundary} from './error-boundary.jsx';
import {getRandomString} from './helpers.jsx';

export function RenderExternal({className='', component: Comp, payload={}}) {

	if ( ! Comp ) {
		return null;
	}

	const reff = useRef();
	const is_internal = Comp.length!==2; // 2 means it is from external script.

	useEffect(()=>{
		// If not internal componenet, call the function, so it can render their contents. 
		if ( ! is_internal && reff?.current) {
			Comp(reff.current, {session: getRandomString(), payload});
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

export function mountExternal( id, el, session, component) {

	const att  = 'data-solidie-mountpoint';
	const _ses = el.getAttribute(att);

	el.setAttribute('data-solidie-mountpoint', session);
	
	if ( _ses !== session ) {
		createRoot(el).render(component);
	}
}
