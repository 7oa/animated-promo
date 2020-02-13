var gulp = require("gulp"),
  connect = require("gulp-connect"),
  opn = require("opn"),
  sass = require("gulp-sass"),
  pug = require("gulp-pug"),
  rimraf = require("rimraf"),
  uglify = require("gulp-uglify-es").default,
  autoprefixer = require("gulp-autoprefixer"),
  cssmin = require("gulp-cssmin"),
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant"),
  watch = require("gulp-watch"),
  rigger = require("gulp-rigger"),
  cache = require("gulp-cache"),
  browserSync = require("browser-sync"),
  pugbem = require("gulp-pugbem"),
  babel = require("gulp-babel");

var dest_path = "public";
pugbem.m = "_";

function log(error) {
  console.log(
    [
      "",
      "----------ERROR MESSAGE START----------",
      "[" + error.name + " in " + error.plugin + "]",
      error.message,
      "----------ERROR MESSAGE END----------",
      ""
    ].join("\n")
  );
  this.end();
}
// Работа с pug
gulp.task("pug", function() {
  gulp
    .src("app/templates/*.pug")
    .pipe(pug({ pretty: true, plugins: [pugbem] }))
    .on("error", log)
    .pipe(gulp.dest(dest_path + "/"))
    .pipe(browserSync.stream());
});

var autoprefixerOptions = {
  browsers: ["last 2 version"]
};
// Работа с Sass
gulp.task("sass", function() {
  gulp
    .src("app/scss/style.scss")
    .pipe(
      sass().on("error", function(error) {
        console.log(error);
      })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(cssmin())
    .pipe(gulp.dest(dest_path))
    .pipe(browserSync.stream());
});

// Работа с js
gulp.task("js", function() {
  gulp
    .src("app/js/script.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest(dest_path + "/js/"))
    .pipe(browserSync.stream());
});

// Сборка IMG
gulp.task("image", function() {
  gulp
    .src("app/img/**/*.*") //Выберем наши картинки
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
          })
        ])
      )
    )
    .pipe(gulp.dest(dest_path + "/img/")) //И бросим в public/images/
    .pipe(browserSync.stream());
});

// Такс запускает одной командой все предыдущие таски
gulp.task("build", ["pug", "sass", "js", "image"]);

// Если вы добавите какую-нибудь картинку, потом запустите задачу image и потом картинку удалите — она останется в папке public.
// Так что было бы удобно — периодически подчищать ее. Создадим для этого простой таск
gulp.task("clean", function(cb) {
  rimraf(dest_path, cb);
});

// Очистка кэша
gulp.task("clearcache", function() {
  return cache.clearAll();
});

// Слежка

gulp.task("watch", function() {
  watch(["./app/img/**/*.*"], function(event, cb) {
    gulp.start("image");
  });
  watch(["./app/templates/**/*.pug"], function(event, cb) {
    gulp.start("pug");
  });
  watch(["./app/scss/**/*.scss"], function(event, cb) {
    setTimeout(function() {
      gulp.start("sass");
    }, 500);
  });
  watch(["./app/js/**/*.js"], function(event, cb) {
    gulp.start("js");
  });
});

// Запуск сервера c лайврелоадом
gulp.task("serv_livereload", function() {
  connect.server({
    root: dest_path,
    livereload: true,
    port: 8888
  });
  opn("http://localhost:8888");
});

// Запуск сервера без лайврелоада
gulp.task("serv_no_livereload", function() {
  connect.server({
    root: dest_path,
    port: 8888
  });
  opn("http://localhost:8888");
});

browserSync.create();
var reload = browserSync.reload;
//  Запуск browserSync, и слежения за изменениями в файлах
gulp.task("server", function() {
  browserSync.init({
    server: dest_path, //Рабоччая директория
    browser: "chrome", //Запуск браузера Google Chrome
    notify: false //Не отображать уведомления browserSync в браузере
  });
});

// Задача по-умолчанию
gulp.task("default", ["server", "watch"]);

// Для ie
gulp.task("serv", ["serv_no_livereload", "watch"]);
