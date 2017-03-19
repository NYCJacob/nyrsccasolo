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
    return gulp.src(['src/css/*.css', '!src/css/*.min.css'], {base: 'src'})
        .pipe(customPlumber('Error Running	min-css'))
        .pipe(concatCss("styles.min.css"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('min-superfish', function () {
    return gulp.src('src/scripts/vendor/superfish/dist/css/*.css', {base: 'src'})
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concatCss("superfish.min.css"))
        .pipe(gulp.dest('./src/css'));
});

//  concat the minified (CAUTION: superfish is from bower
// but does not come with .min see min-superfish)
gulp.task('concatCss', function () {
    return gulp.src(['src/css/*.min.css', 'src/scripts/vendor/**/*.min.css'])
        .pipe(concatCss("css/styles.min.css"))
        .pipe(gulp.dest('dist'));
});

// html tasks
gulp.task('replace-min:html', function () {
    return gulp.src('src/*.html')
        .pipe(htmlreplace({
            'css' : '<link rel="stylesheet" href="css/styles.min.css">'
        }))
        .pipe(plugins.htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('minHTML', function() {
    return gulp.src('src/*.html')
        .pipe(plugins.htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true
        }))
        .pipe(gulp.dest('dist'));
});


// js tasks  ***********************************//
gulp.task('jslint', function () {
    return gulp.src('src/scripts/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
});

gulp.task('concat-min:js', function() {
    return gulp.src('./src/scripts/*.js')
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('concat-min:vendor', function() {  // need to exclude knockout because undefined error when concat ko inot vendor
    return gulp.src(['./src/scripts/vendor/**/*.js', '!./src/scripts/vendor/knockout/**/*.js'])
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./dist/scripts/vendor'));
});

gulp.task('min:JS', function () {
    // returns a Node.js stream, but no handling of error messages
    return gulp.src('src/scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});


// utility tasks   *******************************************
gulp.task('images',	function()	{
    return	gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(plugins.newer('dist/images'))
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/img'))
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

// todo: resolve this minified issue
// vendor js files copied instead of minified because of undefined errors on module.exports when minified
gulp.task('copy', function () {
    return gulp.src(['src/font-awesome-4.7.0/**/*', 'src/img/**/*', 'src/scripts/vendor/**/*.js'], {
        base: 'src'
    }).pipe(gulp.dest('dist'));
});

gulp.task('serve:dist', serve('dist'));
gulp.task('serve:src', serve('src'));

gulp.task('build', function (done) {
    runSequence(
        'clean', 'min-css', 'concat-min:js', 'replace-min:html', 'copy',
        done);
});