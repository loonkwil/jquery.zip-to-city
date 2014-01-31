module.exports = function(grunt) {
  "use strict";

  grunt.registerTask(
    'update-readme', 'Readme.md fajlban szereplo datum frissitese', function() {
      var path = 'Readme.md';
      var now = grunt.template.today('yyyy. mm. dd.');

      var content = grunt.file.read(path);
      content = content.replace(
        /(Frissítve:\s)20\d{2}\. \d{2}\. \d{2}\./ig, '$1' + now
      );

      grunt.file.write(path, content);
    }
  );
};
