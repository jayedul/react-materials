import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const ContextHistoryFields = createContext();

function addToHistory(obj_value, { index, history }) {
	// Remove nexts from current index just like how code editor keep track of history
	history.splice(index + 1);

	// Copy the last history and merge the changed value with that
	let latest = history[history.length - 1] || {};
	latest = { ...latest, ...obj_value };

	// Put the new entry to the history queue
	history.push(latest);

	return {
		index: history.length - 1,
		history
	};
}

export function UndoRedo() {
	const { onUndoRedo, historyLength, index } = useContext(ContextHistoryFields);

	const unDoRedo = (shift) => {
		onUndoRedo(shift);
	};

	const detectUndoRedoShortcut = useCallback(
		(event) => {
			if (event.metaKey || event.ctrlKey) {
				if (event.key === 'z' || event.keyCode === 90) {
					unDoRedo(event.shiftKey ? 1 : -1);
					event.preventDefault();
				} else if (event.key === 'y' || event.keyCode === 89) {
					unDoRedo(1);
					event.preventDefault();
				}
			}
		},
		[index]
	);

	useEffect(() => {
		document.addEventListener('keydown', detectUndoRedoShortcut);

		return () => {
			document.removeEventListener('keydown', detectUndoRedoShortcut);
		};
	}, [detectUndoRedoShortcut]);

	const can_undo = index > 0;
	const can_redo = index < historyLength - 1;

	return (
		<div className={'d-flex align-items-center column-gap-30'.classNames()}>
			<i
				className={`ch-icon ch-icon-undo font-size-26 ${
					can_undo ? 'color-text cursor-pointer' : 'color-text-hint'
				}`.classNames()}
				onClick={() => (can_undo ? unDoRedo(-1) : 0)}
			></i>
			<i
				className={`ch-icon ch-icon-redo font-size-26 ${
					can_redo ? 'color-text cursor-pointer' : 'color-text-hint'
				}`.classNames()}
				onClick={() => (can_redo ? unDoRedo(1) : 0)}
			></i>
		</div>
	);
}

export function HistoryFields({ defaultValues = {}, children }) {
	
	const [state, setState] = useState({
		index: 0,
		history: [defaultValues]
	});

	const onChange = (name, value) => {
		const { index = 0, history = [] } = state;
		const obj_value = typeof name === 'object' ? name : { [name]: value };

		// Finally update state
		setState({
			...state,
			...addToHistory(obj_value, { index, history })
		});
	};

	const onUndoRedo = (shift) => {
		const { index, history = [] } = state;
		const historyLength = history.length;

		if ((shift === 1 && index >= historyLength - 1) || (shift === -1 && index <= 0)) {
			// Prevent out of boundary
			return;
		}

		setState({
			...state,
			index: index + shift
		});
	};

	const clearHistory = (replaceWith) => {
		const { index, history } = state;

		setState({
			...state,
			index: 0,
			history: [replaceWith || history[index] || {}]
		});
	};

	const payload = {
		// These to for child components to store value on change and access them
		onChange,
		clearHistory,
		values: state.history[state.index] || {},
		can_go_next: state.index>0,

		// These three are supposed to be used internally by UndoRedo component
		onUndoRedo,
		index: state.index,
		historyLength: state.history.length
	};

	return <ContextHistoryFields.Provider value={payload}>
		{children}
	</ContextHistoryFields.Provider>
}
