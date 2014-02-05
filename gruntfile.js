module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {   
            js: {
                src: [
                    'tests/lib/angular.js',
                    'tests/lib/angular-route.js',
                    'app.js',
                    'js/modules/*.js', // non-main app modules
                    'js/*.js', // All JS in the libs folder
                    'bootstrap.js'
                    
                ],
                dest: 'js/build/production.js',
            },
            css: {
                src: [
                    'css/compiled/*.css'
                ],
                dest: 'css/build/main.css',
            }
        },

        uglify: {
            build: {
                src: 'js/build/production.js',
                dest: 'js/build/production.min.js'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'images/build/'
                }]
            }
        },

        karma: {
            unit: {
                configFile: 'tests/karma.conf.js',
                //The background option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks.
                background: true
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['js/modules/*.js', 'js/*.js', 'app.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['css/*.scss'],
                tasks: ['sass', 'concat'],
                options: {
                    spawn: false,
                }
            },
            //run unit tests with karma (server needs to be already running)
            karma: {
                files: ['js/**/*.js'],
                tasks: ['karma:unit:run'] //NOTE the :run flag
            }
        },

        // css preprocessor management
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'css/compiled/main.css': 'css/main.scss',
                    'css/compiled/mod-thumbnail.css': 'css/mod-thumbnail.scss'
                }
            } 
        },

        protractor: {
            options:{
                configFile:'tests/protractor.conf.js',
                keepAlive: true, // if false, grunt process stops at the first error found
                
            }
        }
    });

    // combine javascript files
    grunt.loadNpmTasks('grunt-contrib-concat');
    // minify javascript files
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // optimize images
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    // watcher for file changes
    grunt.loadNpmTasks('grunt-contrib-watch');
    // sass management
    grunt.loadNpmTasks('grunt-contrib-sass');
    // unit test management
    grunt.loadNpmTasks('grunt-karma');
    // e2e test management
    grunt.loadNpmTasks('grunt-protractor-runner');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'watch', 'sass', 'karma']);

};