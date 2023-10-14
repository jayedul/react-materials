import React from 'react';

export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <i className={'color-error'.classNames()}>
				Something went wrong!
			</i>
		}

		return this.props.children; 
	}
}
