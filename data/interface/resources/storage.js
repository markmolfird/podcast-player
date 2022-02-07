config.storage = {
  "local": {},
  "reset": function (id) {config.storage.write(id, {})},
  "read": function (id) {return config.storage.local[id]},
  "clean": function (id) {
    if (id === "all") {
      for (var id in config.general.id) {
        config.storage.write(config.general.id[id], {});
      }
    } else config.storage.write(id, {});
  },
  "write": function (id, data) {
    if (id) {
      if (id === config.general.id.settings) config.settings = data;
      /*  */
      if (data !== '' && data !== null && data !== undefined) {
        var tmp = {};
        tmp[id] = data;
        config.storage.local[id] = data;
        if (window === window.top) {
          chrome.storage.local.set(tmp, function () {});
        } else {
          localStorage.setItem(id, JSON.stringify(data));
        }
      } else {
        delete config.storage.local[id];
        if (window === window.top) {
          chrome.storage.local.remove(id, function () {});
        } else {
          localStorage.removeItem(id);
        }
      }
    }
  },
  "load": function (callback) {
    if (window === window.top) {
      chrome.storage.local.get(null, function (e) {
        config.storage.local = e;
        callback();
      });
    } else {
      var keys = Object.keys(localStorage);
      var i = keys.length;
      while (i--) {
        if (keys[i]) {
          var item = localStorage.getItem(keys[i]);
          if (item) {
            try {
              config.storage.local[keys[i]] = JSON.parse(item);
            } catch (e) {
              config.storage.local[keys[i]] = item;
            }
          }
        }
      }
      callback();
    }
  },
  "update": {
    "color": function (name, color) {
      var tmp = config.settings.color || {};
      if (color) tmp[name] = color;
      /*  */
      config.settings.color = tmp;
      config.storage.write(config.general.id.settings, config.settings);
      config.UI.page.update.interface();
    },
    "subscribed": function (url, property, value) {
      var tmp = config.settings.episodes.subscribed;
      for (name in tmp) {
        var podcast = tmp[name];
        if (podcast && podcast.items) {
          for (var i = 0; i < podcast.items.length; i++) {
            var item = podcast.items[i];
            if (item.enclosure.link === url) {
              item[property] = value;
            }
          }
        }
      }
      /*  */
      config.settings.episodes.subscribed = tmp;
      config.storage.write(config.general.id.settings, config.settings);
      config.UI.page.update.interface();
    }
  }
};
