// Defining requirements
const { src, dest, watch, series} = require('gulp');
const sass      = require('gulp-sass')(require('sass')); 
const prefix    = require('gulp-autoprefixer');
const minify    = require('gulp-clean-css');
const terser    = require('gulp-terser');
const imagemin  = require('gulp-imagemin');
const imagewebp = require('gulp-webp');

// Configuration file to keep your code DRY
var cfg   = require( './gulpconfig.json' );
var paths = cfg.paths

//compile, prefix, and min scss
function compilescss() {
  return src( paths.sass + '/*.scss')
    .pipe(sass())
    .pipe(prefix('last 2 versions'))
    .pipe(minify())
    .pipe(dest( paths.dist + '/css')) 
};

//optimize and move images
function optimizeimg() {
  return src( paths.imgsrc + '/*.{jpg,png}') 
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 80, progressive: true }),
      imagemin.optipng({ optimizationLevel: 2 }),
    ]))
    .pipe(dest( paths.dist + '/images'))
};

//optimize and move images
function webpImage() {
  return src( paths.imgsrc + '/*.{jpg,png}') 
    .pipe(imagewebp())
    .pipe(dest( paths.dist + '/images' ))
};


// minify js
function jsmin(){
  return src( paths.js + '//*.js') 
    .pipe(terser())
    .pipe(dest('dist/js'));
}

//watchtask
function watchTask(){
  watch( paths.sass + '/**/*.scss', compilescss); 
  watch( paths.js + '/*.js', jsmin);
  watch( paths.imgsrc + '/*', optimizeimg); 
  watch( paths.imgsrc + '/*.{jpg,png}', webpImage);
}


/* Gulp Task Runner - Run on gulp command */
exports.default = series(
  compilescss,
  jsmin,
  optimizeimg,
  webpImage,
  watchTask
);