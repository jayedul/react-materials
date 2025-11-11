import React, { useEffect, useState } from 'react';

import { CoverImage } from '../image/image.jsx';
import { data_pointer, getFileId, isEmpty, scrollLock } from '../helpers.jsx';

import { IconImage } from '../dynamic-svg/icon-image.jsx';
import { IconAudio } from '../dynamic-svg/icon-audio.jsx';
import { IconVideo } from '../dynamic-svg/icon-video.jsx';
import { IconZip } from '../dynamic-svg/icon-zip.jsx';

import * as style from './media.module.scss';

const thumbnails = {
    image: IconImage,
    audio: IconAudio,
    video: IconVideo,
    zip: IconZip,
    other: null
};

export function RenderMedia({ media, onDelete, theme = 'grid', overlay = true }) {

    const [state, setState] = useState({
        preview_file_id: null,
		attachments: {}
    });

	useEffect(()=>{

		const meds = Array.isArray(media) ? media : [media];
		const objectifieds = {};

		for ( let i=0; i<meds.length; i++ ) {

			let attachment = meds[i];

			// Declare necessary varaibles
			let file_url, file_name, file_id, mime_type;

			/**
			 * Media format can be only two variants. And it must be maintained everywhere in this app strictly for consistency.
			 * First one is instance of File object, second one is {file_id, file_url, file_name} in case of already saved files.
			 */
			if (attachment instanceof File) {
				// Instant uploaded file
				file_url = URL.createObjectURL(attachment);
				file_name = attachment.name;
				file_id = getFileId(attachment);
				mime_type = attachment.type;
			} else {
				// Already stored file in server
				file_url = attachment.file_url;
				file_name = attachment.file_name;
				file_id = attachment.file_id;
				mime_type = attachment.mime_type;
			}

			// Determine media type
			let media_type = mime_type.slice(0, mime_type.indexOf('/'));
			if (media_type === 'application') {
				media_type = mime_type.slice(mime_type.indexOf('/') + 1);
			}

			objectifieds[file_id] = {
				file_url,
				file_name,
				mime_type,
				media_type,
				file_id
			}
		}

		setState({
			...state,
			attachments: objectifieds
		});
		
	}, [media]);

    const openPreview = (e, file_id) => {
        // Don't prevent default if it is not previewable
        if (['image', 'audio', 'video', 'pdf'].indexOf(state.attachments[file_id].media_type) === -1) {
            return;
        }

        e.preventDefault();

        setState({
            ...state,
            preview_file_id: file_id
        });
    };

	const navigateMedia=(value)=> {

		const {preview_file_id} = state;
		const file_ids = Object.keys(state.attachments);
		let index = file_ids.indexOf(preview_file_id);
		
		if ( value === 1 ) {
			index = ( index < file_ids.length -1 ) ? index + 1 : 0;
		} else if ( value === -1 ) {
			index = index > 0 ? ( index - 1 ) : file_ids.length - 1;
		}

		setState({
			...state, 
			preview_file_id: file_ids[index]
		});
	}

    return (
        <>
            {
				!state.preview_file_id ? null :
                <RenderMediaPreview
                    attachment={state.attachments[state.preview_file_id]}
                    onClosePreview={() => setState({ ...state, preview_file_id: null })}
					onNavigate={!isEmpty(state.attachments) ? navigateMedia : null}
                />
			}

            <div className={`attachments theme-${theme}`.classNames(style)}>
                {Object.keys(state.attachments).map(file_id => {
					
                    const {media_type, file_url, file_name} = state.attachments[file_id];

                    // Determine what to show as thumbnail. Image itself or icon.
                    let is_image = media_type === 'image';
                    let CompIcon = thumbnails[media_type] || thumbnails.other;
                    let thumb_image = is_image ? file_url : null;

                    return (
                        <div key={file_id} className={'position-relative'.classNames()}>
                            {
								! onDelete ? null :
                                <span
                                    className={'cursor-pointer bg-color-error width-16 height-16 d-flex align-items-center justify-content-center position-absolute'.classNames()}
                                    style={{ borderRadius: '50%', top: '-7px', right: '-7px' }}
                                    onClick={onDelete}
                                >
                                    <i
                                        className={'jcon jcon-times color-white font-size-12'.classNames()}
                                    ></i>
                                </span>
							}
							
                            <CoverImage
                                className={
                                    'single-attachment'.classNames(style) +
                                    'flex-1 border-radius-10'.classNames()
                                }
                                src={thumb_image}
                                height={125}
                            >
                                {
									!(overlay || !thumb_image) ? null :
                                    <a
                                        href={file_url}
                                        target="_blank"
                                        style={{ color: 'inherit' }}
                                        onClick={(e) => openPreview(e, file_id)}
                                        className={
                                            `attachment-overlay ${
                                                thumb_image ? 'has-thumbnail' : ''
                                            }`.classNames(style) +
                                            `d-block width-p-100 height-p-100 d-flex align-items-center justify-content-center padding-20 cursor-pointer ${
                                                thumb_image
                                                    ? ''
                                                    : 'border-1 b-color-text-40 border-radius-10'
                                            }`.classNames()
                                        }
                                    >
                                        <div
                                            className={'d-inline-block text-align-center'.classNames()}
                                        >
                                            {
												! CompIcon ? null :
                                                <CompIcon
                                                    color={
                                                        thumb_image
                                                            ? 'white'
                                                            : ((window[data_pointer]?.colors || {})['text-lighter'] || '#BBBFC3')
                                                    }
                                                />
                                            }

                                            <span
                                                className={`d-block margin-top-10 font-size-13 font-weight-400 letter-spacing--13 line-clamp ${
                                                    is_image ? 'color-white' : 'color-text-50'
                                                }`.classNames()}
												style={{lineHeight: '16px'}}
                                            >
                                                {file_name}
                                            </span>
                                        </div>
                                    </a>
                                }
                            </CoverImage>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export function RenderMediaPreview(props) {
    const {
        attachment: { mime_type, media_type, file_url },
        onClosePreview,
		onNavigate
    } = props;

    useEffect(() => {
        scrollLock(true);
        return () => scrollLock(false);
    });

    return (
        <div
            className={
                `preview media-type-${media_type}`.classNames(style) +
                'position-fixed left-0 right-0 top-0 bottom-0 d-flex align-items-center justify-content-center'.classNames()
            }
            onClick={onClosePreview}
			style={{zIndex: 999992}}
        >
			<div 
				className={'bg-color-white border-radius-10 position-relative'.classNames()} 
				style={{width: '90%', height: '90%', zIndex: 999993}}
			>
				<span
					className={'cursor-pointer bg-color-error width-20 height-20 d-flex align-items-center justify-content-center position-absolute'.classNames()}
					onClick={(e)=>{
						e.stopPropagation(); 
						onClosePreview();
					}}
					style={{ 
						borderRadius: '50%', 
						top: '5px', 
						right: '5px',
						zIndex: 999994
					}}
				>
					<i className={'jcon jcon-times color-white font-size-12'.classNames()}></i>
				</span>

				<div
					className={'width-p-100 height-p-100 d-flex align-items-center justify-content-center'.classNames()}
					onClick={(e) => e.stopPropagation()}
				>
					{
						media_type !== 'image' ? null :
						<img 
							src={file_url} 
							className={'width-auto height-auto'.classNames()} 
							style={{maxWidth: '100%', maxHeight: '100%'}}/>
					}

					{
						media_type !== 'audio' ? null :
						<audio autoPlay={true} controls={true} className={'width-p-100'.classNames()}>
							<source src={file_url} type={mime_type} />
							Your browser does not support the audio element.
						</audio>
					}

					{
						media_type !== 'video' ? null:
						<video autoPlay={true} controls={true} className={'width-p-100 height-p-100'.classNames()}>
							<source src={file_url} type={mime_type} />
							Your browser does not support the audio element.
						</video>
					}

					{
						media_type !== 'youtube' ? null :
						<iframe 
							style={{width: "100%", height: "100%", border: 0}} 
							src={file_url} 
							title="YouTube video player" 
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
							allowFullScreen></iframe>
					}
				</div>

				{
					!onNavigate ? null :
					<>
						<div 
							className={'position-absolute left-0 top-0 bottom-0 padding-horizontal-10 d-flex align-items-center cursor-pointer'.classNames() + 'prev'.classNames(style)}
							style={{zIndex: 999993}}
							onClick={(e)=>{
								e.stopPropagation();
								onNavigate(-1)
							}}
						>
							<i className={'jcon jcon-arrow-right'.classNames()} style={{top: '50%', transform: 'rotate(180deg)'}}></i>
						</div>
						<div 
							className={'position-absolute right-0 top-0 bottom-0 padding-horizontal-10 d-flex align-items-center cursor-pointer'.classNames() + 'next'.classNames(style)}
							style={{zIndex: 999993}}
							onClick={(e)=>{
								e.stopPropagation();
								onNavigate(1)
							}}
						>
							<i className={'jcon jcon-arrow-right'.classNames()} style={{top: '50%'}}></i>
						</div>
					</>
				}
			</div>
        </div>
    );
}
