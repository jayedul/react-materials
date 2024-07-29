const path = require('path');
const fs = require('fs');
const { syncDirectory } = require('./sync-directory');

const to_sync = [
	{
		from: path.resolve( process.cwd() + '/node_modules/solidie-materials' ),
		to: path.resolve( process.cwd() + '../solidie-materials' )
	}
];

for ( let i=0; i<to_sync.length; i++ ) {

	const {to, from} = to_sync[i];

	if ( fs.existsSync(to) && fs.existsSync(from) ) {
		syncDirectory(from, to);
	}
}
