import React, { useEffect, useRef } from "react";

function isFunctionNameCapitalized(func) {
  if (typeof func === 'function') {
    const functionName = func.name;
    if (functionName.length > 0) {
      const firstChar = functionName.charAt(0);
      return /^[A-Z]/.test(firstChar); // Check if it starts with a capital letter, so it is a React component.
    }
  }
  return false;
}

export function RenderExternal({component: Comp, payload={}}) {

	const reff = useRef();
	const is_component = isFunctionNameCapitalized(Comp);

	useEffect(()=>{
		if ( ! is_component && reff && reff.current) {
			Comp(reff.current, payload);
		}

	}, [Comp, reff.current]);

	return is_component ? <Comp {...payload}/> : <div ref={reff}></div>
}
