Magyar irányítószámból megpróbálja kitalálni a várost. Ha nem egyértelmű (több
város tartozik az irányítószámhoz, nem egyértelmű a település elnevezése (pl.:
Pécs Hird)), nem csinál semmit.
Illetve a városból megpróbálja kitalálni az irányítószámot.
Már kitöltött mezőket nem fog felülírni.

Adatok a [Magyar Posta Zrt.
honlapjáról](http://www.posta.hu/ugyfelszolgalat/iranyitoszam_kereso)
származnak.
Frissítve: 2013. 02. 21.

Példát a script működésére: http://loonkwil.github.com/zip-to-city

# Intallálás
```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <input type="text" name="zip">
  <input type="text" name="city">

  <script src="js/jquery.js"></script>
  <script src="js/jquery.zip-to-city.js"></script>
  <script type="text/javascript">
    $(function() {
      $('input[name="zip"]').zipToCity('input[name="city"]');
    });
  </script>
</body>
```
