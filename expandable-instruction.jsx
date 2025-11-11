import React, {useState} from 'react';

import {VideoModal} from './video-modal.jsx';
import {Conditional} from './conditional.jsx';

export function ExpandableInstruction(props) {
	const {
		title,
		description,
		video_url,
		thumbnail_url,
		children: content
	} = props;

	const [expanded, setExpand] = useState(false);

	return <table className={'width-p-100 border-collapse-collapse font-size-14 font-weight-400 line-height-28 color-text'.classNames()}>
		<tbody>
			<tr>
				{
					!video_url ? null : <td style={{width: '130px', paddingRight: '24px'}}>
						<VideoModal video_url={video_url} thumbnail_url={thumbnail_url}/>
					</td>
				}
				
				<td className={'cursor-pointer'.classNames()} onClick={()=>setExpand(!expanded)}>
					<strong className={'d-block font-size-18 font-weight-400 line-height-30 color-text margin-bottom-5'.classNames()}>
						{title}
					</strong>
					<span className={'d-block font-size-14 font-weight-400 line-height-23 color-text'.classNames()}>
						{description}
					</span>
				</td>
				<td className={'text-align-right cursor-pointer'.classNames()} onClick={()=>setExpand(!expanded)}>
					<i className={`jcon ${expanded ? 'jcon-minus-cirlce' : 'jcon-add-circle'} font-size-30 cursor-pointer`.classNames()}></i>
				</td>
			</tr>
			<Conditional show={expanded}>
				<tr>
					{!video_url ? null : <td></td>}
					<td colSpan={2}>
						{content}
					</td>
				</tr>
			</Conditional>
		</tbody>
	</table>
}
