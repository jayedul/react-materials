import React from 'react';

export function AdminTitleHead({title, children}) {
	return <div className={'d-flex align-items-center justify-content-space-between flex-wrap-wrap column-gap-15 row-gap-15 margin-bottom-15'.classNames()}>
		<div className={'flex-1'.classNames()}>
			<strong className={'d-block font-size-24 font-weight-500 color-text-90 white-space-nowrap'.classNames()}>
				{title}
			</strong>
		</div>
		<div>
			{children}
		</div>
	</div>
}