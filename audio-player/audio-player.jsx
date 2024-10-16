import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {data_pointer} from '../helpers.jsx';

import WaveSurfer from './wavesurfer.js';
import style from './player.module.scss';

const ContextAudioPlayer = createContext();

export function AudioPlayersWrapper({children}) {
	
	const [currentID, setCurrentID] = useState(null);

	return <ContextAudioPlayer.Provider value={{setID: setCurrentID, currentID}}>
		{children}
	</ContextAudioPlayer.Provider>
}

export function AudioPlayer({id: audio_id, src, permalink, title, thumbnail, height=40, children, footer}) {

	const {setID, currentID} = useContext(ContextAudioPlayer);
	const waveform_ref = useRef();
	const [state, setState] = useState({
		player: null,
		is_playing: false
	});

	const buildPlayer=()=>{

		const {colors={}} = window[data_pointer];

		// Create a canvas gradient
		const ctx = document.createElement('canvas').getContext('2d')
		const gradient = ctx.createLinearGradient(0, 0, 0, 130)
		gradient.addColorStop(0, colors.white)
		gradient.addColorStop(0.5, colors.white)
		gradient.addColorStop(1, colors.white)

		// Default style with a gradient
		const wavesurfer = WaveSurfer.create({
			container: waveform_ref.current,
			waveColor: gradient,
			height,
			progressColor: colors['material-50'],
			url: src,
		});
				
		wavesurfer.on('finish', function() {
			wavesurfer.play();
		});

		setState({
			...state,
			player: wavesurfer
		});
	}

	// Play pause audio on button click
	const playPause=()=>{

		if ( ! state.player ) {
			return;
		}

		if ( !state.is_playing ) {
			setID(audio_id);
		}

		state.player[state.is_playing ? 'pause' : 'play']();

		setState({
			...state,
			is_playing: !state.is_playing
		});
	}

	// Initiate player on component load
	useEffect(()=>{
		buildPlayer();
	}, []);

	// Stop audio if another one is played/resumed
	useEffect(()=>{
		if ( currentID && currentID !== audio_id && state.player ) {
			state.player.pause();
			setState({
				...state,
				is_playing: false
			});
		}
	}, [currentID]);

	return <Link 
		to={permalink}
		className={'audio'.classNames(style) + `border-radius-5`.classNames()}
		data-cylector="content-single"
		style={{
			backgroundImage: 'url('+thumbnail+')',
			cursor: permalink ? 'pointer' : 'default'
		}}
	>
		<div className={'d-flex column-gap-15'.classNames() + 'padding-15'.classNames()}>
			<div style={{width: '96px'}}>
				<img 
					src={thumbnail} 
					className={'width-p-100 height-auto border-radius-5'.classNames()}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<div 
					className={'d-flex align-items-center column-gap-15 margin-bottom-10 border-bottom-1'.classNames()}
					style={{paddingBottom: '10px', borderColor: 'rgba(255, 255, 255, 0.3)'}}
				>
					<div 
						className={'player-control'.classNames(style)} 
						onClick={(e)=>{
							e.preventDefault(); 
							e.stopPropagation();
							playPause();
						}}
					>
						<i className={`sicon ${!state.is_playing ? 'sicon-play' : 'sicon-pause'} font-size-14`.classNames()}></i>
					</div>
					<div className={'flex-1 d-flex align-items-center justify-content-space-between column-gap-15 row-gap-10'.classNames()}>
						<div>
							<span className={'color-white font-weight-500 font-size-16 line-clamp'.classNames()}>
								{title}
							</span>
						</div>
						<div>
							{children}
						</div>
					</div>
				</div>
				<div>
					<div 
						ref={waveform_ref} 
						style={{cursor: 'text'}} 
						onClick={e=>{
							e.preventDefault(); 
							e.stopPropagation();
						}}></div>
				</div>
				<div>
					{footer}
				</div>
			</div>
		</div>
	</Link>
}
