import React, { useEffect, useState } from 'react';
import { data_pointer } from './helpers.jsx';

export function CircularProgress({
	size = 13,
	strokeWidth = 2,
	percentage = 0,
	fontSize = 6,
	color = window[data_pointer]?.colors?.primary || '#1A1A1A',
	colorSecondary = window[data_pointer]?.colors?.tertiary || '#E3E5E8',
	showPercent = false,
	className
}) {
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		setProgress(percentage);
	}, [percentage]);

	const viewBox = `0 0 ${size} ${size}`;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * Math.PI * 2;
	const dash = (progress * circumference) / 100;

	return (
		<svg width={size} height={size} viewBox={viewBox} className={className}>
			<circle
				fill="none"
				stroke={colorSecondary}
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={`${strokeWidth}px`}
			/>
			{(percentage && (
				<circle
					fill="none"
					stroke={color}
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={`${strokeWidth}px`}
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
					strokeDasharray={[dash, circumference - dash]}
					strokeLinecap="round"
					style={{ transition: 'all 0.5s' }}
				/>
			)) ||
                null}

			{(showPercent && (
				<text
					fill="black"
					fontSize={fontSize + 'px'}
					x="50%"
					y="50%"
					dy={fontSize / 2 + 'px'}
					textAnchor="middle"
				>
					{`${percentage}%`}
				</text>
			)) ||
                null}
		</svg>
	);
}
