import React, { useEffect, useRef } from "react";

export function RenderExternal({component: Comp, payload={}}) {
	if ( ! Comp ) {
		return null;
	}

	const reff = useRef();
	const is_component = Comp.toString().indexOf('createRoot')===-1;

	useEffect(()=>{
		if ( ! is_component && reff && reff.current) {
			Comp(reff.current, payload);
		}

	}, [Comp, reff.current]);

	return is_component ? <Comp {...payload}/> : <div ref={reff}></div>
}
