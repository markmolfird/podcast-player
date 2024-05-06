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
    const end = function (e) {if (e.preventDefault) e.preventDefault()};
    elm.addEventListener('dragend', end, false);
  },
  "enter": function (elm) {
    const enter = function (e) {
      const target = e.target;
      if (e.preventDefault) e.preventDefault();
    };
    elm.addEventListener('dragenter', enter, false);
  },
  "start": function (elm) {
    const start = function (e) {
      if (e.dataTransfer) {
        const target = e.target;
        e.dataTransfer.effectAllowed = 'move';
        const tr = target.parentNode.parentNode.parentNode.parentNode;
        e.dataTransfer.setData('text/plain', target.getAttribute('item-url') || tr.getAttribute('item-url'));
      }
    };
    elm.addEventListener('dragstart', start, false);
    elm.addEventListener('touchstart', start, false);
  },
  "over": function (elm) {
    const over = function (e) {
      if (e.changedTouches) {
        if (e.changedTouches.length > 1) {
          config.UI.drag.permission = true;
          if (e.preventDefault) e.preventDefault();
        } else config.UI.drag.permission = false;
      }
      else {
        const target = e.target;
        if (e.preventDefault) e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      }
    };
    elm.addEventListener('dragover', over, false);
    elm.addEventListener('touchmove', over, false);
  },
  "drop": function (elm) {
    const drop = function (e) {
      let end = '';
      let start = '';
      /*  */
      const ET = e.target;
      const ETP = ET.parentNode.parentNode.parentNode.parentNode;
      end = ETP.getAttribute('item-url');
      /*  */
      if (e.changedTouches) {
        if (config.UI.drag.permission === false) return;
        /*  */
        const ST = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        const STP = ST.parentNode.parentNode.parentNode.parentNode;
        start = STP.getAttribute('item-url');
      } else {
        start = e.dataTransfer.getData('text/plain');
      }
      /*  */
      const episodes = config.settings['episodes'] || {};
      const playlist = episodes['playlist'] || [];
      /*  */
      let _s = -1;
      let _e = -1;
      for (let i = 0; i < playlist.length; i++) {
        const url = playlist[i];
        if (url === end) _e = i;
        if (url === start) _s = i;
      }
      /*  */
      if (_s !== -1 && _e !== -1) {
        const tmp = playlist[_e];
        /*  */
        playlist[_e] = playlist[_s];
        playlist[_s] = tmp;
        episodes['playlist'] = playlist;
        config.settings['episodes'] = episodes;
        config.storage.write(config.general.id.settings, config.settings);
      }
      /*  */
      if (e.stopPropagation) e.stopPropagation();
    };
    /*  */
    elm.addEventListener('drop', drop, false);
    elm.addEventListener('touchend', drop, false);
  }
};
