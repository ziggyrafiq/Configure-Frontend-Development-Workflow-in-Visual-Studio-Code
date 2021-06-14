/// <binding />

// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');

// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const html5 = require('gulp-html');
var replace = require('gulp-replace');
var cssmin = require('gulp-cssmin');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');


// File paths
const files = {
    //scssPath: 'Dev-Assests/Styles/SCSS/**/*.scss',
    scssPath: 'Styles/SCSS/**/*.scss',
    jsPath: 'Scripts/JS/**/*.js',
    tsPath: 'Scripts/TS/**/*.ts',
    imagePath: 'Images/**/*',
    htmlPath: '**/*.html'
};

// Sass task: compiles the style.scss file into app-style.css
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass()) // compile SCSS to CSS
        //.pipe(postcss([autoprefixer(), cssnano()])) 
        //.pipe(sourcemaps.write('.'))
       // .pipe(dest('../Build/Styles')
       .pipe(cssmin())
       .pipe(rename({suffix: '.min'}))
       .pipe(dest('Styles/CSS/')
        );
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
    return src([files.jsPath])
        .pipe(concat('app-scripts.js'))
        .pipe(uglify())
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
//        .pipe(dest('../Build/Scripts')
.pipe(dest('Scripts/')
        );
}


// TS task: concatenates and uglifies JS files to script.js
function tsTask() {
    return src([files.tsPath])
    .pipe(ts({
        noImplicitAny: true,
        outFile: 'app-ts-scripts.js'
    }))
    .pipe(concat('app-ts-scripts.js'))
    .pipe(uglify())
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('Scripts/')
    );
}

//image task
function imageTask() {
    return src([files.imagePath])
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7
        }))
        .pipe(dest('Images/')
        );
}


//html task
function htmlTask() {
    return src([files.htmlPath])
        //.pipe(html5.copy(true))
        .pipe(dest('../Build')
        );
}



function watchTask() {
    watch([files.scssPath, files.jsPath,files.tsPath, files.imagePath],
        { interval: 1000, usePolling: true }, //Makes docker work
        series(
            parallel(scssTask, jsTask,tsTask, imageTask)

        )
    );
}
// Export the default Gulp task so it can be run
// Runs the scss, js & image tasks simultaneously, 
//then watch task
exports.default = series(
    parallel(scssTask, jsTask,tsTask, imageTask),
    watchTask
);