import React, { useEffect, useRef } from "react";
import { isFirstLetterCapitalized } from "./helpers.jsx";

export function RenderExternal({component: Comp, payload={}}) {

	const reff = useRef();

	const func_string = Comp.toString();
	const is_component = func_string.indexOf('function ')===0 && isFirstLetterCapitalized(func_string.replace('function ', ''));

	useEffect(()=>{

		console.log(is_component, func_string);

		if ( ! is_component && reff && reff.current) {
			Comp(reff.current, payload);
		}

	}, [Comp, reff.current]);

	return is_component ? <Comp {...payload}/> : <div ref={reff}></div>
}
