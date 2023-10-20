import React, { useContext } from "react";
import { ColCounter, ContextColCounter } from "./col-counter.jsx";

function RLayout({children, cardGap=15, className=''}) {
	const {column_count=3} = useContext(ContextColCounter);

	const style = {
		display: 'grid',
		gap: cardGap+'px',
		gridTemplateColumns: 'repeat('+column_count+', 1fr)'
	}
	
	return <div style={style} className={className}>
		{children}
	</div>
}

export function ResponsiveLayout() {
	return <ColCounter columnWidth={props.columnWidth}>
		<RLayout {...props}/>
	</ColCounter>
}

export function Ratio({children, x, y}) {
	return <div style={{display: 'grid', gridTemplateColumns: '1fr'}}>
		<div style={{aspectRatio: x + ' / ' + y}}>
			{children}
		</div>
	</div>
}
