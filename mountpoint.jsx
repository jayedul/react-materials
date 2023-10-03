import React from 'react';
import { getHooks } from './hooks.jsx';
import { ToastWrapper } from './toast/toast.jsx';
import { WarningWrapper } from './warning/warning.jsx';
import { RenderExternal } from './render-external.jsx';

export function MountPoint({ children }) {
	return (
		<div data-crewhrm-selector="root" className={'root margin-bottom-15'.classNames()}>
			<ToastWrapper>
				<WarningWrapper>{children}</WarningWrapper>
			</ToastWrapper>
		</div>
	);
}

function DoAction(props) {
	let { position, action, payload = {} } = props;
	let handlers = getHooks(action + (position ? '_' + position : ''), 'action_hooks');

	return handlers.map((handler) => {
		let { data:{component}, key } = handler;
		return <RenderExternal key={key} component={component} payload={payload}/>
	});
}

export function Slot(props) {
	const { children, name } = props;

	return (
		<>
			<DoAction position="before" action={name} />
			{children}
			<DoAction position="after" action={name} />
		</>
	);
}
