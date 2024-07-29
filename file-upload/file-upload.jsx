import React, { useRef, useState, useContext, useEffect } from 'react';

import style from './upload.module.scss';
import { __, getFileId, isEmpty, sprintf } from '../helpers.jsx';
import { ListFile } from '../file-list.jsx';
import { ContextToast } from '../toast/toast.jsx';

/**
 * Returns a set of options, computed from the attached image data and
 * control-specific data, to be fed to the imgAreaSelect plugin in
 * wp.media.view.Cropper
 *
 * @param {wp.media.model.Attachment} attachment
 * @param {wp.media.controller.Cropper} controller
 * @returns {object} Options
 */
function media_frame_image_cal(attachment, controller) {
    const control = controller.get('control');

    const realWidth = attachment.get('width');
    const realHeight = attachment.get('height');

    let xInit = parseInt(control.params.width, 10);
    let yInit = parseInt(control.params.height, 10);

    const ratio = xInit / yInit;

    // Enable skip cropping button.
    controller.set('canSkipCrop', true);

    const xImg = xInit;
    const yImg = yInit;

    if (realWidth / realHeight > ratio) {
        yInit = realHeight;
        xInit = yInit * ratio;
    } else {
        xInit = realWidth;
        yInit = xInit / ratio;
    }

    const x1 = (realWidth - xInit) / 2;
    const y1 = (realHeight - yInit) / 2;

    return {
        handles: true,
        keys: true,
        instance: true,
        persistent: true,
        imageWidth: realWidth,
        imageHeight: realHeight,
        minWidth: xImg > xInit ? xInit : xImg,
        minHeight: yImg > yInit ? yInit : yImg,
        x1,
        y1,
        x2: xInit + x1,
        y2: yInit + y1,
        aspectRatio: `${xInit}:${yInit}`
    };
}

function downscaleImage(file, maxWidth) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                let width = img.width;
                let height = img.height;
                
                // Downscale image if necessary
                if (width > maxWidth) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert canvas to Blob
                canvas.toBlob((blob) => {
                    const newFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    resolve(newFile);
                }, file.type, 0.8); // Adjust the quality here (0.9 for 90% quality)
            };
            img.onerror = function() {
                reject(new Error('Failed to load image.'));
            };
            img.src = event.target.result;
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read file.'));
        };
        
        reader.readAsDataURL(file);
    });
}

export function FileUpload(props) {
    const {
		minlength = 0,
        maxlength = 1,
        maxsize,
        value,
		removable=true,
        onChange,
        accept=[],
        WpMedia,
		layout,
        layoutComp,
		imageMaxWidth,
		showErrorsAlways,
		FileControl
    } = props;

    const singular = maxlength <= 1;
    const input_ref = useRef();
    const stateFiles = !isEmpty( value ) ? (Array.isArray(value) ? value : [value]) : [];
	const {addToast} = useContext(ContextToast);

    const [hoverState, setHoverState] = useState(false);
	const [errorState, setErrorState] = useState(null);

	const highlightError=()=>{
		setErrorState(minlength>stateFiles.length);
	}

	// Highlight error before form submission
	useEffect(()=>{
		if( showErrorsAlways ) {
			highlightError();
		}
	}, [showErrorsAlways]);

	// Highlight error on file upload state changes
	useEffect(()=>{
		// Don not show error on mount without interaction
		if( errorState === null ) {
			setErrorState(false);
			return;
		}

		highlightError();

	}, [stateFiles.length]);

    /**
     * Setup Crop control
     * The controls used by WordPress Admin are api.CroppedImageControl and api.SiteIconControl.
     */
    const cropControl = (WpMedia?.mime_type || '').indexOf('image')===0 ? {
        id: 'crewmat-control-id',
        params: {
            flex_width: true, // set to true if the width of the cropped image can be different to the width defined here
            flex_height: true, // set to true if the height of the cropped image can be different to the height defined here
            width: WpMedia?.width, // set the desired width of the destination image here
            height: WpMedia?.height // set the desired height of the destination image here
        }
    } : undefined;

    const _onChange = (files) => {
        onChange(singular ? files[0] : files);
    };

    const handleFiles = (files) => {
        // Convert singulars to array
        if (!(files instanceof FileList) && ! Array.isArray( files )) {
            files = [files];
        }

        // Make sure files exists
        if (!files || !files.length) {
            return;
        }

        files = Array.from(files);
        files = [...files, ...stateFiles];

        // Exclude duplicate and those that exceeds the maxsize limit
        const ids = [];
        files = files.filter((f) => {

			// Check if mime type or extension is expected
			const file_mime = f.type || f.mime_type;
			const file_name = f.name || f.file_name;

			const mime_type = file_mime.toLowerCase();
			const extension = file_name.toLowerCase().split('.').at(-1);

			if ( 
				! isEmpty( accept ) && 
				accept.indexOf(`${mime_type.split('/')[0]}/*`) === -1 && 
				accept.indexOf(mime_type) === -1 && 
				accept.indexOf(extension) === -1 && 
				accept.indexOf(`.${extension}`) === -1 
			) {
				return false;
			}

			// Check if max size crossed
			const file_size_mb = Math.floor( f.size / (1024 * 1024 ) );
			if ( maxsize && file_size_mb >= maxsize ) {
				addToast({
					message: sprintf(__('Upload failed: %s exceeds %sMB limit.'), f.name, maxsize),
					status: 'warning'
				});
				return false;
			}

			// Now check if already uploaded this file.
            let id = getFileId(f);
            let exists = ids.indexOf(id) > -1;
            ids.push(id);
            return !exists;
        });

		// Downscale image
		let queue = 0;
		for ( let i=0; i<files.length; i++ ) {
			if ( imageMaxWidth && files[i] instanceof File && files[i].type.indexOf('image/')===0 ) {
				queue++;
				downscaleImage(files[i], imageMaxWidth).then(file=>{

					files[i] = file;
					queue--;

					if ( queue === 0 ) {
						_onChange(files.slice(0, maxlength));
					}
				});
			}
		}

		if ( queue === 0 ) {
			_onChange(files.slice(0, maxlength));
		}
    };

    const removeFile = (index) => {
        const _files = stateFiles;
        _files.splice(index, 1);
        _onChange(_files);
    };

    const setActionState = (e, highlight) => {
        e.preventDefault();
        setHoverState(highlight);
    };

    const openPicker = () => {
        // Open file system media picker if notto use WP API
        if (!WpMedia) {
            input_ref.value = '';
            input_ref.current.click();
            return;
        }
		
        /**
         * Create a media modal select frame, we need to set this up every time instead of reusing if already there
         * as the toolbar button does not get reset when doing the following:
         * media_frame.setState('library');
         * media_frame.open();
         */
        const media_frame = wp.media({
            button: {
                text: __('Select'),
                close: false
            },
            states: [
                new wp.media.controller.Library({
                    title: __('Select'),
                    library: wp.media.query(WpMedia?.mime_type ? { type: WpMedia.mime_type } : undefined),
                    multiple: singular ? false : 'add',
                    date: false,
                    priority: 20,
                    suggestedWidth: WpMedia?.width,
                    suggestedHeight: WpMedia?.height
                }),
				(cropControl ? new wp.media.controller.CustomizeImageCropper({
                    imgSelectOptions: media_frame_image_cal,
                    control: cropControl
                }) : null)
            ].filter(s=>s!==null)
        });

        /**
         * After the image has been cropped, apply the cropped image data to the setting
         *
         * @param {object} croppedImage Cropped attachment data.
         */
        media_frame.on('cropped', function (croppedImage) {
            handleFiles({
                file_id: croppedImage.id,
                file_url: croppedImage.url,
                file_name: croppedImage.filename,
                mime_type: croppedImage.mime
            });
        });

        /**
         * If cropping was skipped, apply the image data directly to the setting.
         */
        media_frame.on('skippedcrop', function (selection) {
            handleFiles({
                file_id: selection.id,
                file_url: selection.get('url'),
                file_name: selection.get('filename'),
                mime_type: selection.get('mime')
            });
        });

        /**
         * After an image is selected in the media modal, switch to the cropper
         * state if the image isn't the right size.
         */
        media_frame.on('select', function () {
			const selection = media_frame.state().get('selection');

			if ( !singular ) {
				handleFiles(
					selection.map(({attributes: _attachment}) => {
						return {
							file_id: _attachment.id,
							file_url: _attachment.url,
							file_name: _attachment.filename,
							mime_type: _attachment.mime
						}
					})
				);
				
                media_frame.close();
				return;
			}

            const _attachment = selection.first().toJSON();

            if (
                !cropControl || 
				(
					cropControl.params.width === _attachment.width &&
					cropControl.params.height === _attachment.height &&
					!cropControl.params.flex_width &&
					!cropControl.params.flex_height
				)
            ) {
                handleFiles({
                    file_id: _attachment.id,
                    file_url: _attachment.url,
                    file_name: _attachment.filename,
                    mime_type: _attachment.mime
                });

                media_frame.close();
            } else {
                media_frame.setState('cropper');
            }
        });

        media_frame.open();
    };

    function Input() {
		
		let _accept = Array.isArray(accept) ? accept : [accept];

		_accept = _accept.map(a=>{
			// Slash exists means mime type, otherwise extension
			return (a.indexOf('/')>-1 || a.indexOf('.')===0) ? a : `.${a}`;
		}).join(',');

        return (
            <input
                ref={input_ref}
                type="file"
                accept={_accept}
                multiple={!singular}
                className={'d-none'.classNames()}
                onChange={(e) => {
                    handleFiles(e.currentTarget?.files || []);
                }}
            />
        );
    }

    if (layoutComp) {
        return (
            <>
                <Input />
                {layoutComp({ onClick: openPicker })}
            </>
        );
    }

	const replace_now = !removable && !isEmpty(stateFiles);
	const is_thumbnail = layout === 'thumbnail' && maxlength===1;

    return  <div className={'upload'.classNames(style)}>
		<div
			onDragOver={(e) => setActionState(e, true)}
			onDragLeave={(e) => setActionState(e, false)}
			onClick={openPicker}
			className={`drop-container ${hoverState ? 'highlight' : ''} ${errorState ? 'error' : ''}`.classNames(
				style
			)}
			onDrop={(e) => {
				handleFiles(e?.dataTransfer?.files || []);
				setActionState(e, false);
			}}
		>
			<div className={'d-flex align-items-center column-gap-15'.classNames()}>
				{
					!is_thumbnail ? null :
					<div style={{width: '150px'}} className={'position-relative'.classNames()}>
						<img 
							src={value instanceof File ? URL.createObjectURL(value) : value?.file_url} 
							className={'width-p-100 height-auto'.classNames()}
							style={{
								border: '5px solid white',
								boxShadow: '2px 2px 7px rgba(0, 0, 0, .3)',
								borderRadius: '5px'
							}}
						/>
					</div>
				}
				<div className={`flex-1 ${!is_thumbnail ? 'text-align-center' : 'text-align-left'}`.classNames()}>
					<div className={'margin-bottom-5'.classNames()}>
						<i
							className={'sicon sicon-folder-add font-size-24 color-text'.classNames()}
						></i>
					</div>

					<span
						className={'d-block font-size-15 font-weight-600 line-height-20 color-text'.classNames()}
					>
						{replace_now ? __('Replace File') : __('Browse')}
					</span>
					<span
						className={'font-size-15 font-weight-400 line-height-20 color-text'.classNames()}
					>
						{replace_now ? __('or, Just drop another') : __('or, Just drop it here')}
					</span>
				</div>
			</div>
			

			{
				is_thumbnail ? null :
				<ListFile 
					files={stateFiles} 
					onRemove={removable ? removeFile : null} 
					FileControl={FileControl}
				/>
			}
		</div>
	
		<Input />
	</div>
}
