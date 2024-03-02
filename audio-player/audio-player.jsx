import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import WaveSurfer from './wavesurfer.js';

import style from './player.module.scss';

export function AudioPlayer({src, permalink, title, thumbnail, height=40}) {

	const waveform_ref = useRef();
	const [state, setState] = useState({
		player: null,
		is_playing: false
	});

	const buildPlayer=()=>{

		// Create a canvas gradient
		const ctx = document.createElement('canvas').getContext('2d')
		const gradient = ctx.createLinearGradient(0, 0, 0, 150)
		gradient.addColorStop(0, 'rgb(255, 255, 255)')
		gradient.addColorStop(0.5, 'rgb(255, 255, 255)')
		gradient.addColorStop(1, 'rgb(0, 0, 0)')

		// Default style with a gradient
		const wavesurfer = WaveSurfer.create({
			container: waveform_ref.current,
			waveColor: gradient,
			height,
			progressColor: 'rgba(0, 0, 75, 0.2)',
			url: src,
		});

		setState({
			...state,
			player: wavesurfer
		});
	}

	const playPause=()=>{
		if ( ! state.player ) {
			return;
		}

		state.player[state.is_playing ? 'pause' : 'play']();

		setState({
			...state,
			is_playing: !state.is_playing
		});
	}

	useEffect(()=>{
		buildPlayer();
	}, []);

	return <Link 
		to={permalink}
		className={'audio'.classNames(style) + `border-radius-5`.classNames()}
		style={{
			backgroundImage: 'url('+thumbnail+')',
			cursor: permalink ? 'pointer' : 'default'
		}}
	>
		<div className={'d-flex column-gap-15'.classNames() + 'padding-15'.classNames()}>
			<div style={{width: '70px'}}>
				<img 
					src={thumbnail} 
					className={'width-p-100 height-auto'.classNames()}/>
			</div>
			<div className={'flex-1'.classNames()}>
				<div 
					className={'d-flex align-items-center column-gap-15 margin-bottom-10 border-bottom-1 b-color-tertiary'.classNames()}
					style={{paddingBottom: '10px'}}
				>
					<div 
						className={'player-control'.classNames(style)} 
						onClick={(e)=>{
							e.preventDefault(); 
							e.stopPropagation();
							playPause();
						}}
					>
						<i className={`ch-icon ${!state.is_playing ? 'ch-icon-play' : 'ch-icon-pause'} font-size-14`.classNames()}></i>
					</div>
					<div className={'flex-1 color-white font-weight-500 font-size-18'.classNames()}>
						{title}
					</div>
				</div>
				<div>
					<div 
						ref={waveform_ref} 
						style={{cursor: 'text'}} 
						onClick={e=>{e.preventDefault(); e.stopPropagation();}}></div>
				</div>
				<div>
		
				</div>
			</div>
		</div>
	</Link>
}
