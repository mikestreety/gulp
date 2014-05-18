var basePaths = {
	src: './public/assets/',
	bower: './bower_components/'
};
var paths = {
	styles: {
		src: basePaths.src + 'sass/',
		dest: basePaths.src + 'css/min/'
	},
	sprite: {
		src: basePaths.src + 'sprite/*',
		dest: basePaths.src + 'images/'
	},
	scripts: {
		src: basePaths.src + 'js/src/',
		dest: basePaths.src + 'js/min/'
	}
};

var appFiles = {
	styles: paths.styles.src + '**/*.scss',
	scripts: [paths.scripts.src + 'scripts.js']
};

var vendorFiles = {
	styles: '',
	scripts: ''
};

var spriteConfig = {
	imgName: 'sprite.png',
	cssName: '_sprite.scss',
	imgPath: '/assets/images/sprite.png' // Gets put in the css
};

/*
	Let the magic begin
*/

var gulp = require('gulp');

var args = require('yargs').argv;
var es = require('event-stream');

var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});

// Allows gulp --dev to be run for a more verbose output
var isProduction = true;
var sassStyle = 'compressed';
var sourceMap = false;

if(args.dev === true) {
	sassStyle = 'expanded';
	sourceMap = true;
	isProduction = false;
}

// Functions for displaying various outputs
var displayError = function(error) {
	var errorString = '[' + error.plugin + ']';
	errorString += ' ' + error.message.replace("\n",'');
	if(error.fileName)
		errorString += ' in ' + error.fileName;
	if(error.lineNumber)
		errorString += ' on line ' + error.lineNumber;
	console.error(errorString);
};

var changeEvent = function(evt) {
	console.log(
		'[watcher] File ' + evt.path.replace(new RegExp('/.*(?=' + basePaths.src.replace('.', '') + ')/'), '') + ' was ' + evt.type + ', running...'
	);
};

gulp.task('css', function(){

	var sassFiles = gulp.src(appFiles.styles)
	.pipe(plugins.rubySass({
		style: sassStyle, sourcemap: sourceMap, precision: 2
	}))
	.on('error', function(err){
		displayError(err);
	});

	return es.concat(gulp.src(vendorFiles.styles), sassFiles)
		.pipe(plugins.concat('style.min.css'))
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(plugins.if(isProduction, plugins.combineMediaQueries({
			log: true
		})))
		.pipe(plugins.if(isProduction, plugins.cssmin()))
		.pipe(plugins.size())
		.pipe(gulp.dest(paths.styles.dest));
});

gulp.task('scripts', function(){

	return es.concat(gulp.src(vendorFiles.scripts), gulp.src(appFiles.scripts))
		.pipe(plugins.concat('app.js'))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(plugins.if(isProduction, plugins.uglify()))
		.pipe(plugins.size())
		.pipe(gulp.dest(paths.scripts.dest));

});

/*
	Sprite Generator
*/
gulp.task('sprite', function () {
	var spriteData = gulp.src(paths.sprite.src).pipe(plugins.spritesmith({
		imgName: spriteConfig.imgName,
		cssName: spriteConfig.cssName,
		imgPath: spriteConfig.imgPath,
		cssVarMap: function (sprite) {
			sprite.name = 'sprite-' + sprite.name;
		}
	}));
	spriteData.img.pipe(gulp.dest(paths.sprite.dest));
	spriteData.css.pipe(gulp.dest(paths.styles.src));
});

gulp.task('watch', ['sprite', 'css', 'scripts'], function(){
	gulp.watch(appFiles.styles, ['css'])
	.on('change', function(evt) {
		changeEvent(evt);
	});
	gulp.watch(paths.scripts.src + '*.js', ['scripts'])
	.on('change', function(evt) {
		changeEvent(evt);
	});
});

gulp.task('default', ['css', 'scripts']);
