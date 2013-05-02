module.exports = function(grunt){

    // Project configuration.
    grunt.initConfig({

            pkg: grunt.file.readJSON('package.json'),

            clean: [
                'build/*',
                'doc/*'
            ],

            concat: {
                options: {
                    stripBanners: true,
                    banner: '/*\n'+
                        '\tLib:\t<%= pkg.name %>\n'+
                        '\tVersion:\t<%= pkg.version %>\n'+
                        '\tBuild Date: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        '\tAuthor: <%= pkg.author %>\n*/\n\n'+
                        '(function(NS){\n\n',
                    footer: '\n\n})("<%= pkg.name %>");'
                },
                build: {
                    src: ['src/*.js'],
                    dest: 'build/<%= pkg.name %>.<%= pkg.version %>.dev.js'
                }
            },

            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                build: {
                    src: 'build/<%= pkg.name %>.<%= pkg.version %>.dev.js',
                    dest: 'build/<%= pkg.name %>.<%= pkg.version %>.min.js'
                }
            },

            yuidoc: {
                //TODO - generate YUIDocs from src
            },

            qunit: {
                //TODO - run qunit against both dev and mini builds
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-yuidoc');
    //grunt.loadNpmTasks('grunt-contrib-qunit');

    // Default task(s).
    grunt.registerTask('default', ['clean','concat','uglify'/*,'yuidoc','qunit'*/]);

};