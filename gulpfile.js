"use strict"
const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const exec = require('child_process').exec
const spawn = require('child_process').spawn
let currentPacking

const pack = () => {
    if (currentPacking) { currentPacking.kill() }

    return new Promise(resolve => {

        currentPacking = spawn(`webpack`, [
            `--config`,
            `webpack.config.js`,
            `--progress`
        ])

        currentPacking.stdout.on(`data`, data => {
            console.log(`pack: ${data.toString()}`)
        })

        currentPacking.stderr.on(`data`, data => {
            console.log(`pack: ${data.toString()}`)
        })

        currentPacking.on(`exit`, () => {
            console.log(`pack done`)
            exec(`osascript -e 'display notification "Complete" with title "WEBPACK"'`)
            currentPacking = spawn(`cp`, [`-R`, `src/samples`, `dist`])
            return resolve()
        })
    })
}


gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        https: true
    });
});

gulp.task('pack', pack)

const watch = () => {
    return gulp.watch([`src/*`, `src/*/*`, `src/*/*/*`]).on(`all`, gulp.parallel("pack"))
}

gulp.task(`watch`, gulp.parallel(watch))
gulp.task("default", gulp.parallel("server", "pack", "watch"))
