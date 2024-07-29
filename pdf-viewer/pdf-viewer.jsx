import React, { useEffect, useRef, useState } from 'react';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import { Conditional } from '../conditional.jsx';

import { CircularProgress } from '../circular.jsx';
import { __, data_pointer } from '../helpers.jsx';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import './pdf.scss'; 

export function PDFViewer({ src, defaultScale }) {
	const ref_wrapper = useRef();
	const [state, setState] = useState({
		error: false,
		loaded: false,
	});

	useEffect(()=>{
		if ( state.loaded && ref_wrapper?.current ) {
			const el = ref_wrapper.current.getElementsByClassName('rpv-page-navigation__current-page-input')[0]?.nextElementSibling;
			const number = parseInt( el.textContent.match(/\d+(\.\d+)?/g) );
			
			el.innerHTML = `<span>
				<span class="${'font-size-15 font-weight-400 color-text margin-left-5 margin-right-5'.classNames()}">of</span>
				<span class="${'font-size-15 font-weight-600 color-text'.classNames()}">${number}</span>
			</span>`
		}
	}, [ref_wrapper, state.loaded]);

	const defaultLayoutPluginInstance = defaultLayoutPlugin();
	return (
		<div
			ref={ref_wrapper}
			className='solidie-pdf-viewer'
			style={
				state.error || !state.loaded
					? {}
					: {height: 690, width: '100%' }
			}
		>
			<Worker workerUrl={`${window[data_pointer]?.dist_url}libraries/pdf.worker.js`}>
				<Viewer
					defaultScale={defaultScale}
					fileUrl={src}
					plugins={[defaultLayoutPluginInstance]}
					renderError={() => setState({ ...state, error: true })}
					onDocumentLoad={() => setState({ ...state, loaded: true })}
					renderLoader={(percentages) => (
						<div
							className={'d-flex flex-direction-column row-gap-15 align-items-center justify-content-center'.classNames()}
						>
							<CircularProgress
								size={50}
								strokeWidth={3}
								percentage={Math.round(percentages)}
								showPercent={true}
								fontSize={13}
							/>

							<div>{__('Loading Document')}</div>
						</div>
					)}
				/>
			</Worker>

			<Conditional show={state.error}>
				<div className={'color-error'.classNames()}>
					{__('Failed to open PDF.')} <a href={src} target="_blank" rel="noreferrer">
						{__('Download Instead.')}
					</a>
				</div>
			</Conditional>
		</div>
	);
}
