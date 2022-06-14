const packageJSON = require('./package.json');
const g3w         = require('./config');

// Gulp
const gulp        = require('gulp');
const cleanCSS    = require('gulp-clean-css');
const concat      = require('gulp-concat');
const flatten     = require('gulp-flatten');
const htmlreplace = require('gulp-html-replace');
const gulpif      = require('gulp-if');
const less        = require('gulp-less');
const prompt      = require('gulp-prompt');
const rename      = require('gulp-rename');
const replace     = require('gulp-replace');
const uglify      = require('gulp-uglify');
const gutil       = require('gulp-util');
const useref      = require('gulp-useref'); // used to parse build block of the template

const buffer      = require('vinyl-buffer');
const source      = require('vinyl-source-stream');

const del         = require('del');
const fs          = require('fs');
const md5         = require('md5');
const path        = require('path');

///////////////////////////////////////////////////////
const babelify    = require('babelify');
const browserSync = require('browser-sync');
const browserify  = require('browserify');
const esmify      = require('esmify');
const httpProxy   = require('http-proxy');
const karma       = require('karma');
const imgurify    = require('imgurify');
const LessGlob    = require('less-plugin-glob');
const stringify   = require('stringify');
const vueify      = require('vueify');
const watchify    = require('watchify');

// TODO: make use of "process.env" instead of setting local variables
let production = false;
// let build_all = true;

// used to check if changes are done on these files without upload new file with no changes
const hashtable = {
  vendor: {
    js: {
      hash: null,
    },
    css: {
      hash: null
    }
  },
  app: {
    js: {
      hash: null
    },
    css: {
      hash: null
    }
  }
};

// Retrieve project dependencies ("g3w-client")
const dependencies = Object.keys(packageJSON.dependencies).filter(dep => dep !== 'vue');

// production const to set enviromental variable
function setNODE_ENV() {
  process.env.NODE_ENV = production ? 'production' : 'development';
}

setNODE_ENV();

gulp.task('clean:dist',   () => del([`${g3w.distFolder}/**/*`], { force: true }));
gulp.task('clean:vendor', () => del([`${g3w.clientFolder}/js/vendor.node_modules.min.js`], {force: true}));
gulp.task('clean:app',    () => del([`${g3w.clientFolder}/js/app.js`, `${g3w.clientFolder}/css/app.css`], { force: true }));
gulp.task('clean:admin',  () => del([`${g3w.admin_static_folder}/client/js/` + /*( build_all ?*/ '*' /*: 'app.*' )*/, `${g3w.admin_static_folder}/client/css/` + /*( build_all ?*/ '*' /*: 'app.*' )*/, `${g3w.admin_templates_folder}/client/index.html`], { force: true }));

/**
 * Build minified hashed versions of js and css files in order to avoid server cache
 */
gulp.task('md5hash', async function(done) {
  const files = {
    js: ['app', 'vendor'],
    css: ['app', 'vendor']
  };
  /*if (false === build_all) {
    files.js = files.js.filter(e => e !== 'vendor');
    files.css = files.css.filter(e => e !== 'vendor');
    // set_current_hash_version
    ['js', 'css'].forEach(folder => {
      fs.readdirSync(`${g3w.admin_static_folder}/client/${folder}`).filter(file => {
        // exclude datatable
        if (file.indexOf('DataTables-') === -1 && file.indexOf('vendor') !== -1) {
          hashtable.vendor[folder].hash = file.split('.')[1];
        }
      })
    });
  }*/
  // generate md5 hash
  for (let type of Object.keys(files)) {
    for (let name of files[type]) {
      const originalname = `${g3w.clientFolder}/${type}/${name}.min.${type}`;
      hashtable[name][type].hash = md5(await fs.promises.readFile(originalname));
      fs.renameSync(originalname, `${g3w.clientFolder}/${type}/${name}.${hashtable[name][type].hash}.min.${type}`)
    }
  }
  done();
});

gulp.task('__browserify_vendor_js', function() {
  return browserify({
    plugin: [
      esmify
    ],
    transform: [
      vueify,
      babelify,
      [ stringify, { appliesTo: { includeExtensions: ['.html', '.xml'] } } ],
      imgurify
    ]})
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.node_modules.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(`${g3w.clientFolder}/js`));
});

/**
 * Bundle vendor modules
 */
gulp.task('browserify:vendor', gulp.series('__browserify_vendor_js', function() {
  return gulp.src(`${g3w.clientFolder}/js/vendor.*.js`)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest(`${g3w.clientFolder}/js/`));
}));

/**
 * Trasform modularized code in a browser compatible way
 */
gulp.task('browserify:app', function(done) {
  let rebundle;
  let bundler = browserify('./src/app/main.js', {
    basedir: './',
    paths: ['./src/', './src/app/', './src/plugins/'],
    debug: !production,
    cache: {},
    packageCache: {},
    plugin: [
      esmify
    ],
    transform: [
      vueify,
      babelify,
      [ stringify, { appliesTo: { includeExtensions: ['.html', '.xml'] } } ],
      imgurify
    ]
  });

  if (production) {
    bundler.ignore('./src/app/dev/index.js');           // ignore dev index file
    dependencies.forEach(dep => bundler.external(dep)); // add externalmodule node_modules on vendor
  } else {
    bundler.on('prebundle', bundle => {
      dependencies.forEach(dep => {
        bundle.external(dep);
        bundle.require(dep);
      });
    });
    bundler = watchify(bundler);
  }

  const bundle = () => bundler.bundle()
      .on('error', (err) => {
        console.log(err);
        this.emit('end');
        del([
          `${g3w.clientFolder}/js/app.js`,
          `${g3w.clientFolder}/style/app.css`
        ]).then(() => process.exit());
      })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(gulpif(production, replace('{G3W_VERSION}', g3w.version)))
      .pipe(gulpif(production, uglify({ compress: { drop_console: true }}).on('error', gutil.log)))
      .pipe(rename('app.js'))
      .pipe(gulp.dest(g3w.clientFolder + '/js/'));

  if (production) {
    rebundle = () => bundle();
  } else {
    rebundle = () => bundle().pipe(browserSync.reload({ stream: true }));
    bundler.on('update', rebundle);    
  }
  return rebundle();
});

/**
 * Copy all plugins to g3w-admin's plugin folder
 */
gulp.task('plugins', function() {
  return gulp.src(`${g3w.pluginsFolder}/*/plugin.js`)
    .pipe(rename((path) => { path.dirname = g3w.distFolder + '/' + path.dirname + '/js/'; }))
    .pipe(gulp.dest('.'));
});

gulp.task('fonts', function () {
  return gulp.src([
      `${g3w.assetsFolder}/fonts/**/*.{eot,ttf,woff,woff2}`,
      '!./src/libs/**/node_modules/**/',
      `${g3w.pluginsFolder}/**/*.{eot,ttf,woff,woff2}`
    ])
    .pipe(flatten())
    .pipe(gulp.dest(g3w.clientFolder + '/fonts/'))
});

gulp.task('images', function () {
  return gulp.src([
      `${g3w.assetsFolder}/images/**/*.{png,jpg,gif,svg}`,
      '!./src/**/node_modules/**/',
      `${g3w.pluginsFolder}/**/*.{png,jpg,gif,svg}`
    ])
    .pipe(flatten())
    .pipe(gulp.dest(g3w.clientFolder + '/images/'))
});

/**
 * Compile less file in css
 */
gulp.task('less', gulp.series('fonts', function() {
  return gulp.src([
      `${g3w.assetsFolder}/style/less/app.less`,
      `${g3w.pluginsFolder}/*/style/less/plugin.less`
    ])
    .pipe(concat('app.less'))
    .pipe(less({
      // add paths where to search in @import
      paths: [
        `${g3w.assetsFolder}/style/less`,
        `${g3w.pluginsFolder}/*/style/less`
      ],
      // plugin to manage globs import es: @import path/***
      plugins: [LessGlob] 
    }))
    .pipe(gulp.dest(g3w.clientFolder + '/css/'))
}));

gulp.task('datatable-images', function () {
  /*if (build_all) {*/
    return gulp.src(`${g3w.assetsFolder}/vendors/datatables/DataTables-1.10.16/images/*`)
      .pipe(flatten())
      .pipe(gulp.dest(g3w.clientFolder + '/css/DataTables-1.10.16/images/'));
  /*}*/
});

gulp.task('assets', gulp.series('fonts', 'images', 'less', 'datatable-images'));

/**
 * Create external assets (css and javascript libraries) referenced within main html
 */
 gulp.task('build_external_assets', function() {
  const replaceRelativeAssetsFolder = path.relative(path.resolve('./src'), path.resolve(g3w.assetsFolder))  + '/' ;
  const replaceRelativePluginFolder = function() {
    const pluginName = path.dirname(this.file.relative);
    return path.relative(path.resolve('./src'), path.resolve(`${g3w.pluginsFolder}/${pluginName}`))  + '/' ;
  };
  return gulp.src('./src/index.dev.html')
    // replace css and js sources
    .pipe(
      /*gulpif(build_all,*/ htmlreplace({
      'app_vendor_css':
          gulp.src(`${g3w.assetsFolder}/vendors/index.css.html`)
            .pipe(replace('./', replaceRelativeAssetsFolder)),
      'app_vendor_js':
          gulp.src(`${g3w.assetsFolder}/vendors/index.js.html`)
            .pipe(replace('./', replaceRelativeAssetsFolder)),
      'plugins_css':
          gulp.src(`${g3w.pluginsFolder}/*/index.css.html`)
            .pipe(replace('./', replaceRelativePluginFolder)),
      'plugins_js':
          gulp.src(`${g3w.pluginsFolder}/*/index.js.html`)
            .pipe(replace('./', replaceRelativePluginFolder))
      })/*)*/
    )
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./src'));
});

/**
 * Create a index.html in src/ and add all external libraries and css to it
 */
gulp.task('html:dev', gulp.series('build_external_assets', 'assets' , function() {
  return gulp.src('./src/index.html')
    .pipe(useref())
    .pipe(gulpif(['css/app.min.css'], cleanCSS({ keepSpecialComments: 0 }), replace(/\w+fonts/g, 'fonts')))
    .pipe(gulp.dest(g3w.clientFolder));
}));

/**
 * Build django g3w-admin template with the refercenced of all css and js minified and added versionHash
 */
gulp.task('html:prod', function() {
  return gulp.src('./src/index.prod.html')
    .pipe(replace('{VENDOR_CSS}', 'vendor.' + hashtable.vendor.css.hash + '.min.css'))
    .pipe(replace('{APP_CSS}',       'app.' + hashtable.app.css.hash    + '.min.css'))
    .pipe(replace('{VENDOR_JS}',  'vendor.' + hashtable.vendor.js.hash  + '.min.js'))
    .pipe(replace('{APP_JS}',        'app.' + hashtable.app.js.hash     + '.min.js'))
    .pipe(rename({ basename: 'index', extname: '.html' }))
    .pipe(gulp.dest(g3w.clientFolder));
});

gulp.task('browser-sync', function() {
  const port = g3w.port ?? 3000;
  const proxy = httpProxy
    .createProxyServer({ target: g3w.proxy.url })
    .on('error', e => gutil.log(e));

  browserSync.init({
    server: {
      baseDir: ['src', '.'],
      middleware: [
        (req, res, next) => {
          let doproxy = false;
          let rootUrl;
          if (req.url.indexOf('plugin.js') > -1) rootUrl = req.url;
          else rootUrl = req.url.split('?')[0];
          for (let i in g3w.proxy.routes) {
            if (rootUrl.indexOf(g3w.proxy.routes[i]) > -1) {
              doproxy = true;
              break;
            }
          }
          doproxy ? proxy.web(req, res) : next();
        }
      ]
    },
    port,
    open: false,
    startPath: '/',
    socket: {
      domain: `${g3w.host}:${port}`
    }
  });
});

gulp.task('browser:reload', function() {
  if (browserSync) {
    browserSync.reload();
  }
});

/**
 * Live reload application on code changes
 */
gulp.task('watch', function(done) {
  gulp.watch(['./assets/style/**/*.less', g3w.pluginsFolder + '/**/*.less'], gulp.series('less', 'browser:reload'));
  gulp.watch(['./assets/style/skins/*.less'],                                gulp.series('browser:reload'));
  gulp.watch('./src/**/*.{png,jpg}',                                         gulp.series('images', 'browser:reload'));
  gulp.watch(g3w.pluginsFolder + '/**/plugin.js',                            gulp.series('plugins', 'browser:reload'));
  gulp.watch(g3w.pluginsFolder + '/**/style/less/plugin.less',               gulp.series('less', 'browser:reload'));
  gulp.watch([g3w.pluginsFolder + '/*/index.*.html'],                        gulp.series('build_external_assets', 'browser:reload'));
  gulp.watch('./assets/vendors/index.*.html',                                gulp.series('build_external_assets', 'browser:reload'));
  gulp.watch(['./src/index.html', './src/**/*.html'],                        gulp.series('browser:reload'));
  done();
});

/**
 * Run the following tasks sequentially:
 * 
 * 1. clean dist folder
 * 2. set production variable to true
 * 3. browserify all files (require)
 * 4. read index.html after compiled less, fonts etc .. and read build blocks
 *    concatenate and insert <version>.min.css/js version
 * 5. write django g3w-admin template subtitude suffix .min with current version
 * 6. Remove app.js and app.css from g3w-admin client folder
 */
gulp.task('dist', gulp.series(function(done) {
    production = true;
    setNODE_ENV();
    // if (build_all) gulp.series('clean:dist', 'browserify:app', 'html:dev', 'browserify:vendor', 'clean:vendor', 'md5hash', 'html:prod', 'clean:app', done);
    // else gulp.series('clean:dist', 'browserify:app', 'html:dev', 'md5hash', 'html:prod', 'clean:app', done);
    done();
  },
  'clean:dist', 'browserify:app', 'html:dev', 'browserify:vendor', 'clean:vendor', 'md5hash', 'html:prod', 'clean:app'
));

/**
 * Lets developer choose which plugins to include within generated bundle
 */
gulp.task('select-plugins', function() {
  return gulp
    .src('./package.json')
    .pipe(
      prompt.prompt({
        type: 'checkbox',
        name: 'plugins',
        message: 'Plugins',
        // exclude from plugin list "client" and all "template_" plugins
        choices: fs.readdirSync(g3w.distFolder).filter(file => file !== 'client' && file.indexOf('template_') === -1 && fs.statSync(`${g3w.distFolder}/${file}`).isDirectory())
      },
      (response) => { process.env.G3W_PLUGINS = response.plugins; })
    );
});

gulp.task('g3w-admin:plugins', gulp.series('plugins', 'select-plugins', function(done) {
  const pluginNames = process.env.G3W_PLUGINS.split(',');
  if (pluginNames.length === 1 && pluginNames[0] === '') {
    console.log('No plugin selected');
    done();
  } else  {
    return gulp.src(pluginNames.map(pluginName => `${g3w.distFolder}/${pluginName}*/js/plugin.js`))
      .pipe(rename((path) => {
        const pluginname = path.dirname.replace('/js', '');
        path.dirname = `${g3w.admin_plugins_folder}/${pluginname}/static/${pluginname}/js/`;
      }))
      .pipe(gulp.dest('.'));
  }
}));

gulp.task('g3w-admin:static', function() {
  return gulp.src([
    `${g3w.clientFolder}/**/*.*`,
    `!${g3w.clientFolder}/index.html`,
    `!${g3w.clientFolder}/js/app.js`,
    `!${g3w.clientFolder}/css/app.css`
    ])
    .pipe(gulp.dest(`${g3w.admin_static_folder}/client/`));
});

gulp.task('g3w-admin:templates', function() {
  return gulp.src(`${g3w.clientFolder}/index.html`)
    .pipe(gulp.dest(g3w.admin_templates_folder + '/client/'));
});

/**
 * Create g3w-admin files. It start from compile sdk source folder, app source folder and all plugins
 */
gulp.task('g3w-admin', gulp.series('dist', 'clean:admin', 'g3w-admin:static', 'g3w-admin:templates', 'g3w-admin:plugins'));

// gulp.task('g3w-admin:client_only', function(done) {
//   build_all = false;
//   gulp.series('g3w-admin', done)();
// });

/**
 * Run test once and exit
 */
gulp.task('test', async (done) => {
  const testPath = `${__dirname}${g3w.test.path}`;
  const testGroupFolders = fs.readdirSync(testPath).filter(file => file !== 'group_template' && fs.statSync(testPath + '/' +file).isDirectory());
  for (let i = 0; i < testGroupFolders.length; i++) {
    await new Promise((resolve) => {
      new karma.Server({
        configFile: `${testPath}${testGroupFolders[i]}/karma.config.js`,
        singleRun: true
      },() => { resolve() }).start();
    });
  }
  done();
});

/**
 * Deafult development task (BrowserSync server)
 */
gulp.task('dev', gulp.series('build_external_assets', 'clean:dist', 'browserify:app', 'assets', 'watch', 'plugins', 'browser-sync'));
