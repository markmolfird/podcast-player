config.UI.image = {
  "CACHE": {"img": {}, "dataURL": {}},
  get scale () {
    var o = config.settings["config.UI.image.scale"];
    var v = (o && 'V' in o) ? o.V : "100";
    return parseInt(v) / 100;
  },
  set scale (val) {
    if (!parseInt(val)) val = 100;
    if (parseInt(val) < 0) val = 0;
    if (parseInt(val) > 100) val = 100;
    config.settings["config.UI.image.scale"] = {'V': val};
    config.storage.write(config.general.id.settings, config.settings);
  },
  get thumbnail () {
    var o = config.settings["config.UI.image.thumbnail"];
    return (o && 'V' in o) ? o.V : false;
  },
  set thumbnail (val) {
    config.settings["config.UI.image.thumbnail"] = {'V': val};
    config.storage.write(config.general.id.settings, config.settings);
  },
  "make": {
    "src": function (src, callback) {callback(src)},
    "highresolution": function (src, size, callback) {
      var img = document.createElement('img');
      img.src = src;
      img.onload = function () {callback(img)};
      img.onerror = function () {callback(null)};
    },
    "placeholder": function (elm) {
      var i = document.createElement('i');
      i.style.cursor = "pointer";
      i.setAttribute("class", "fa fa-picture-o");
      i.addEventListener("click", function () {
        config.core.load.filename(function () {
          config.log(" • filename reloaded");
        });
      });
      /*  */
      return i;
    },
    "thumbnail": function (src, width, scale, callback) {
      if (!config.UI.image.CACHE.dataURL[src]) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var img = new Image();
        img.src = src;
        /*  */
        img.onerror = function (e) {callback(null)};
        img.onload = function () {
          if (!scale) scale = width / img.width;
          context.drawImage(img, img.width, img.height);
          canvas.width = width;
          canvas.height = canvas.width * (img.height / img.width);
          var TMP = document.createElement('canvas'),
          octTMP = TMP.getContext('2d');
          TMP.width = img.width * scale;
          TMP.height = img.height * scale;
          octTMP.drawImage(img, 0, 0, TMP.width, TMP.height);
          octTMP.drawImage(TMP, 0, 0, TMP.width * scale, TMP.height * scale);
          context.drawImage(TMP, 0, 0, TMP.width * scale, TMP.height * scale, 0, 0, canvas.width, canvas.height);
          config.UI.image.CACHE.dataURL[src] = canvas.toDataURL();
          callback(config.UI.image.CACHE.dataURL[src]);
        }
      } else callback(config.UI.image.CACHE.dataURL[src]);
    },
    "element": function (tr, td, src, cls, size) {
      if (!td) {
        td = document.createElement('td');
        tr.appendChild(td);
      }
      /*  */
      td.textContent = '';
      if (cls) td.setAttribute("class", cls);
      td.appendChild(config.UI.image.make.placeholder(td));
      if (src) {
        if (config.UI.image.thumbnail === true && size < 200) { /* make thumbnail */
          config.UI.image.make.thumbnail(src, size, config.UI.image.scale, function (e) {
            if (e) {
              td.textContent = '';
              var img = document.createElement('img');
              if (config.general.gpu.permission === true) img.setAttribute("class", "GPU");
              img.src = e;
              td.appendChild(img);
            } else config.log(" • thumbnail load error");
          });
        } else {
          config.UI.image.make.highresolution(src, size, function (img) {
            if (img) {
              td.textContent = '';
              if (config.general.gpu.permission === true) img.setAttribute("class", "GPU");
              td.appendChild(img);
            } else config.log(" • image load error");
          });
        }
      }
    }
  }
};
