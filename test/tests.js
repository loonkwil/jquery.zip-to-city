;(function(window, undefined) {
  "use strict";

  var $ = window.jQuery;
  var q = window.QUnit;

  var $zip, $zip2, $city, $city2;

  var setValueAndLeaveTheField = function($node, value) {
    $node.val(value).trigger('blur');
  };


  q.testStart(function(details) {
    $zip = $('#zip');
    $city = $('#city');
    $zip2 = $('#zip2');
    $city2 = $('#city2');

    $zip.zipToCity($city);
    $zip2.zipToCity($city2);
  });


  // Iranyitoszambol varos
  q.test('Hibas iranyitoszam (nem szam)', function() {
    expect(1);
    setValueAndLeaveTheField($zip, 'abcd');

    q.equal($city.val(), '');
  });

  q.test('Hibas iranyitoszam (tul hosszu)', function() {
    expect(1);
    setValueAndLeaveTheField($zip, '10410');

    q.equal($city.val(), '');
  });

  q.test('Hibas iranyitoszam (hibas forma)', function() {
    expect(1);
    setValueAndLeaveTheField($zip, '0123');

    q.equal($city.val(), '');
  });

  q.test('Feher szokozok levagasa', function() {
    expect(1);
    setValueAndLeaveTheField($zip, '	7632  ');

    q.equal($city.val(), 'Pécs');
  });

  q.test('Varos mar ki van toltve', function() {
    expect(1);
    $city.val('Budapest');
    setValueAndLeaveTheField($zip, '7632');

    q.equal($city.val(), 'Budapest');
  });

  q.test('Nem egyertelmu a varos', function() {
    expect(1);
    setValueAndLeaveTheField($zip, '7915');

    q.equal($city.val(), '');
  });

  q.test('Varos kikeresese', function() {
    expect(1);
    setValueAndLeaveTheField($zip, '7632');

    q.equal($city.val(), 'Pécs');
  });

  q.test('Varos kikeresese (masodik peldany)', function() {
    expect(1);
    setValueAndLeaveTheField($zip2, '7632');

    q.equal($city2.val(), 'Pécs');
  });

  // Varosbol iranyitoszam
  q.test('Nincs ilyen varos', function() {
    expect(1);
    setValueAndLeaveTheField($city, 'abcd');

    q.equal($zip.val(), '');
  });

  q.test('Feher szokozok levagasa', function() {
    expect(1);
    setValueAndLeaveTheField($city, '	Nagyatád  ');

    q.equal($zip.val(), '7500');
  });

  q.test('kis- es nagybetu kozott nincs kulonbseg', function() {
    expect(1);
    setValueAndLeaveTheField($city, 'naGyAtÁd');

    q.equal($zip.val(), '7500');
  });

  q.test('Iranyitoszam mar ki van toltve', function() {
    expect(1);
    $zip.val('7632');
    setValueAndLeaveTheField($city, 'Nagyatád');

    q.equal($zip.val(), '7632');
  });

  q.test('Nem egyertelmu az iranyitoszam', function() {
    expect(1);
    setValueAndLeaveTheField($city, 'Budapest');

    q.equal($zip.val(), '');
  });

  q.test('Iranyitoszam kikeresese', function() {
    expect(1);
    setValueAndLeaveTheField($city, 'Nagyatád');

    q.equal($zip.val(), '7500');
  });

  q.test('Iranyitoszam kikeresese (masodik peldany)', function() {
    expect(1);
    setValueAndLeaveTheField($city2, 'Nagyatád');

    q.equal($zip2.val(), '7500');
  });
})(window);
