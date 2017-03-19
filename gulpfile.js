var fs = require('fs');
var path = require('path');

var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// these plugins do not seem to register with load-plugins
var	browserSync	=	require('browser-sync');
var htmlreplace = require('gulp-html-replace');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var serve = require('gulp-serve');
var	nunjucksRender = require('gulp-nunjucks-render');

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['gulp-configs'].directories;


// css tasks  ******************************************

gulp.task('min-css', function() {
    return gulp.src('src/css/theme.css', {base: 'src'})
        .pipe(customPlumber('Error Running	min-css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist'));
});

//  concat the minified (CAUTION: superfish is from bower
// but does not come with .min see min-superfish)
gulp.task('concatCss', function () {
    return gulp.src(['src/scripts/vendor/bootstrap/dist/css/*.min.css',
                    '!src/scripts/vendor/bootstrap/dist/css/*map' ])
        .pipe(concatCss("vendor.min.css"))
        .pipe(gulp.dest('dist/css'));
});

// html tasks
gulp.task('replace-min:html', function () {
    return gulp.src('src/*.html')
        .pipe(customPlumber('Error Running	replace-min:html'))
        .pipe(htmlreplace({
            'css' : ['<link rel="stylesheet" href="css/theme.css">',
                    '<link rel="stylesheet" href="css/vendor.min.css">'],
            'js-vendor' : '<script src="scripts/vendor.min.js"></script>'
        }))
        .pipe(plugins.htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true
        }))
        .pipe(gulp.dest('dist'))
});


// js tasks  ***********************************//

gulp.task('concat-js:vendor', function() {
    return gulp.src(['./src/scripts/vendor/jquery/dist/jquery.min.js',
                    './src/scripts/vendor/bootstrap/dist/js/bootstrap.min.js',
                    './src/scripts/vendor/jquery/external/sizzle/dist/sizzle.min.js'])
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(gulp.dest('./dist/scripts'));
});


gulp.task('min:JS', function () {
    // returns a Node.js stream, but no handling of error messages
    return gulp.src('src/scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});


// utility tasks   *******************************************
gulp.task('images',	function()	{
    return	gulp.src('src/images/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(plugins.newer('dist/images'))
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/images'))
});

gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ]).then(function () {
        done();
    });
});


gulp.task('watch', ['browserSync', 'sass'],	function(){
    gulp.watch('src/sass/*.scss',	['sass']);
    //	Other	watchers
    //	Reloads	the	browser	when	a	JS	file	is	saved
    gulp.watch('src/scripts/**/*.js',	browserSync.reload);
});

function	errorHandler(err)	{
    //	Logs	out	error	in	the	command	line
    console.log(err.toString());
    //	Ends	the	current	pipe,	so	Gulp	watch	doesn't	break
    this.emit('end');
}

function	customPlumber(errTitle)	{
    return	plugins.plumber({
        errorHandler:	plugins.notify.onError({
            //	Customizing	error	title
            title:	errTitle	||	"Error	running	Gulp",
            message:	"Error:	<%=	error.message	%>"
        })
    });
}

gulp.task('browserSync', function()	{
    browserSync({
        server:	{
            baseDir: 'src'
        }
    })
});

gulp.task('serve:dist', serve('dist'));
gulp.task('serve:src', serve('src'));
//
// gulp.task('build', function (done) {
//     runSequence(
//         'clean', 'min-css', 'concat-min:js', 'replace-min:html', 'copy',
//         done);
// });