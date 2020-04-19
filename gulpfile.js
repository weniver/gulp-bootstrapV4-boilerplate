var gulp = require("gulp"),
  del = require("del"),
  path = require("path"),
  browserify = require("browserify"),
  source = require("vinyl-source-stream"),
  buffer = require("vinyl-buffer"),
  babelify = require("babelify"),
  include = require("gulp-include"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  sourcemaps = require("gulp-sourcemaps"),
  autoprefixer = require("autoprefixer"),
  babel = require("gulp-babel"),
  uglify = require("gulp-uglify"),
  postcssFlex = require("postcss-flexbugs-fixes"),
  postcssSvg = require("postcss-svg"),
  postcssAssets = require("postcss-assets"),
  rename = require("gulp-rename"),
  clean = require("gulp-clean"),
  browserSync = require("browser-sync").create(),
  notify = require("gulp-notify"),
  cssnano = require("gulp-cssnano"),
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant"),
  svgmin = require("gulp-svgmin"),
  ttf2woff = require("gulp-ttf2woff"),
  ttf2woff2 = require("gulp-ttf2woff2"),
  ttf2eot = require("gulp-ttf2eot"),
  replace = require("gulp-replace");

//BrowserSync

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    notify: true,
    open: false
  });
});

//Styles task

gulp.task("styles", function() {
  var processors = [
    autoprefixer(),
    postcssFlex()
  ];
  return gulp
    .src("src/assets/stylesheets/style.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({ includePaths: ["node_modules"] }).on("error", notify.onError())
    )
    .pipe(postcss(processors).on("error", notify.onError()))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.stream());
});

//Pug task

gulp.task("html", function() {
  return (
    gulp
      .src("src/views/**/*.html")
      //changes path src of images to match dist path
      .pipe(replace("../assets/img", "img"))
      .pipe(gulp.dest("dist"))
  );
});

gulp.task("js", function() {
  return browserify({
    entries: "./src/assets/js/scripts.js",
    paths: ["node_modules", "src/assets/js"],
    debug: false
  })
    .transform("babelify", { presets: ["@babel/env"] })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(
      uglify().on(
        "error",
        notify.onError(function(error) {
          return "Message to the notifier: " + error.message;
        })
      )
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/js/"));
});

//optimization img(jpg,png)

gulp.task("optimizationIMG", () => {
  return gulp
    .src("src/assets/img/**/*.+(png|jpg)")
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()]
      })
    )
    .pipe(gulp.dest("dist/img/"));
});

//optimization svg

gulp.task("optimizationSVG", function() {
  return gulp
    .src(["src/assets/img/**/*.svg"])
    .pipe(svgmin())
    .pipe(gulp.dest("dist/img/"));
});

//ttf to woff

gulp.task("ttf2woff", function(done) {
  //you pass callback function that we have called "done" to notify when the promise resolvers
  gulp
    .src(["src/assets/fonts/*.ttf"])
    .pipe(ttf2woff())
    .pipe(gulp.dest("src/assets/fonts/"));
  done();
});

//ttf to woff2

gulp.task("ttf2woff2", function(done) {
  //you pass callback function that we have called "done" to notify when the promise resolvers
  gulp
    .src(["src/assets/fonts/*.ttf"])
    .pipe(ttf2woff2())
    .pipe(gulp.dest("src/assets/fonts/"));
  done();
});

//ttf to eot

gulp.task("ttf2eot", function(done) {
  //you pass callback function that we have called "done" to notify when the promise resolvers
  gulp
    .src(["src/assets/fonts/*.ttf"])
    .pipe(ttf2eot())
    .pipe(gulp.dest("src/assets/fonts/"));
  done();
});

//Task moving fonts to dist folder

gulp.task("fonts", function(done) {
  gulp.src(["src/assets/fonts/**/*"]).pipe(gulp.dest("dist/fonts/"));
  done();
});

// Clean task

gulp.task("clean", function() {
  return gulp
    .src("dist", { read: false })
    .pipe(clean())
    .pipe(notify("dist folder was removed"));
});

//Gulp watcher

gulp.task("watch", function() {
  gulp.watch("src/assets/stylesheets/**/*.scss", gulp.parallel("styles"));
  gulp.watch("src/views/**/*.html", gulp.parallel("html"));
  gulp.watch("dist/**/*.html").on("change", browserSync.reload);
  gulp.watch("src/assets/js/**/*.js", gulp.parallel("js"));
  gulp.watch("dist/js/scripts.js").on("change", browserSync.reload);

  var svgWatcher = gulp.watch(
    ["src/assets/img/**/*.svg"],
    gulp.parallel("optimizationSVG")
  );
  var imgWatcher = gulp.watch(
    ["src/assets/img/**/*.png", "src/assets/img/**/*.jpg"],
    gulp.parallel("optimizationIMG")
  );

  function watcher(task) {
    task.on("unlink", function(filepath) {
      var filePathFromSrc = path.relative(
        path.resolve("src/assets/img"),
        filepath
      );
      var destFilePath = path.resolve("dist/img", filePathFromSrc);
      del.sync(destFilePath);
    });
  }

  watcher(svgWatcher);
  watcher(imgWatcher);
});

//Important Tasks
gulp.task(
  "default",
  gulp.series(
    "fonts",
    "optimizationIMG",
    "optimizationSVG",
    gulp.parallel("styles", "html", "js"),
    gulp.parallel("browser-sync", "watch")
  )
);

gulp.task("convertFonts", gulp.series("ttf2woff", "ttf2eot", "ttf2woff2"));

gulp.task("cb", gulp.series("clean", "convertFonts", "default"));
