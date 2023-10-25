import React, {useEffect, useRef, useState} from 'react';

import style from './intro.module.scss';

import megaphone from '../static/images/megaphone.png';
import designer_working from '../static/images/designer-working.png';
import being_creative from '../static/images/being-creative.png';

const images = {
    megaphone,
    designer_working,
    being_creative
};

export function IntroCard(props) {
    const { image, className = '', orientation = 'horizontal', style: cssStyle={} } = props;

    const is_horizontal = orientation == 'horizontal';
    const image_url = images[image];
	const ref_wrapper = useRef();
	const [imageState, setImageState] = useState();

	const setImage=()=>{
		setImageState(ref_wrapper.current.offsetWidth>500);
	}

	useEffect(()=>{
		if ( ref_wrapper?.current && is_horizontal ) {
			setImage();
			window.addEventListener('resize', setImage);
			return ()=>window.removeEventListener('resize', setImage);
		}
	}, [ref_wrapper, is_horizontal]);

    return (
        <div
			ref={ref_wrapper}
            data-crew={'intro-card-' + orientation}
            className={
                `intro orientation-${orientation}`.classNames(style) +
                'bg-color-white border-radius-5'.classNames() +
                className
            }
            style={{ backgroundImage: imageState ? 'url(' + image_url + ')' : '', ...cssStyle }}
        >
            <div style={imageState ? {width: 'calc(100% - 230px)'} : {}}>
				{props.children}
			</div>
            <div className={'image'.classNames(style)}>
                {(!is_horizontal && <img src={image_url} />) || null}
            </div>
        </div>
    );
}
