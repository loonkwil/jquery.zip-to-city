module.exports = function(grunt) {
  "use strict";

  var http = require('http');
  var request = require('request');
  var xlsx = require('xlsx');

  /**
   * @param {string} str
   * @return {string}
   */
  var canonicalizeZipCode = function(str) {
    return str.toString().trim();
  };

  /**
   * @param {string} str
   * @return {string}
   */
  var canonicalizeCity = function(str) {
    str = str.replace(/"/g, '').trim().toLocaleLowerCase();
    return str.substr(0, 1).toLocaleUpperCase() + str.substr(1);
  };


  grunt.registerTask(
    'update-zip-codes', 'Iranyitoszamok frissitese', function() {
      var done = this.async();
      var options = this.options({
        outputFile: 'src/zip-codes.js'
      });

      grunt.log.writeln('XLS letoltese');
      request({ url: options.url, encoding: null }, function(err, res, body) {
        if( err ) {
          return grunt.fail.fatal(
            'Hiba lepett fel a csatlakozas soran (' + err.message + ')'
          );
        }

        if( res.statusCode !== 200 ) {
          var msg = http.STATUS_CODES[res.statusCode] || 'Unknown error';
          return grunt.fail.fatal(
            'Hiba lepett fel a letoltes soran (' + msg + ')'
          );
        }

        grunt.log.writeln('Fajl beolvasasa');
        var file;
        try {
          file = xlsx.read(body);
        } catch(e) {
          var msg = e.message || e;
          return grunt.fail.fatal(
            'Nem sikerult ertelmezni az xls fajlt (' + msg + ')'
          );
        }

        grunt.log.writeln('Iranyitoszamok eloallitasa');
        var zipCodes = [];
        var cities = [];

        /**
         * @param {number|string} zipCode
         * @param {string} city
         */
        var storeData = function(zipCode, city) {
          var index = zipCodes.indexOf(zipCode);

          // Abban az esetben, ha van mar ilyen iranyitoszamom, csak akkor kell
          // elmenteni ha a hozza tartozo varos kulonbozik
          var haveToSave = (index === -1 || cities[index] !== city);
          if( !haveToSave ) { return; }

          zipCodes.push(zipCode);
          cities.push(city);
        };


        file.SheetNames.
          filter(function(targetSheet) {
            // "Jelek" munkalap nem erdekel, ahogy a budapesti iranyitoszamok
            // sem
            return !/jelek|bp\.|budapest/i.test(targetSheet);
          }).
          map(function(targetSheet) {
            var sheetData = file.Sheets[targetSheet];
            var lines = xlsx.utils.sheet_to_row_object_array(sheetData);

            if( /települések/i.test(targetSheet) ) {
              lines.
                filter(function(oneLine) {
                  var isLineValid = (
                    (
                      oneLine.hasOwnProperty('IRSZ') ||
                      oneLine.hasOwnProperty('IRSZ.')
                    ) &&
                    oneLine.hasOwnProperty('Település')
                  );
                  if( !isLineValid ) { return false; }

                  // nem egyertelmu telepulesek kiszurese
                  return (
                    !oneLine.hasOwnProperty('Településrész') ||
                    oneLine['Településrész'].trim().length === 0
                  );
                }).
                map(function(oneLine) {
                  var zipCode = oneLine.IRSZ || oneLine['IRSZ.'];
                  zipCode = canonicalizeZipCode(zipCode);

                  var city = canonicalizeCity(oneLine['Település']);

                  storeData(zipCode, city);
                });
            }
            else {
              var city = canonicalizeCity(targetSheet.replace(/\s*u\.\s*$/i, ''));

              lines.
                filter(function(oneLine) {
                  return (
                    oneLine.hasOwnProperty('IRSZ') ||
                    oneLine.hasOwnProperty('IRSZ.')
                  );
                }).
                map(function(oneLine) {
                  var zipCode = oneLine.IRSZ || oneLine['IRSZ.'];
                  zipCode = canonicalizeZipCode(zipCode);

                  storeData(zipCode, city);
                });
            }
          });

        grunt.log.writeln('Adatok fajlba irasa');
        var output = ';(function($) { "use strict"; $.zipToCity = {\n';

        // iranyitoszamok
        output += 'zipCodes: [';
        output += zipCodes.join(',');
        output += '],\n';

        // varosok
        output += 'cities: [';
        output += cities.
          map(function(oneCitiy) { return "'" + oneCitiy + "'"; }).
          join(',');
        output += ']\n';

        output += '}; }(window.jQuery));';

        grunt.file.write(options.outputFile, output);
        grunt.log.writeln(
          zipCodes.length + ' varos, iranyitoszam paros lett kiirva'
        );

        return done();
      });
    }
  );
};
