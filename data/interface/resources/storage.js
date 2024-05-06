config.storage = {
  "local": {},
  "reset": function (id) {
    config.storage.write(id, {});
  },
  "read": function (id) {
    return config.storage.local[id];
  },
  "clean": function (id) {
    if (id === "all") {
      for (let id in config.general.id) {
        config.storage.write(config.general.id[id], {});
      }
    } else {
      config.storage.write(id, {});
    }
  },
  "write": function (id, data) {
    if (id) {
      if (id === config.general.id.settings) config.settings = data;
      /*  */
      if (data !== '' && data !== null && data !== undefined) {
        const tmp = {};
        tmp[id] = data;
        config.storage.local[id] = data;
        if (config.port.name !== "webapp") {
          chrome.storage.local.set(tmp);
        } else {
          localStorage.setItem(id, JSON.stringify(data));
        }
      } else {
        delete config.storage.local[id];
        if (config.port.name !== "webapp") {
          chrome.storage.local.remove(id);
        } else {
          localStorage.removeItem(id);
        }
      }
    }
  },
  "load": function (callback) {
    if (config.port.name !== "webapp") {
      chrome.storage.local.get(null, function (e) {
        config.storage.local = e;
        callback();
      });
    } else {
      const keys = Object.keys(localStorage);
      let i = keys.length;
      while (i--) {
        if (keys[i]) {
          const item = localStorage.getItem(keys[i]);
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
      const tmp = config.settings.color || {};
      if (color) tmp[name] = color;
      /*  */
      config.settings.color = tmp;
      config.storage.write(config.general.id.settings, config.settings);
      config.UI.page.update.interface();
    },
    "subscribed": function (url, property, value) {
      const tmp = config.settings.episodes.subscribed;
      for (let id in tmp) {
        const podcast = tmp[id];
        if (podcast && podcast.items) {
          for (let i = 0; i < podcast.items.length; i++) {
            const item = podcast.items[i];
            if (item.enclosure.link === url) {
              item[property] = value;
            }
          }
        }
      }
      /*  */
      config.settings.episodes.subscribed = tmp;
      config.storage.write(config.general.id.settings, config.settings);
      /*  */
      config.UI.page.update.interface();
    }
  }
};
