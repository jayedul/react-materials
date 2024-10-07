import React from 'react';

import './prototypes.jsx';
import { getHooks } from './hooks.jsx';
import { ToastWrapper } from './toast/toast.jsx';
import { RenderExternal } from './render-external.jsx';
import { data_pointer } from './helpers.jsx';

const {app_id} = window[data_pointer];

export function MountPoint({ children }) {
	return <div className={'mountpoint font-weight-400'.classNames() + app_id}>
		<ToastWrapper>
			{children}
		</ToastWrapper>
	</div>
}

export function DoAction({ position, action, payload = {} }) {
	
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
