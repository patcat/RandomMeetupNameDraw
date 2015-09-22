var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	notify = require('gulp-notify'), // Pop up messages
	gutil = require('gulp-util'), // Gulp logs
	nodemon = require('gulp-nodemon'), // Node server running

	/* ------------- CSS ------------- */
	sass = require('gulp-sass'),
	minifycss = require('gulp-minify-css'),

	/* ------------- JS ------------- */
	browserify = require('browserify'),
	watchify = require('watchify'),
	reactify = require('reactify'),

	// For parsing in text streams into Browserify
	source = require('vinyl-source-stream'),

	/* ------------- Files ------------- */
	rename = require('gulp-rename'),

	/* ------------- Locations ------------- */
	sourceFolder = 'src',
	publicFolder = 'public',
	sourceTemplateFolder = sourceFolder + '/template',
	destTemplateFolder = publicFolder,
	sourceJSFile = sourceFolder + '/js/app.js',
	destJSFolder = publicFolder + '/js/',
	destJSFile = 'main.js',
	sourceSASSFolder = sourceFolder + '/scss'
	sourceSASS = sourceSASSFolder + '/styles.scss',
	destCSSFolder = publicFolder + '/css/',
	sourceImagesFolder = sourceFolder + '/images',
	destImagesFolder = publicFolder + '/images',
	sourceFontsFolder = sourceFolder + '/fonts',
	destFontsFolder = publicFolder + '/fonts';

/* -----------------------------------
 * 	 JavaScript Compilation
 * ----------------------------------- */
function runBrowserify() {
	var b = browserify({
				cache: {},
				packageCache: {},
				fullPaths: true
			});

	b.transform(reactify);

	b = watchify(b);

	b.on('update', function() {
		runBundle(b);
	});

	b.add(sourceJSFile);

	runBundle(b);
}

function runBundle(b) {
	b.bundle()
	 .on('error', gutil.log)
     .pipe(source(destJSFile))
     .pipe(gulp.dest(destJSFolder))
     .pipe(notify("JS updated"))
     .pipe(browserSync.stream());
}

gulp.task('browserify', function() {
	runBrowserify();
});

/* -----------------------------------
 * 	 CSS Compilation
 * ----------------------------------- */
gulp.task('styles', function() {
  return gulp.src(sourceSASS)
    .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
    .pipe(gulp.dest(destCSSFolder))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(destCSSFolder))
    .pipe(notify("CSS updated"));
});

/* -----------------------------------
 * 	 Images copying
 * ----------------------------------- */
gulp.task('copyimages', function() {
   gulp.src(sourceImagesFolder + '/**/*')
   .pipe(gulp.dest(destImagesFolder));
});

/* -----------------------------------
 * 	 Font copying
 * ----------------------------------- */
gulp.task('copyfonts', function() {
   gulp.src(sourceFontsFolder + '/**/*.{ttf,woff,woff2,eot,svg}')
   .pipe(gulp.dest(destFontsFolder));
});

/* -----------------------------------
 * 	 Template copying
 * ----------------------------------- */
gulp.task('copytemplate', function() {
   gulp.src(sourceTemplateFolder + '/**/*.html')
   .pipe(gulp.dest(destTemplateFolder));
});

/* -----------------------------------
 * 	 Auto compiling
 * ----------------------------------- */
gulp.task('watch', function() {
  gulp.watch(sourceSASSFolder + '/**/*', ['styles']);
});

gulp.task('watchimages', function() {
  gulp.watch(sourceImagesFolder + '/**/*', ['copyimages']);
});

gulp.task('watchtemplate', function() {
  gulp.watch(sourceTemplateFolder + '/**/*.html', ['copytemplate']);
});

gulp.task('watchfonts', function() {
  gulp.watch(sourceFontsFolder + '/**/*.{ttf,woff,eot,svg}', ['copyfonts']);
});

/* -----------------------------------
 * 	 Auto reload
 * ----------------------------------- */
gulp.watch([
	sourceFolder + '/**/*'
]).on('change', browserSync.reload);


gulp.task('serve', ['default'], function() {
	browserSync({
		server: {
			baseDir: publicFolder,
			index: 'index.html'
		}
	});
});

gulp.task('start', ['default'], function() {
	nodemon({
		script: 'index.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	});
});

/* -----------------------------------
 * 	 Gulp task
 * ----------------------------------- */
gulp.task('default', ['styles', 'browserify', 'watch', 'copyfonts', 'watchfonts', 'copytemplate', 'watchtemplate', 'watchimages']);