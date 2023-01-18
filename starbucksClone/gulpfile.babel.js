import gulp from "gulp";
import gpug from "gulp-pug";
import ws from "gulp-webserver";
import minCSS from "gulp-csso";
// var csso = require('gulp-csso');
import bro from "gulp-bro";
import babelify from "babelify";
import sourcemaps from "gulp-sourcemaps";
// const sourcemaps = require('gulp-sourcemaps');

// import ts from "gulp-typescript";
// const ts = require("gulp-typescript");

// const tsProject = ts.createProject("tsconfig.json");

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');


const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build/"
  },
  img: {
    src: "src/img/*",
    dest: "build/img"
  },
  scss: {
    watch:"src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css"
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js"
  },
  // typescript: {
  //   watch: "src/ts/**/*.ts",
  //   src: "src/ts/index.ts",
  //   dest: 'build/js',
  // },
};

const pug = () =>
  gulp
    .src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));

const styles = () => 
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(sourcemaps.init({largeFile: true}))

    .pipe(minCSS({
      restructure: false,
      sourceMap: true,
      debug: true
    }))

    .pipe(gulp.dest(routes.scss.dest))

const webserver = () =>
   gulp
    .src("build")
    .pipe(ws({livereload: true, open: true}));

const js = () => 
  gulp
    .src(routes.js.src)
    .pipe(bro({
      transform: [
        babelify.configure({ presets: ["@babel/preset-env"] }),
        [ 'uglifyify', { global: true } ]
      ]
    }))
    .pipe(gulp.dest(routes.js.dest));



const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  // gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

//오류 생략
// const img = () => 
//   gulp.src(routes.img.src)
//   .pipe(image())
//   .pipe(gulp.dest(routes.img.dest));

const assets = gulp.series([pug, styles, js]);
const postDev = gulp.parallel([webserver, watch]);
//parallel 두가지 task를 병행할 수 있음

export const dev = gulp.series([assets, postDev]);