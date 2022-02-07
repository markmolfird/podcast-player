config.app = {
  "load": function () {
    config.log(" • loading app");
    /*  */
    if (config.storage.read(config.general.id.app) === undefined) config.storage.write(config.general.id.app, {});
    if (config.storage.read(config.general.id.filename) === undefined) config.storage.write(config.general.id.filename, {});
    if (config.storage.read(config.general.id.settings) === undefined) config.storage.write(config.general.id.settings, {});
    if (config.storage.read(config.general.id.interface) === undefined) config.storage.write(config.general.id.interface, {});
    if (config.storage.read(config.general.id.downloaded) === undefined) config.storage.write(config.general.id.downloaded, {});
    /*  */
    config.log(" • loading settings");
    config.settings = config.storage.local[config.general.id.settings];
    /*  */
    if (config.settings.episodes === undefined) config.settings.episodes = {};
    if (config.settings.color === undefined) {
      config.settings.color = {
        "intensity": "10",
        "font": "rgb(32, 32, 32)",
        "button": "rgb(255, 153, 0)",
        "background": "rgb(255, 255, 255)"
      };
    }
    /*  */
    config.core.listeners.add(function () {
      config.core.load.UI(function () {
        config.core.load.player(function () {
          config.UI.refresh.check();
          config.UI.page.update.interface();
        });
      });
    });
  },
  "refresh": function () {
    config.log(" • refreshing podcasts data...");
    var refresh = document.querySelector('.top-controls button[type="refresh"]');
    /* */
    var action = function (arr, callback) {
      if (arr && arr.length) {
        (function loop(arr, index) {
          var url = arr[index];
          if (url) {
            config.fetch.podcast.track(url, "subscribed", false, function () {
              if (++index < arr.length) {
                window.setTimeout(function () {
                  loop(arr, index);
                }, 300);
              } else callback(true);
            });
          } else if (++index < arr.length) loop(arr, index);
          else callback(true);
        })(arr, 0);
      }
    };
    /*  */
    if (config.settings.episodes && config.settings.episodes.subscribed) {
      refresh.querySelector('i').className = "fa fa-spinner fa-spin";
      action(Object.keys(config.settings.episodes.subscribed), function () {
        config.storage.write(config.general.id.settings, config.settings);
        refresh.querySelector('i').className = "fa fa-retweet";
        config.UI.page.update.interface();
      });
    }
  },
  "notifications": {
    "id": "podcast-player-prime-notifications",
    "clear": function () {chrome.notifications.clear(config.app.notifications.id, function () {})},
    "vibrate": {
      "time": 17,
      "permission": false,
      "action": function (e, t) {
        if (config.app.notifications.vibrate.permission) {
          if (config.core.options.buttonVibrate.content === true) {
            if (navigator.vibrate) navigator.vibrate(config.app.notifications.vibrate.time);
          }
        }
      }
    },
    "create": function (o, callback) {
      if (o.type === "confirm") callback(window.confirm(o.message));
      else if (o.type === "normal" || o.type === "alert") {
        if (window === window.top) {
          chrome.notifications.create(config.app.notifications.id, {
            "type": 'basic',
            "message": o.message,
            "title": "Podcast Player Prime",
            "iconUrl": chrome.runtime.getURL('data/icons/64.png'),
          }, callback);
        }
      }
    }
  }
};
