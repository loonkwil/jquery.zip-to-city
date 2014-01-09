;(function(window) {
  "use strict";

  var $ = window.jQuery;


  /**
   * @type {Array.<integer>} zipCodes Iranyitoszamok tombje.
   *   Iranyitoszamok indexei es a hozza tartozo varosok indexei megegyeznek.
   *   Budapesti iranyitoszamok (1010-1239) nincsenek benne.
   *   Az iranyitoszamok sorrendje nem szamit (addig ameddig a sorrend
   *   megegyezik a varosok sorrendjevel).
   */
  var zipCodes = $.zipToCity.zipCodes;

  /**
   * @type {Array.<string>} cities Varosok listaja.
   *   Csak azok szerepelnek, amiknek egyertelmu az elnevezese, pl.: Pecs Hird
   *   nem.
   */
  var cities = $.zipToCity.cities;

  /**
   * Visszaadja a keresett elem index-et a megadott tombben, ha csak egyszer
   *   fordul elo benne, ellenkezo esetben null-t ad vissza
   *
   * @param {string|integer} needle
   * @param {array} haystack
   * @return {integer|null}
   */
  var getIndexIfUnique = function(needle, haystack) {
    var index = haystack.indexOf(needle);
    if( index === -1 ) {
      return null;
    }

    // egyedi az index?
    return ( haystack.indexOf(needle, index + 1) === -1 ) ? index : null;
  };

  /**
   * Megadott szot kezdobetujet nagybetusse teszi, valamit leveszi a felesleges
   *   feher szokozoket
   *
   * @param {string} str
   * @return {string}
   */
  var canonicalizeCity = function(str) {
    str = str.trim().toLocaleLowerCase();
    return str.substr(0, 1).toLocaleUpperCase() + str.substr(1);
  };

  /**
   * Kikeresi a megadott iranyitoszam alapjan a varos nevet
   *
   * @param {integer} zip
   * @return {string|null}
   */
  var getCityFromZipCode = function(zip) {
    if( zip < 2000 ) { return 'Budapest'; }

    var index = getIndexIfUnique(zip, zipCodes);

    return (index === null) ? null : cities[index];
  };

  /**
   * Megprobalja kitalalni az iranyitoszamot a varosnev alapjan
   *
   * @param {string} city A varosnev nem tartalmazhat felesleges feher
   *   szokozoket. Az elso betunek nagynak, mig a tobbinek kicsinek kell lennie
   * @return {integer|null}
   */
  var getZipCodeFromCity = function(city) {
    if( city === 'Budapest' ) { return null; }

    var index = getIndexIfUnique(city, cities);

    return (index === null) ? null : zipCodes[index];
  };

  /**
   * Iranyitoszam input elhagyasanak esemenykezeloje
   */
  var zipDoneEvent = function() {
    var $zipInput = $(this);
    var $cityInput = $zipInput.data('cityInput');

    // akkor foglalkozok az esemennyel, ha a varos mezo meg nincs kitoltve
    if( $cityInput.val() !== '' ) { return; }

    // Valoban iranyitoszamot adott-e meg
    var zip = $zipInput.val().trim();
    if( !/^(?:1(?:[01][1-9]|2[1-3])[0-9]|[2-9][0-9]{3})$/.test(zip) ) {
      return;
    }
    zip = parseInt(zip, 10);

    var city = getCityFromZipCode(zip);
    if( city !== null ) {
      $cityInput.val(city);
    }
  };

  /**
   * Varos input elhagyasanak esemenykezeloje
   */
  var cityDoneEvent = function() {
    var $cityInput = $(this);
    var $zipInput = $cityInput.data('zipInput');

    if( $zipInput.val() !== '' ) { return; }

    var city = canonicalizeCity($cityInput.val());

    var zip = getZipCodeFromCity(city);
    if( zip !== null ) {
      $zipInput.val(zip);
    }
  };

  $.fn.zipToCity = function(cityInput) {
    var $zipInput = this;
    var $cityInput = $(cityInput);

    if( $zipInput.length === 0 || $cityInput.length === 0 ) { return; }

    $zipInput.
      data('cityInput', $cityInput).
      on('blur', zipDoneEvent);

    $cityInput.
      data('zipInput', $zipInput).
      on('blur', cityDoneEvent);

    return this;
  };
})(window);
