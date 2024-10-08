import { data_pointer, getRandomString } from './helpers.jsx';

function enqueueHook(handler, data={}, priority, pointer) {
	window[data_pointer]?.[pointer]?.push?.({
		key: getRandomString(),
		handler,
		data,
		priority
	});
}

export function getHooks(handler, pointer) {
	let hooks = window[data_pointer]?.[pointer]?.filter?.((hook) => hook.handler === handler) || [];

	// Get unique array and Sort by priority
	let priorities = [...new Set(hooks.map((h) => h.priority))];
	priorities.sort();

	let new_ar = [];
	priorities.forEach((p) => {
		hooks.forEach((h) => {
			if (h.priority === p) {
				new_ar.push(h);
			}
		});
	});

	return new_ar;
}

export function addAction(action, component, priority = 10) {
	enqueueHook(action, {component}, priority, 'action_hooks');
}

export function addFilter(action, callback, priority = 10) {
	enqueueHook(action, {callback}, priority, 'filter_hooks');
}

export function applyFilters(filter_name, data, ...args) {
	let handlers = getHooks(filter_name, 'filter_hooks');

	// Loop through fitler callback function
	for ( let i=0; i<handlers.length; i++ ) {
		data = handlers[i].data.callback(data, ...args);
	}

	return data;
}