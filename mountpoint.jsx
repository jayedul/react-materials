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

function DoAction({ position, action, payload = {} }) {
	
	let handlers = getHooks(action + (position ? '_' + position : ''), 'action_hooks');

	return handlers.map((handler) => {
		let { data:{component}, key } = handler;
		return <RenderExternal key={key} component={component} payload={payload}/>
	});
}

export function Slot({ children, name, payload }) {
	return (
		<>
			<DoAction position="before" action={name} payload={payload}/>
			{children}
			<DoAction position="after" action={name} payload={payload}/>
		</>
	);
}
