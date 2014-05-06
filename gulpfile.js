var gulp = require('gulp');

var args = require('yargs').argv;
var es = require('event-stream');

var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});

var basePaths = {
	src: './html/',
	bower: './bower_components/'
}
var paths = {
	styles: {
		src: basePaths.src + 'css/sass/',
		dest: basePaths.src + 'css/min/',
		files: '**/*.scss'
	},
	sprite: {
		src: basePaths.src + 'sprite/*',
		dest: basePaths.src + 'images/'
	},
	scripts: {
		src: basePaths.src + 'js/src/',
		dest: basePaths.src + 'js/min/'
	}
}

var displayError = function(error) {
	var errorString = '[' + error.plugin + ']';
	errorString += ' ' + error.message.replace("\n",'');
	if(error.fileName)
		errorString += ' in ' + error.fileName;
	if(error.lineNumber)
		errorString += ' on line ' + error.lineNumber;
	console.error(errorString);
}

var sassStyle = 'compressed';
var sourceMap = false;

// Allows gulp --dev to be run for a more verbose output
if(args.dev === true) {
	sassStyle = 'expanded';
	sourceMap = true;
}

var changeEvent = function(evt) {
	console.log(
		'[watcher] File ' + evt.path.replace(/.*(?=html)/,'') + ' was ' + evt.type + ', compiling...'
	);
}

gulp.task('css', function(){
	// Any extra stylesheets you wish to compile with - pass in an array
    var vendorFiles = gulp.src('');

    var appFiles = gulp.src(paths.styles.src + paths.styles.files)
	.pipe(plugins.rubySass({
		style: sassStyle, sourcemap: sourceMap, precision: 2
	}))
	.on('error', function(err){
		displayError(err);
	})

	if(args.dev === true)
		appFiles.pipe(gulp.dest(paths.styles.dest))

    return es.concat(vendorFiles, appFiles)
		.pipe(plugins.concat('style.min.css'))
		.pipe(plugins.autoprefixer(
			'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
		))
		.pipe(gulp.dest(paths.styles.dest))
});

gulp.task('scripts', function(){
	gulp.src([
		paths.scripts.src + 'scripts.js'
	])
	.pipe(plugins.concat('app.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(plugins.rename('app.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(paths.scripts.dest))
});

/*
	Sprite Generator
*/
gulp.task('sprite', function () {
	var spriteData = gulp.src(paths.sprite.src).pipe(plugins.spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.scss',
		imgPath: '/assets/images/sprite.png', // Gets put in the css
		cssVarMap: function (sprite) {
			sprite.name = 'sprite-' + sprite.name;
		}
	}));
	spriteData.img.pipe(gulp.dest(paths.sprite.dest));
	spriteData.css.pipe(gulp.dest(paths.styles.src));
});

gulp.task('watch', ['sprite', 'css', 'scripts'], function(){
	gulp.watch(paths.styles.src + paths.styles.files, ['css'])
	.on('change', function(evt) {
		changeEvent(evt)
	});
	gulp.watch(paths.scripts.src + '*.js', ['scripts'])
	.on('change', function(evt) {
		changeEvent(evt)
	});
})

gulp.task('default', ['css', 'scripts']);
