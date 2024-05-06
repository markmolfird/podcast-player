config.player = {
  "audio": {
    "element": document.querySelector("audio"),
    "method": function (rule) {config.player.audio.element[rule]()},
    "check": function (callback) {callback(config.player.audio.element ? true : false)},
    "listener": function (id, callback) {config.player.audio.element.addEventListener(id, callback)},
    "current": {
      "time": {
        "index": 0, 
        "text": "00:00:00"
      }
    },
    "download": {
      "abort": function (url) {},
      "start": function (url) {},
      "ended": function (callback) {},
      "error": function (callback) {},
      "cancel": function (callback) {},
      "progress": function (callback) {},
    },
    get src () {
      const o = config.settings["config.player.audio.src"];
      return (o && 'V' in o) ? o.V : null;
    },
    set src (val) {
      config.settings["config.player.audio.src"] = {'V': val};
      config.storage.write(config.general.id.settings, config.settings);
    },
    "saved": {
      get time () {
        const o = config.settings["config.player.audio.saved.time"];
        return (o && 'V' in o) ? o.V : 0;
      },
      set time (val) {
        config.settings["config.player.audio.saved.time"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "mute": {
      get state () {
        const o = config.settings["config.player.audio.mute.state"];
        return (o && 'V' in o) ? o.V : "-up";
      },
      set state (val) {
        config.settings["config.player.audio.mute.state"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "seen": {
      get state () {
        const o = config.settings["config.player.audio.seen.state"];
        return (o && 'V' in o) ? o.V : "-slash";
      },
      set state (val) {
        config.settings["config.player.audio.seen.state"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "sleep": {
      "array": [0, 1, 15, 30, 45, 60, 75, 90, 105, 120],
      get index () {
        const o = config.settings["config.player.audio.sleep"];
        return (o && 'V' in o) ? o.V : 0;
      },
      set index (val) {
        config.settings["config.player.audio.sleep"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "speed": {
      "array": [1, 1.5, 2, 2.5, 3, 5, 10],
      get index () {
        const o = config.settings["config.player.audio.speed"];
        return (o && 'V' in o) ? o.V : 0;
      },
      set index (val) {
        config.settings["config.player.audio.speed"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "duration": {
      get index () {
        const o = config.settings["config.player.audio.duration"];
        return (o && 'V' in o) ? o.V : 0;
      },
      set index (val) {
        config.settings["config.player.audio.duration"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "value": {
      "get": function (rule, callback) {
        callback(config.player.audio.element[rule]);
      },
      "set": function (rule, val) {
        try {
          config.player.audio.element[rule] = val;
          /*  */
          if (rule === "src") {
            if (val && val !== "about:blank" && val.indexOf("/null") === -1) {
              config.player.audio.current.time.text = "Loading, please wait...";
              [...document.querySelectorAll(".aon")].map(function (elm) {elm.style.opacity = "0.3"});
              document.querySelector('div[type="currenttime"]').textContent = config.player.audio.current.time.text;
            }
          }
        } catch (e) {}
      }
    },
    "timer": {
      "timeout": null,
      "add": function (minutes) {
        if (config.player.audio.timer.timeout) window.clearTimeout(config.player.audio.timer.timeout);
        if (minutes) {
          config.player.audio.timer.timeout = window.setTimeout(function () {
            config.player.audio.src = null;
            config.player.audio.sleep.index = 0;
            config.player.audio.action.content = "play";
            config.player.audio.value.set("src", config.player.audio.src);
          }, minutes * 60 * 1000);
        }
      }
    },
    "action": {
      get content () {
        const o = config.settings["config.player.audio.action.content"];
        return (o && 'V' in o) ? o.V : "play";
      },
      set content (val) {
        config.settings["config.player.audio.action.content"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      },
      "play": function (loc, url) {
        config.player.audio.value.get("src", function (src) {
          const main = document.querySelector('button[type="play"]').querySelector('i');
          const items = document.getElementById("items-table") || document.getElementById("playlist-table");
          if (items) {
            const tmp = items.querySelectorAll('tr[item-url]');
            if (tmp) {
              const addDetails = function (tr) {
                const title = document.getElementById("podcast-title");
                if (title) {
                  const td = title.parentNode.parentNode.children[2];
                  title.textContent = tr.getAttribute("item-title");
                  if (td) config.UI.image.make.element(null, td, tr.getAttribute("item-image"), null, 200);
                }
              }
              /*  */
              document.querySelector('div[type="currenttime"]').className = '';
              if (loc === "main") {
                if (config.player.audio.action.content === "play") {
                  if (src && src !== "about:blank" && src.indexOf("/null") === -1) {
                    if (main) main.setAttribute("class", "fa fa-pause");
                    config.player.audio.action.content = "pause";
                    config.player.audio.method("play");
                  } else {
                    if (config.core.options.showNotifications.content === true) {
                      config.app.notifications.create({
                        "type": "alert",
                        "message": "No item to play! please select an item from the list, then press on the play button."
                      });
                    }
                  }
                } else {
                  if (main) main.setAttribute("class", "fa fa-play");
                  config.player.audio.action.content = "play";
                  /*  */
                  if (config.player.audio.current.time.text === "Loading, please wait...") {
                    config.player.audio.src = null;
                    config.player.audio.value.set("src", config.player.audio.src);
                    document.querySelector('div[type="currenttime"]').textContent = "00:00:00";
                  }
                  else {
                    config.player.audio.method("pause");
                    document.querySelector('div[type="currenttime"]').className = "blink";
                    config.player.audio.saved.time = config.player.audio.current.time.index;
                  }
                }
                /* play [item] */
                [...tmp].map(function (tr) {
                  tr.removeAttribute("class");
                  const item = tr.querySelector('button[type="play"]').querySelector('i');
                  if (tr.getAttribute("item-url") === src) {
                    /* add details */ addDetails(tr);
                    tr.setAttribute("class", (config.player.audio.action.content === "pause" ? "highlight" : ''));
                    item.setAttribute("class", "fa fa-" + (config.player.audio.action.content === "pause" ? "stop" : "play"));
                  }
                  else {
                    item.setAttribute("class", "fa fa-play");
                  }
                });
              } else if (loc === "item") {
                if (url) {
                  config.player.audio.src = url;
                  config.player.audio.saved.time = 0;
                  config.player.audio.value.set("src", config.player.audio.src);
                  /*  */
                  [...tmp].map(function (tr) {
                    tr.removeAttribute("class");
                    const speed = document.getElementById("podcast-speed");
                    if (speed) speed.textContent = " Speed: 1.0x";
                    const item = tr.querySelector('button[type="play"]').querySelector('i');
                    if (tr.getAttribute("item-url") === config.player.audio.src) {
                      /* add details */ addDetails(tr);
                      if (item.getAttribute("class") === "fa fa-play") {
                        config.player.audio.action.content = "pause";
                        item.setAttribute("class", "fa fa-stop");
                        tr.setAttribute("class", "highlight");
                        /* play is trigged when canplay event is called */
                      } else {
                        config.player.audio.action.content = "play";
                        item.setAttribute("class", "fa fa-play");
                        config.player.audio.method("pause");
                      }
                    } else {
                      item.setAttribute("class", "fa fa-play");
                    }
                  });
                  /* play [main] */
                  if (main) main.setAttribute("class", "fa fa-" + config.player.audio.action.content);
                  if (config.player.audio.action.content === "play") {
                    config.player.audio.current.time.text = "00:00:00";
                    document.querySelector('div[type="currenttime"]').textContent = config.player.audio.current.time.text;
                  }
                }
              } else { /* pause the player */
                config.player.audio.method("pause");
                config.player.audio.action.content = "play";
                if (main) main.setAttribute("class", "fa fa-play");
                [...tmp].map(function (tr) {
                  const play = tr.querySelector('button[type="play"]');
                  if (play) {
                    const item = play.querySelector('i');
                    item.setAttribute("class", "fa fa-play");
                    tr.removeAttribute("class");
                  }
                });
              }
            }
          }
        });
      }
    }
  }
};
