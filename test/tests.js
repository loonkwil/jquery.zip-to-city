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

  var setValueAndLeaveTheField = function($node, value) {
    $node.val(value).trigger('blur');
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
      setValueAndLeaveTheField($zip, 'abcd');

      q.equal($city.val(), '');
    });

    q.test('Hibas iranyitoszam (tul hosszu)', function() {
      setValueAndLeaveTheField($zip, '10410');

      q.equal($city.val(), '');
    });

    q.test('Hibas iranyitoszam (hibas forma)', function() {
      setValueAndLeaveTheField($zip, '0123');

      q.equal($city.val(), '');
    });

    q.test('Feher szokozok levagasa', function() {
      setValueAndLeaveTheField($zip, '	7632  ');

      q.equal($city.val(), 'Pécs');
    });

    q.test('Varos mar ki van toltve', function() {
      $city.val('Budapest');
      setValueAndLeaveTheField($zip, '7632');

      q.equal($city.val(), 'Budapest');
    });

    q.test('Nem egyertelmu a varos', function() {
      setValueAndLeaveTheField($zip, '7915');

      q.equal($city.val(), '');
    });

    q.test('Varos kikeresese', function() {
      setValueAndLeaveTheField($zip, '7632');

      q.equal($city.val(), 'Pécs');
    });

    q.test('Varos kikeresese (masodik peldany)', function() {
      setValueAndLeaveTheField($zip2, '7632');

      q.equal($city2.val(), 'Pécs');
    });

    // Varosbol iranyitoszam
    q.test('Nincs ilyen varos', function() {
      setValueAndLeaveTheField($city, 'abcd');

      q.equal($zip.val(), '');
    });

    q.test('Feher szokozok levagasa', function() {
      setValueAndLeaveTheField($city, '	Nagyatád  ');

      q.equal($zip.val(), '7500');
    });

    q.test('kis- es nagybetu kozott nincs kulonbseg', function() {
      setValueAndLeaveTheField($city, 'naGyAtÁd');

      q.equal($zip.val(), '7500');
    });

    q.test('Iranyitoszam mar ki van toltve', function() {
      $zip.val('7632');
      setValueAndLeaveTheField($city, 'Nagyatád');

      q.equal($zip.val(), '7632');
    });

    q.test('Nem egyertelmu az iranyitoszam', function() {
      setValueAndLeaveTheField($city, 'Budapest');

      q.equal($zip.val(), '');
    });

    q.test('Iranyitoszam kikeresese', function() {
      setValueAndLeaveTheField($city, 'Nagyatád');

      q.equal($zip.val(), '7500');
    });

    q.test('Iranyitoszam kikeresese (masodik peldany)', function() {
      setValueAndLeaveTheField($city2, 'Nagyatád');

      q.equal($zip2.val(), '7500');
    });
  });
})(window);
