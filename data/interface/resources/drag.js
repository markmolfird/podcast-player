config.UI.drag = {
  "permission": false,
  "leave": function (elm) {},
  "init": function (table) {
    config.UI.drag.start(table);
    config.UI.drag.enter(table);
    config.UI.drag.over(table);
    config.UI.drag.leave(table);
    config.UI.drag.drop(table);
    config.UI.drag.end(table);
  },
  "end": function (elm) {
    var end = function (e) {if (e.preventDefault) e.preventDefault()};
    elm.addEventListener('dragend', end, false);
  },
  "enter": function (elm) {
    var enter = function (e) {
      var target = e.target;
      if (e.preventDefault) e.preventDefault();
    };
    elm.addEventListener('dragenter', enter, false);
  },
  "start": function (elm) {
    var start = function (e) {
      if (e.dataTransfer) {
        var target = e.target;
        e.dataTransfer.effectAllowed = 'move';
        var tr = target.parentNode.parentNode.parentNode.parentNode;
        e.dataTransfer.setData('text/plain', target.getAttribute('item-url') || tr.getAttribute('item-url'));
      }
    };
    elm.addEventListener('dragstart', start, false);
    elm.addEventListener('touchstart', start, false);
  },
  "over": function (elm) {
    var over = function (e) {
      if (e.changedTouches) {
        if (e.changedTouches.length > 1) {
          config.UI.drag.permission = true;
          if (e.preventDefault) e.preventDefault();
        } else config.UI.drag.permission = false;
      }
      else {
        var target = e.target;
        if (e.preventDefault) e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      }
    };
    elm.addEventListener('dragover', over, false);
    elm.addEventListener('touchmove', over, false);
  },
  "drop": function (elm) {
    var drop = function (e) {
      var start = '', end = '';
      /*  */
      var ET = e.target;
      var ETP = ET.parentNode.parentNode.parentNode.parentNode;
      end = ETP.getAttribute('item-url');
      /*  */
      if (e.changedTouches) {
        if (config.UI.drag.permission === false) return;
        /*  */
        var ST = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        var STP = ST.parentNode.parentNode.parentNode.parentNode;
        start = STP.getAttribute('item-url');
      } else start = e.dataTransfer.getData('text/plain');
      /*  */
      var episodes = config.settings["episodes"] || {};
      var playlist = episodes["playlist"] || [];
      var s = -1, e = -1;
      /*  */
      for (var i = 0; i < playlist.length; i++) {
        var url = playlist[i];
        if (url === end) e = i;
        if (url === start) s = i;
      }
      /*  */
      if (s !== -1 && e !== -1) {
        var tmp = playlist[e];
        playlist[e] = playlist[s];
        playlist[s] = tmp;
        episodes["playlist"] = playlist;
        config.settings["episodes"] = episodes;
        config.storage.write(config.general.id.settings, config.settings);
      }
      if (e.stopPropagation) e.stopPropagation();
    };
    elm.addEventListener('drop', drop, false);
    elm.addEventListener('touchend', drop, false);
  }
};
