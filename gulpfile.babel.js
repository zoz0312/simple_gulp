import gulp from 'gulp';
import gulpPug from 'gulp-pug';
import gulpImage from 'gulp-image';
import del from 'delete';
import ws from 'gulp-webserver';

const routes = {
  pug: {
    watch: 'src/**/*.pug',
    src: 'src/*.pug',
    dest: 'build'
  },
  img: {
    src: 'src/img/*',
    dest: 'build/img',
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
  port: '8080',
  livereload: true,
  // open: true,
}));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
}

const img =() => gulp
  .src(routes.img.src)
  .pipe(gulpImage())
  .pipe(gulp.dest(routes.img.dest));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
