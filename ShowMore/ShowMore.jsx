import React from 'react';
import IndexCss from './index.module.scss';

// eslint-disable-next-line react/prop-types
export default function ShowMore({ text = 'Show additional option', expand = false, reverse = false, image = false }) {
	return (
		<div
			className={
				`d-flex align-items-center column-gap-15 cursor-pointer
                ${reverse == true ? 'flex-direction-row-reverse' : ''}
                `.classNames() + 'show-more'.classNames(IndexCss)
			}
		>
			{image && <img src={image} alt="" />}
			{!image && (
				<div
					className={
						`show-more-icon ${expand == true ? 'expand' : ''} `.classNames(IndexCss)
					}
				>
					<span></span>
					<span></span>
				</div>
			)}
			<div className={'font-size-15 font-weight-500 line-height-24'.classNames()}>{text}</div>
		</div>
	);
}
