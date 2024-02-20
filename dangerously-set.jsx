import React from 'react';

function replaceURLsWithAnchorsAndEmbeds(htmlString) {
  // Regular expression to match URLs, excluding YouTube URLs
  const urlRegex = /(\b(https?|ftp):\/\/(?!(www\.)?(youtube\.com|youtu\.be))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  // Regular expression to match YouTube video URLs
  const youtubeRegex = /(\b(https?|ftp):\/\/(www\.)?(youtube\.com|youtu\.be)\/watch\?v=([a-zA-Z0-9_-]+))/gi;

  return htmlString.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`;
  }).replace(youtubeRegex, (youtubeUrl) => {
    const videoId = youtubeUrl.match(/v=([^&]*)/)[1];
    return `<iframe width="100%" height="415" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  });
}

export function DangerouslySet(props) {
	let { style = {}, className, children } = props;
	return (
		<div
			className={className}
			style={style}
			dangerouslySetInnerHTML={{ __html: replaceURLsWithAnchorsAndEmbeds( children || '' ) }}
		></div>
	);
}
