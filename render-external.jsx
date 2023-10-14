import React, { useEffect, useRef } from "react";

import {ErrorBoundary} from './error-boundary.jsx';

export function RenderExternal({component: Comp, payload={}}) {
	if ( ! Comp ) {
		return null;
	}

	const reff = useRef();
	const is_component = Comp.length!==2; // 2 means function callback, not component.

	useEffect(()=>{
		if ( ! is_component && reff && reff.current) {
			Comp(reff.current, payload);
		}

	}, [Comp, reff.current]);

	return is_component ? <ErrorBoundary><Comp {...payload}/></ErrorBoundary> : <div ref={reff}></div>
}
