module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadTasks('grunt-tasks');

  // Project configuration.
  grunt.initConfig({
    qunit: {
      files: ['test/index.html']
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commitFiles: ['package.json', 'bower.json'],
        push: false
      }
    },
    'update-zip-codes': {
      options: {
        url: 'http://www.posta.hu/static/internet/download/Iranyitoszam_Internet.XLS'
      }
    },
  });

  // Task to run tests
  grunt.registerTask('test', ['qunit', 'jshint']);
  grunt.registerTask('update', ['update-zip-codes', 'update-readme']);
};
