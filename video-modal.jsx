import React, {useState} from 'react';
import {RenderMediaPreview} from './render-media/render-media.jsx';

export function VideoModal({video_url, thumbnail_url}) {
	const [showModal, setModalState] = useState(false);

	return <>
		{
			!showModal ? null : 
				<RenderMediaPreview 
					onClosePreview={()=>setModalState(false)}
					attachment={{
						media_type: "youtube",
						file_url: video_url
					}}/>
		}
		<div className={'position-relative'.classNames()}>
			<img src={thumbnail_url} className={'width-auto height-auto d-block'.classNames()}/>
			<div 
				className={'position-absolute left-0 right-0 top-0 bottom-0 d-flex align-items-center justify-content-center cursor-pointer'.classNames()}
				onClick={()=>setModalState(!showModal)}
			>
				<i className={'sicon sicon-play-cropped color-white font-size-24'.classNames()}></i>
			</div>
		</div>
	</> 
}
