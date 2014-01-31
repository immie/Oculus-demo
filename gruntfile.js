module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {   
            dist: {
                src: [
                    'app.js',
                    'js/*.js', // All JS in the libs folder
                    'js/modules/*.js'
                ],
                dest: 'js/build/production.js',
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
                files: ['js/modules/*.js', 'js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['css/*.scss'],
                tasks: ['sass'],
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

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'css/build/main.css': 'css/main.scss'
                }
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

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'watch', 'sass', 'karma']);

};