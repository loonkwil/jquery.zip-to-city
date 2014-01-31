# Zip To City

[![Build Status](https://travis-ci.org/loonkwil/jquery.zip-to-city.png)](https://travis-ci.org/loonkwil/jquery.zip-to-city)

Magyar irányítószámból megpróbálja kitalálni a várost. Ha nem egyértelmű (több
város tartozik az irányítószámhoz, nem egyértelmű a település elnevezése (pl.:
Pécs Hird)), nem csinál semmit.
Illetve a városból megpróbálja kitalálni az irányítószámot.
Már kitöltött mezőket nem fog felülírni.

Adatok a [Magyar Posta Zrt.
honlapjáról](http://www.posta.hu/ugyfelszolgalat/iranyitoszam_kereso)
származnak.
Frissítve: 2014. 01. 31.

Példát a script működésére: http://loonkwil.github.com/jquery.zip-to-city

## Intallálás

Követelmények: [Bower](https://github.com/bower/bower)

```bash
bower install git@github.com:loonkwil/jquery.zip-to-city.git --save
```

```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <input type="text" name="zip">
  <input type="text" name="city">

  <script src="bower_components/jquery/jquery.js"></script>
  <script src="bower_components/jquery.zip-to-city/src/zip-codes.js"></script>
  <script src="bower_components/jquery.zip-to-city/src/jquery.zip-to-city.js"></script>
  <script type="text/javascript">
    $(function() {
      $('input[name="zip"]').zipToCity('input[name="city"]');
    });
  </script>
</body>
```

## Tesztek futtatása

Követelmények: [Grunt](http://gruntjs.com)

 1. `npm install`
 2. `npm test`

## Iranyitoszamok frissitese

`grunt update`
