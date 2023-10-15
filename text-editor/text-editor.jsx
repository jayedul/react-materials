import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {isEmpty} from '../helpers.jsx';
import style from './editor.module.scss';

const createEditorState = (html) => {
    const contentBlock = html ? htmlToDraft(html) : null;
    let state;

    if (contentBlock) {
        state = EditorState.createWithContent(
            ContentState.createFromBlockArray(contentBlock.contentBlocks)
        );
    } else {
        state = EditorState.createEmpty();
    }

    return state;
};

export function TextEditor({required=false, showErrorsAlways=false, onChange: dispatchTo, value: html, placeholder, session }) {
    const [state, setState] = useState({
        editorState: createEditorState(html),
        focus: false
    });

	const [htmlContents, setHtmlContents] = useState(html);
	const [errorState, setErrorState] = useState(null);

	const highlightError=()=>{
		setErrorState(required && isEmpty(htmlContents));
	}

	useEffect(()=>{
		dispatchTo(htmlContents);

		// Do not highlight at first mount
		if ( errorState === null ) {
			setErrorState(false);
			return;
		}
		highlightError();

	}, [htmlContents] );

	useEffect(()=>{
		if ( showErrorsAlways ) {
			highlightError();
		}
	}, [showErrorsAlways])

    const onChange = (editorState) => {
        setState({ ...state, editorState });
		setHtmlContents(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    };

    useEffect(() => {
        setState({
            ...state,
            editorState: createEditorState(html)
        });
    }, [session]);

    return (
        <Editor
            onFocus={() => setState({ ...state, focus: true })}
            onBlur={() => setState({ ...state, focus: false })}
            placeholder={placeholder}
            editorState={state.editorState}
            wrapperClassName={
                'wrapper'.classNames(style) +
                `border-radius-10 border-1 ${errorState ? 'b-color-error' : 'b-color-tertiary b-color-active-primary' } ${
                    state.focus ? 'active' : ''
                }`.classNames()
            }
            editorClassName={'editor'.classNames(style)}
            toolbarClassName={'toolbar'.classNames(style)}
            toolbar={{
                options: ['inline', 'fontSize', 'list']
            }}
            onEditorStateChange={onChange}
        />
    );
}
