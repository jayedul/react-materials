import React from 'react';
import { getHooks } from './hooks.jsx';
import { ToastWrapper } from './toast/toast.jsx';
import { WarningWrapper } from './warning/warning.jsx';

export function MountPoint({ children }) {
	return (
		<div data-crewhrm-selector="root" className={'root margin-bottom-15'.classNames()}>
			<ToastWrapper>
				<WarningWrapper>{children}</WarningWrapper>
			</ToastWrapper>
		</div>
	);
}

export function DoAction(props) {
	let { position, action, payload = {} } = props;
	let handlers = getHooks(action + (position ? '_' + position : ''), 'action_hooks');

	return handlers.map((handler) => {
		let { data:{component: Comp}, key } = handler;
		return <Comp key={key} {...payload} />;
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
