import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import {ErrorBoundary} from './error-boundary.jsx';
import {data_pointer, getRandomString} from './helpers.jsx';

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

	// Create place for the element
	if ( ! window[data_pointer].mountpoints[id]  ) {
		window[data_pointer].mountpoints[id] = {};
	}

	const m_point = window[data_pointer].mountpoints[id];

	// Unmount older root if session changed
	if ( m_point.root && m_point.session !== session ) {
		m_point.root.unmount();
		m_point.root = null;
	}

	// Create new root if none exist
	if ( ! m_point.root ) {
		m_point.root = createRoot(el);
	}

	// Rerender if session not same
	if ( m_point.session !== session ) {
		m_point.session = session;
		m_point.root.render(component);
	}
}
