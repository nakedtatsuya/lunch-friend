var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
let sass = require('gulp-sass');
var browserSync = require('browser-sync');

function reload() {
    browserSync.reload({ stream: false });
};

gulp.task('scss', function () {
    gulp.src('./public/css/style.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('browsersync', function() {
    browserSync.init({
        files: ['public/**/*.*', 'views/**/*.*'], // BrowserSyncにまかせるファイル群
        proxy: 'http://localhost:3000',  // express の動作するポートにプロキシ
        port: 4000,  // BrowserSync は 4000 番ポートで起動
        open: false  // ブラウザ open しない
    });
});

gulp.task('sass-watch', ['scss'], function(){
    var watcher = gulp.watch('./public/css/*.scss', ['scss']);
    watcher.on('change', function(event) {
    });
});

gulp.task('serve', ['browsersync'], function () {
    nodemon({
        script: './server/server.js',
        ext: 'js html css',
        ignore: [  // nodemon で監視しないディレクトリ
            'node_modules/*',
            'build/*',
            'public/*',
        ],
        env: {
            'NODE_ENV': 'test'
        },
        stdout: false  // Express の再起動時のログを監視するため
    }).on('readable', function() {
        this.stdout.on('data', function(chunk) {
            if (/^Express\ server\ listening/.test(chunk)) {
                // Express の再起動が完了したら、reload() でBrowserSync に通知。
                // ※Express で出力する起動時のメッセージに合わせて比較文字列は修正
                reload();
            }
            process.stdout.write(chunk);
        });
        this.stderr.on('data', function(chunk) {
            process.stderr.write(chunk);
        });
    });
});

gulp.task('default', ['serve','sass-watch']);





