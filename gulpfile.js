var gulp            = require('gulp');
var browserSync     = require('browser-sync');
var reload          = browserSync.reload;
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();


gulp.task('browser-sync', function() {
    var files = ['build/index.html', 'build/js', 'build/css'];
    browserSync.init(files, {
        server: {
            baseDir: "build"
        }
    });
});

gulp.task('templates', function(){
    gulp.src(['app/modules/**/*/views/**/*.html', 'app/components/**/*/views/*.html']).pipe(plugins.html2js('templates.js', {
        adapter: 'angular',
        base: 'app/',
        name: 'avanadeApp.template'
    })).pipe(gulp.dest('app')).on('end', function(){

        gulp.src([
            // First, load all modules
            'app/modules/app.js',
            'app/components/module.js',
            'app/modules/**/module.js',
            // Load the templates
            'app/templates.js',
            // Second, load the root scripts of these modules
            'app/modules/**/{config,run,constants,externals}.js',
            // Third, load all the contents of these modules
            'app/components/**/*.js',
            'app/modules/**/*.js'
        ])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('script.js'))
        .pipe(gulp.dest('build/js'));

    });
});

gulp.task('sass', function () {
    return gulp.src('app/styles/*.scss')
        .pipe(plugins.plumber())
        .pipe(plugins.sass())
        .on('error', function (err) {
            plugins.gutil.log(err);
            this.emit('end');
        })
        .pipe(plugins.autoprefixer({
            browsers: [
                '> 1%',
                'last 2 versions',
                'firefox >= 4',
                'safari 7',
                'safari 8',
                'IE 8',
                'IE 9',
                'IE 10',
                'IE 11'
            ],
            cascade: false
        }))
        .pipe(plugins.cssmin())
        .pipe(gulp.dest('build/css')).on('error', plugins.util.log)
        .pipe(reload({stream:true}));
});

gulp.task('usemin', function() {
    gulp.src('app/*.html').pipe(plugins.usemin({
        js: [plugins.uglify()]
    })).pipe(gulp.dest('build'));
});

gulp.task('jshint', function() {
    return gulp.src('app/**/*.js').pipe(plugins.jshint());
});

gulp.task('scripts', function() {
    return gulp.src([
        // First, load all modules
        'app/modules/app.js',
        'app/components/module.js',
        'app/modules/**/module.js',
        // Load the templates
        'app/templates.js',
        // Second, load the root scripts of these modules
        'app/modules/**/{config,run,constants,externals}.js',
        // Third, load all the contents of these modules
        'app/components/**/*.js',
        'app/modules/**/*.js'
    ])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('script.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('default', ['templates', 'sass', 'scripts', 'usemin', 'browser-sync'], function () {
    gulp.watch("app/styles/**/*.scss", ['sass']);
    gulp.watch("app/index.html", ['usemin']);
    gulp.watch('app/modules/**/*/views/**/*.html', ['templates']);
    gulp.watch('app/components/**/*/views/*.html', ['templates']);
    gulp.watch([
        'app/modules/app.js',
        'app/modules/**/*.js',
        'app/components/**/*.js'
    ], ['scripts']);
});