import React, { useEffect, useRef } from "react";

export function RenderExternal({component: Comp, payload={}}) {
	if ( ! Comp ) {
		return null;
	}

	const reff = useRef();
	const is_component = Comp.toString().indexOf('createRoot')===-1;

	console.log( 'Log1 - ', Comp.toString(), is_component );

	useEffect(()=>{
		if ( ! is_component && reff && reff.current) {

			console.log('Log 2 - ', reff.current, payload);

			Comp(reff.current, payload);
		}

	}, [Comp, reff.current]);

	return is_component ? <Comp {...payload}/> : <div ref={reff}></div>
}
