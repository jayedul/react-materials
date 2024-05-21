import React from 'react';
import { getFileId } from './helpers.jsx';
import { Conditional } from './conditional.jsx';

export function ListFile({ files, style = {}, onRemove }) {
	const _files = Array.isArray(files) ? files : [files];

	return _files.map((file, index) => {
		const file_name = file instanceof File ? file.name : file.file_name;
		const file_id = getFileId(file);

		return <div
			key={file_id}
			className={'d-flex align-items-center column-gap-14 padding-vertical-10 padding-horizontal-20 margin-top-10 border-radius-10 border-1 b-color-tertiary bg-color-white'.classNames()}
			style={{cursor: 'default', ...style}}
			onClick={e=>e.stopPropagation()}
		>
			<span
				className={'flex-1 font-size-15 font-weight-400 line-height-19 color-text'.classNames()}
			>
				{file_name}
			</span>

			<Conditional show={typeof onRemove == 'function'}>
				<i
					className={'ch-icon ch-icon-times cursor-pointer font-size-15 color-text-lighter color-hover-text'.classNames()}
					onClick={(e) =>onRemove(index)}
				></i>
			</Conditional>
		</div>
	});
}
