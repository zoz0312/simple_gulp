import gulp from 'gulp';
import gulpPug from 'gulp-pug';
import gulpImage from 'gulp-image';
import gulpSass from 'gulp-sass';
import gulpAutoPrefixer from 'gulp-autoprefixer';
import gulpMinifyCss from 'gulp-csso';
import gulpBro from 'gulp-bro';

import del from 'delete';
import ws from 'gulp-webserver';
import defaultSass from 'sass';
import nodeSass from 'node-sass';
import babelify from 'babelify';

const sass = gulpSass(defaultSass);

sass.compiler = nodeSass;

const routes = {
  pug: {
    watch: 'src/**/*.pug',
    src: 'src/*.pug',
    dest: 'build'
  },
  img: {
    src: 'src/img/*',
    dest: 'build/img',
  },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/styles.scss',
    dest: 'build/css',
  },
  js: {
    watch: 'src/js/**/*.js',
    src: 'src/js/**/*.js',
    dest: 'build/js',
  }
}

const pug = () => {
  return gulp
    .src(routes.pug.src)
    .pipe(gulpPug())
    .pipe(gulp.dest(routes.pug.dest));
}

const clean = () => del(['build/']);

const webserver = () => gulp.src('build').pipe(ws({
  host: 'localhost',
  // port: '8080',
  livereload: true,
  // open: true,
}));

const img =() => gulp
  .src(routes.img.src)
  .pipe(gulpImage())
  .pipe(gulp.dest(routes.img.dest));

const styles = () => gulp
  .src(routes.scss.src)
  .pipe(sass().on('error', sass.logError))
  .pipe(gulpAutoPrefixer())
  .pipe(gulpMinifyCss())
  .pipe(gulp.dest(routes.scss.dest))

const js = () => gulp
  .src(routes.js.src)
  .pipe(gulpBro({
    transform:  [
      babelify.configure({ presets: ['@babel/preset-env'] }),
      ['uglifyify', { global: true }],
    ],
  }))
  .pipe(gulp.dest(routes.js.dest));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js)
}

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
