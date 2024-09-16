import React from 'react';
import { getFileId, getHighestUnitFromBytes } from './helpers.jsx';

export function ListFile({ files, style = {}, onRemove, FileControl }) {
	const _files = Array.isArray(files) ? files : [files];

	return _files.map((file, index) => {
		const is_upload = file instanceof File;
		const file_name = is_upload ? file.name : file.file_name;
		const file_id   = getFileId(file);

		return <div key={file_id} className={'d-flex align-items-center column-gap-15 margin-top-10'.classNames()}>
			<div
				className={'flex-1 d-flex align-items-center column-gap-15 padding-vertical-10 padding-horizontal-20 border-radius-10 border-1 b-color-text-40 bg-color-white'.classNames()}
				style={{cursor: 'default', ...style}}
				onClick={e=>e.stopPropagation()}
			>
				<span
					className={'flex-1 font-size-15 font-weight-400 line-height-19 color-text'.classNames()}
				>
					{file_name}
				</span>

				{
					!is_upload ? null :
					<span
						className={'font-size-14 font-weight-400 line-height-19 color-text-60'.classNames()}
					>
						{getHighestUnitFromBytes(file.size)}
					</span>
				}

				{
					typeof onRemove !== 'function' ? null :
					<i
						className={'sicon sicon-times cursor-pointer font-size-15 color-text-40 interactive'.classNames()}
						onClick={(e) =>onRemove(index)}
					></i>
				}
			</div>
			{
				!FileControl ? null : <FileControl file={file}/>
			}
		</div> 
	});
}
