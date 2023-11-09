import React from "react";

import { Popup } from "./popup/index.jsx";

export function ToolTip({children, tooltip, position="left center", className=''}) {
	return <Popup
		disabled={!tooltip}
		on="hover"
		position={position}
		closeOnDocumentClick={true}
		trigger={open => (
			<div className={className}>
				{children}
			</div>
		)}
	>
		<span className={"bg-color-white border-1 b-color-tertiary box-shadow-thick border-radius-5 padding-vertical-10 padding-horizontal-15".classNames()}>
			{tooltip}
		</span>
	</Popup>
}
