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
                        '\tLib: <%= pkg.name %>\n'+
                        '\tCreated: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                        '\tAuthor: <%= pkg.author %>\n*/\n\n'
                },
                build: {
                    src: ['src/*.js'],
                    dest: 'build/<%= pkg.name %>.<%= pkg.version %>.js'
                }
            },

            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                build: {
                    src: 'build/<%= pkg.name %>.<%= pkg.version %>.js',
                    dest: 'build/<%= pkg.name %>.<%= pkg.version %>.min.js'
                }
            },

            yuidoc: {
                //TODO
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    // Default task(s).
    grunt.registerTask('default', ['clean','concat','uglify','yuidoc']);

};