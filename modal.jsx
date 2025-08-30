import React from 'react';
import { Popup } from './popup/index.jsx';

export function Modal(props) {
	const {
		trigger,
		children,
		nested = false,
		open = true,
		closeOnDocumentClick=false,
		onClose = () => {},
		style: cssStyle = {},
		overlayStyle
	} = props;

	return <Popup
		on={[]}
		open={open}
		darken={true}
		arrow={false}
		nested={nested}
		closeOnDocumentClick={closeOnDocumentClick}
		trigger={trigger}
		onClose={onClose}
		overlayStyle={overlayStyle}
		contentStyle={{ ...cssStyle }}
	>
		<div>{children}</div>
	</Popup>
}
