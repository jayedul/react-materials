var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    wpPot = require('gulp-wp-pot'),
    clean = require('gulp-clean'),
    zip = require('gulp-zip'),
    fs = require('fs'),
    path = require('path');

const root_dir = process.cwd();

const {
	version: project_version, 
	name: project_name
} = require( path.resolve( root_dir, './package.json' ) );

var build_name    = `${project_name}-${project_version}.zip`;
var readable_name = project_name.replace(/(^\w|_\w)/g, s => s.replace('_', '').toUpperCase()).replace(/-/g, ' ');

var added_texts = [];
const regex = /__\(\s*'([^']*)'\s*\)/g;

function i18n_makepot(target_dir) {
	const parent_dir = target_dir;
	var translation_texts = '';

	// Loop through JS files inside js directory
	fs.readdirSync(parent_dir).forEach(function (file_name) {
		var full_path = parent_dir + '/' + file_name;

		if ( full_path.indexOf('node_modules')>-1 || full_path.indexOf('vendor')>-1 ) {
			return;
		}

		var stat = fs.lstatSync(full_path);
		if (stat.isDirectory()) {
			i18n_makepot(full_path);
			return;
		}

		// Make sure only js extension file to process
		if (stat.isFile() && path.extname(file_name) == '.jsx') {
			var codes = fs.readFileSync(full_path).toString();

			let match;
			while ((match = regex.exec(codes)) !== null) {
				let text = match[1];

				// Avoid duplicate entry
				if (added_texts.indexOf(text) > -1) {
					continue;
				}

				added_texts.push(text);
				translation_texts +=
					`\n#: dist/libraries/translation-loader.js:1\nmsgid "${text}"\nmsgstr ""\n`;
			}
		}
	});

	// Finally append the texts to the pot file
	fs.appendFileSync(
		path.resolve(root_dir, `./languages/${project_name.toLowerCase()}.pot`),
		translation_texts
	);
}

var onError = function (err) {
	console.error(err);
	this.emit('end');
};

module.exports = conf => {

	const {text_dirs_js=[], text_dirs_php=[], vendors=[]} = conf || {};

	function i18n_makepot_init(callback) {

		text_dirs_js.forEach(dir=>{
			i18n_makepot( path.resolve( root_dir, dir ) );
		});

		if ( typeof callback === 'function' ) {
			callback();
		}
	}

	gulp.task('makepot', function () {
		
		if ( !text_dirs_php.length ) {
			return gulp.src('*')
				.pipe(through.obj());
		}

		return gulp
			.src(text_dirs_php.map(d=>path.resolve(root_dir, d)))
			.pipe(
				plumber({
					errorHandler: onError
				})
			)
			.pipe(
				wpPot({
					domain: project_name,
					package: readable_name
				})
			)
			.pipe(gulp.dest(path.resolve(root_dir, `./languages/${project_name}.pot`)));
	});

	/**
	 * Build
	 */
	gulp.task('clean-zip', function () {
		return gulp
			.src( path.resolve(root_dir, `./${build_name}`), {
				read: false,
				allowEmpty: true
			})
			.pipe(clean());
	});

	gulp.task('clean-build', function () {
		return gulp
			.src( path.resolve(root_dir, './build'), {
				read: false,
				allowEmpty: true
			})
			.pipe(clean());
	});

	gulp.task('copy', function () {
		return gulp
			.src([
				'./**/*.*',
				'!./components/**',

				'!./dist/**/*.map',
				'!./dist/**/*.txt',
				'!./node_modules/**',
				'!./svn-push/**',
				'!./tests/**',

				'!.github',
				'!.git',
				
				'!./**/*.zip',
				'!./readme.md',
				'!./release.sh',
				'!.DS_Store',
				'!./**/.DS_Store',
				'!./LICENSE.txt',
				'!./*.lock',
				'!./*.js',
				'!./*.json',
				'!./*.xml'
			])
			.pipe(gulp.dest(path.resolve(root_dir, `./build/${project_name}/`)));
	});

	function optimize_vendor(callback) {

		const allowed = [...vendors, 'composer', 'autoload.php'];

		const dir = path.resolve(root_dir, `./build/${project_name}/vendor/`);
		if ( fs.existsSync(dir) ) {
			fs.readdirSync(dir).forEach(file=>{
				if ( allowed.indexOf(file) > -1 ) {
					return;
				}

				const fullPath = path.join(dir, file);
				fs.rmSync( fullPath, {recursive: true} );
			});
		}

		if (typeof callback==='function') {
			callback();
		}
	}

	gulp.task('make-zip', function () {
		// Replace the mode in build folder
		const index_path = path.resolve( root_dir, `./build/${project_name}/${project_name}.php` );
		const codes      = fs.readFileSync(index_path).toString().replace( "=> 'development',", "=> 'production'," );
		fs.writeFileSync(index_path, codes);
		
		return gulp.src(path.resolve(root_dir, './build/**/*.*')).pipe(zip(build_name)).pipe(gulp.dest(root_dir));
	});

	
	const series = [
		'clean-zip',
		'clean-build',
		'copy',
		optimize_vendor,
		'make-zip',
		'clean-build'
	];

	if (text_dirs_js.length) {
		series.splice(2, 0, i18n_makepot_init);
	}

	if (text_dirs_php.length) {
		series.splice(2, 0, 'makepot');
	}

	return {
		build: gulp.series(...series)
	}
}
