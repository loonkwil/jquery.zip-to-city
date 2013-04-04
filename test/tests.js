(function(window, undefined) {
  "use strict";

  var $ = window.jQuery;
  var q = window.QUnit;

  var $zip, $zip2, $city, $city2;

  var cleanUp = function() {
    $zip.val('');
    $zip2.val('');
    $city.val('');
    $city2.val('');
  };

  $(function() {
    $zip = $('#zip');
    $city = $('#city');
    $zip2 = $('#zip2');
    $city2 = $('#city2');

    q.testStart(function(details) {
      cleanUp();
    });


    // Iranyitoszambol varos
    q.test('Hibas iranyitoszam (nem szam)', function() {
      $zip.val('abcd').trigger('blur');

      q.equal($city.val(), '');
    });

    q.test('Hibas iranyitoszam (tul hosszu)', function() {
      $zip.val('10410').trigger('blur');

      q.equal($city.val(), '');
    });

    q.test('Hibas iranyitoszam (hibas forma)', function() {
      $zip.val('0123').trigger('blur');

      q.equal($city.val(), '');
    });

    q.test('Feher szokozok levagasa', function() {
      $zip.val('	7632  ').trigger('blur');

      q.equal($city.val(), 'Pécs');
    });

    q.test('Varos mar ki van toltve', function() {
      $city.val('Budapest');
      $zip.val('7632').trigger('blur');

      q.equal($city.val(), 'Budapest');
    });

    q.test('Nem egyertelmu a varos', function() {
      $zip.val('7915').trigger('blur');

      q.equal($city.val(), '');
    });

    q.test('Varos kikeresese', function() {
      $zip.val('7632').trigger('blur');

      q.equal($city.val(), 'Pécs');
    });

    q.test('Varos kikeresese (masodik peldany)', function() {
      $zip2.val('7632').trigger('blur');

      q.equal($city2.val(), 'Pécs');
    });

    // Varosbol iranyitoszam
    q.test('Nincs ilyen varos', function() {
      $city.val('abcd').trigger('blur');

      q.equal($zip.val(), '');
    });

    q.test('Feher szokozok levagasa', function() {
      $city.val('	Nagyatád  ').trigger('blur');

      q.equal($zip.val(), '7500');
    });

    q.test('kis- es nagybetu kozott nincs kulonbseg', function() {
      $city.val('naGyAtÁd').trigger('blur');

      q.equal($zip.val(), '7500');
    });

    q.test('Iranyitoszam mar ki van toltve', function() {
      $zip.val('7632');
      $city.val('Nagyatád').trigger('blur');

      q.equal($zip.val(), '7632');
    });

    q.test('Nem egyertelmu az iranyitoszam', function() {
      $city.val('Budapest').trigger('blur');

      q.equal($zip.val(), '');
    });

    q.test('Iranyitoszam kikeresese', function() {
      $city.val('Nagyatád').trigger('blur');

      q.equal($zip.val(), '7500');
    });

    q.test('Iranyitoszam kikeresese (masodik peldany)', function() {
      $city2.val('Nagyatád').trigger('blur');

      q.equal($zip2.val(), '7500');
    });
  });
})(window);
