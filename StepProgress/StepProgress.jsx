import React from 'react';
import { __ } from './helpers.jsx';
import * as IndexCss from './index.module.scss';

// eslint-disable-next-line react/prop-types
export default function StepProgress({ completedStep = 0, currentStep, totalStep, reverse = false }) {
	return (
		<div className={'d-flex align-items-center column-gap-10'.classNames()}>
			<div
				className={`flex-1
                ${reverse == true ? 'flex-direction-row-reverse' : ''}
                d-flex align-items-center justify-content-end column-gap-10 color-text font-size-15 font-weight-500`.classNames()}
			>
				<div className={'d-flex justify-content-end'.classNames()}>
					{currentStep}/{totalStep} {__('completed')}
				</div>
				<div className={'complete-progressbar'.classNames(IndexCss)}>
					<span className={'complete-progressbar-bar'.classNames(IndexCss) + 'margin-left-10'.classNames()}>
						<span
							style={{ width: `${(60 / 4) * (completedStep + 1)}px` }}
							className={'upgradeable-progressbar-bar'.classNames(IndexCss)}
						></span>
					</span>
				</div>
			</div>
		</div>
	);
}
