import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import {ErrorBoundary} from './error-boundary.jsx';
import {getRandomString} from './helpers.jsx';

export function RenderExternal({component: Comp, payload={}}) {
	if ( ! Comp ) {
		return null;
	}

	const [sessionState, setSessionState] = useState(getRandomString());
	const reff = useRef();
	const is_internal = Comp.length!==2; // 2 means it is from external script.

	useEffect(()=>{
		// If not internal componenet, call the function, so it can render their contents. 
		if ( ! is_internal && reff && reff.current) {
			Comp(reff.current, {session: sessionState, payload});
		}
	}, [Comp, reff.current, payload]);

	// If internal component, then simply embed as usual. External component can only be called as function through useEffect hook.
	return is_internal ? <ErrorBoundary><Comp {...payload}/></ErrorBoundary> : <div ref={reff}></div>
}

const render_states={};
export function mountExternal( id, el, session, component ) {

	if ( render_states[id]?.session !== session ) {
		render_states[id] = {
			session,
			root: createRoot(el)
		}
	}

	render_states[id].root.render(component);
}
