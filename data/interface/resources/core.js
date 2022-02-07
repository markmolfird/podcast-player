config.core = {
  "map": {
    "id": [],
    "url": {},
    "list": {},
    "disk": {},
    "path": {},
    "podcast": {},
    "filename": {},
  },
  "launched": {
    get app () {
      var tmp = config.storage.read(config.general.id.app);
      var o = tmp["config.core.launched.app"];
      return (o && 'V' in o) ? o.V : false;
    },
    set app (val) {
      var tmp = config.storage.read(config.general.id.app);
      tmp["config.core.launched.app"] = {'V': val};
      config.storage.write(config.general.id.app, tmp);
    },
    get time () {
      var o = config.settings["config.core.launched.time"];
      return (o && 'V' in o) ? o.V : '';
    },
    set time (val) {
      config.settings["config.core.launched.time"] = {'V': val};
      config.storage.write(config.general.id.settings, config.settings);
    },
    get lifetime () {
      var o = config.settings["config.core.launched.lifetime"];
      return (o && 'V' in o) ? o.V : false;
    },
    set lifetime (val) {
      config.settings["config.core.launched.lifetime"] = {'V': val};
      config.storage.write(config.general.id.settings, config.settings);
    }
  },
  "options": {
    "markAsSeen": {
      get content () {
        var o = config.settings["config.core.options.markAsSeen"];
        return (o && 'V' in o) ? o.V : false;
      },
      set content (val) {
        config.settings["config.core.options.markAsSeen"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "autoRefresh": {
      get content () {
        var o = config.settings["config.core.options.autoRefresh"];
        return (o && 'V' in o) ? o.V : '';
      },
      set content (val) {
        config.settings["config.core.options.autoRefresh"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "autoDelete": {
      get content () {
        var o = config.settings["config.core.options.autoDelete"];
        return (o && 'V' in o) ? o.V : false;
      },
      set content (val) {
        config.settings["config.core.options.autoDelete"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "scrollAction": {
      get content () {
        var o = config.settings["config.core.options.scrollAction"];
        return (o && 'V' in o) ? o.V : false;
      },
      set content (val) {
        config.settings["config.core.options.scrollAction"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "buttonVibrate": {
      get content () {
        var o = config.settings["config.core.options.buttonVibrate"];
        return (o && 'V' in o) ? o.V : true;
      },
      set content (val) {
        config.settings["config.core.options.buttonVibrate"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "showNotifications": {
      get content () {
        var o = config.settings["config.core.options.showNotifications"];
        return (o && 'V' in o) ? o.V : true;
      },
      set content (val) {
        config.settings["config.core.options.showNotifications"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    }
  },
  "load": {
    "ACTION": true,
    "filename": function (callback) {},
    "UI": function (callback) {
      config.log(" • loading interface");
      var maxSearch = document.getElementById('maxSearch');
      var renderGPU = document.getElementById('renderGPU');
      var blockImage = document.getElementById('blockImage');
      var autoDelete = document.getElementById('autoDelete');
      var markAsSeen = document.getElementById('markAsSeen');
      var podcastCap = document.getElementById('podcastCap');
      var imageScale = document.getElementById('imageScale');
      var renderCache = document.getElementById('renderCache');
      var autoRefresh = document.getElementById('autoRefresh');
      var scrollAction = document.getElementById('scrollAction');
      var buttonVibrate = document.getElementById('buttonVibrate');
      var imageThumbnail = document.getElementById('imageThumbnail');
      var showNotifications = document.getElementById('showNotifications');
      /*  */
      maxSearch.value = config.UI.page.result.limit;
      podcastCap.value = config.general.podcast.cap;
      imageScale.value = config.UI.image.scale * 100;
      blockImage.checked = config.fetch.limit.image === true;
      renderGPU.checked = config.general.gpu.permission === true;
      renderCache.checked = config.UI.page.cache.render === true;
      imageThumbnail.checked = config.UI.image.thumbnail === true;
      markAsSeen.checked = config.core.options.markAsSeen.content === true;
      autoDelete.checked = config.core.options.autoDelete.content === true;
      scrollAction.checked = config.core.options.scrollAction.content === true;
      autoRefresh.checked = config.core.options.autoRefresh.content ? true : false;
      buttonVibrate.checked = config.core.options.buttonVibrate.content === true;
      showNotifications.checked = config.core.options.showNotifications.content === true;
      autoRefresh.parentNode.parentNode.children[1].textContent = "Enable podcasts automatic update (every " + config.UI.refresh.interval + " hours)";
      /*  */
      callback(true);
    },
    "track": function () {
      if (config.settings.episodes && config.settings.episodes.subscribed) {
        config.log(" • loading tracks");
        var arr = Object.keys(config.settings.episodes.subscribed);
        for (var i = 0; i < arr.length; i++) {
          var url = arr[i];
          if (url) {
            var podcast = config.settings.episodes.subscribed[url];
            if (podcast) {
              var items = podcast.items;
              for (var i = 0; i < items.length; i++) {
                var track = items[i];
                if (track) {
                  if (track.enclosure.link === config.player.audio.src) {
                    config.player.audio.check(function (check) {
                      if (check) {
                        config.player.audio.value.set("src", config.player.audio.src);
                        /*  */
                        var mute = document.querySelector('button[type="mute"]');
                        var seen = document.querySelector('button[type="seen"]');
                        var duration = document.querySelector('div[type="duration"]');
                        var minutes = config.player.audio.sleep.array[config.player.audio.sleep.index];
                        /*  */
                        duration.textContent = config.general.fn.toHHMMSS(config.player.audio.duration.index);
                        seen.querySelector('i').setAttribute("class", "fa fa-eye" + config.player.audio.seen.state);
                        mute.querySelector('i').setAttribute("class", "fa fa-volume" + config.player.audio.mute.state);
                        /*  */
                        document.getElementById("podcast-seen").setAttribute("class", "fa fa-eye" + config.player.audio.seen.state);
                        document.getElementById("podcast-sleep").textContent = minutes ? " " + minutes + " Minutes" : " Timer: OFF";
                        document.getElementById("podcast-seen").textContent = config.player.audio.seen.state ? " Hide read" : " Show read";
                        document.getElementById("podcast-speed").textContent = " Speed: " + config.player.audio.speed.array[config.player.audio.speed.index] + "✖";
                        /*  */
                        return;
                      }
                    });
                  }
                }
              }
            }
          }
        }
      }
    },
    "player": function (callback) {
      config.log(" • loading player");
      /*  */
      var content = document.querySelector(".content");
      var title = document.getElementById("podcast-title");
      var seen = document.querySelector('button[type="seen"]');
      var mute = document.querySelector('button[type="mute"]');
      var range = document.querySelector('input[rule="player"]');
      var sleep = document.querySelector('button[type="sleep"]');
      var speed = document.querySelector('button[type="speed"]');
      var forward = document.querySelector('button[type="forward"]');
      var backward = document.querySelector('button[type="backward"]');
      var currenttime = document.querySelector('div[type="currenttime"]');
      var forwardbutton = document.querySelector('button[type="f-forward"]');
      var backwardbutton = document.querySelector('button[type="f-backward"]');
      var mainplayer = document.querySelector(".II-tab .player-controls").querySelector('button[type="play"]');
      /*  */
      range.action = true;
      range.TIMEOUT = null;
      currenttime.action = true;
      speed.array = config.player.audio.speed.array;
      sleep.array = config.player.audio.sleep.array;
      /*  */
      if (content) {
        content.addEventListener("scroll", function (e) {
          config.UI.button.tasks.apply.scroll(e.target.scrollTop, e.target);
        });
      }
      /*  */
      forward.addEventListener("click", function (e) {
        config.UI.button.tasks.play.episode("next");
        config.app.notifications.vibrate.action(e, this);
      }, false);
      /*  */
      backward.addEventListener("click", function (e) {
        config.UI.button.tasks.play.episode("previous");
        config.app.notifications.vibrate.action(e, this);
      }, false);
      /*  */
      mainplayer.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        config.player.audio.action.play("main", "click");
      }, false);
      /*  */
      backwardbutton.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        config.player.audio.value.get("currentTime", function (e) {
          config.player.audio.value.set("currentTime", (e - 30));
        });
      }, false);
      /*  */
      forwardbutton.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        config.player.audio.value.get("currentTime", function (e) {
          config.player.audio.value.set("currentTime", (e + 30));
        });
      }, false);
      /*  */
      sleep.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        config.player.audio.sleep.index = config.player.audio.sleep.index + 1 < sleep.array.length ? config.player.audio.sleep.index + 1 : 0;
        var minutes = sleep.array[config.player.audio.sleep.index];
        document.getElementById("podcast-sleep").textContent = minutes ? " " + minutes + " Minutes" : " Timer: OFF";
        config.player.audio.timer.add(minutes);
      }, false);
      /*  */
      speed.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        config.player.audio.speed.index = config.player.audio.speed.index + 1 < speed.array.length ? config.player.audio.speed.index + 1 : 0;
        document.getElementById("podcast-speed").textContent = " Speed: " + speed.array[config.player.audio.speed.index] + "x";
        config.player.audio.value.set("playbackRate", speed.array[config.player.audio.speed.index]);
      }, false);
      /*  */
      mute.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        var muted = config.player.audio.mute.state === "-up";
        config.player.audio.mute.state = muted ? "-off" : "-up";
        mute.querySelector('i').setAttribute("class", "fa fa-volume" + config.player.audio.mute.state);
        config.player.audio.value.set("muted", muted);
      }, false);
      /*  */
      seen.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        var eye = this.querySelector('i').getAttribute("class");
        config.player.audio.seen.state = eye === "fa fa-eye" ? "-slash" : '';
        document.getElementById("podcast-seen").setAttribute("class", "fa fa-eye" + config.player.audio.seen.state);
        document.getElementById("podcast-seen").textContent = config.player.audio.seen.state ? " Hide read" : " Show read";
        this.querySelector('i').setAttribute("class", "fa fa-eye" + config.player.audio.seen.state);
        config.UI.page.update.interface();
      }, false);
      /*  */
      range.addEventListener("input", function () {
        range.action = false;
        currenttime.action = false;
        var t = (range.value / 100) * config.player.audio.duration.index;
        document.querySelector('div[type="currenttime"]').textContent = config.general.fn.toHHMMSS(t);
        /*  */
        if (range.TIMEOUT) window.clearTimeout(range.TIMEOUT);
        range.TIMEOUT = window.setTimeout(function () {
          config.UI.button.tasks.add.color.rule(range.value);
          config.player.audio.value.set("currentTime", t);
          config.player.audio.saved.time = t;
          currenttime.action = true;
          range.action = true;
        }, 300);
      }, false);
      /*  */
      config.player.audio.check(function (check) {
        if (check) {
          config.player.audio.listener("loadedmetadata", function (e) {
            config.UI.button.tasks.render.audio.duration();
          });
          /*  */
          config.player.audio.download.progress(function (e) {
            config.UI.button.tasks.check.progress(e.url, "fa fa-times", e.result);
          });
          /*  */
          config.player.audio.listener('canplaythrough', function () {
            config.player.audio.method(config.player.audio.action.content === "pause" ? "play" : "pause")
          });
          /*  */
          config.player.audio.listener("ended", function () {
            var url = config.player.audio.src;
            /*  */
            if (config.core.options.autoDelete.content === true) {/* ToDO */}
            if (config.core.options.markAsSeen.content === true) config.storage.update.subscribed(url, "seen", true);
            /*  */
            config.UI.button.tasks.play.episode("next");
          }, false);
          /*  */
          config.player.audio.listener("timeupdate", function (e) {
            if (config.player.audio.duration.index) {
              config.MEDIA_ERR = false;
              var t = e.target.currentTime;
              var p = (t / config.player.audio.duration.index) * 100;
              /*  */
              if (range.action) range.value = p;
              config.player.audio.current.time.index = t;
              config.player.audio.current.time.text = config.general.fn.toHHMMSS(t);
              if (currenttime.action) currenttime.textContent = config.player.audio.current.time.text;
              /*  */
              config.UI.button.tasks.add.color.rule(p);
            } else config.UI.button.tasks.render.audio.duration();
          });
          /*  */
          config.player.audio.listener("error", function (code) {
            switch (code) {
              case code.MEDIA_ERR_DECODE: config.log('> MEDIA_ERR: DECODE'); break;
              case code.MEDIA_ERR_ABORTED: config.log('> MEDIA_ERR: ABORTED'); break;
              case code.MEDIA_ERR_NETWORK: config.log('> MEDIA_ERR: NETWORK'); break;
              case code.MEDIA_ERR_SRC_NOT_SUPPORTED: config.log('> MEDIA_ERR: SRC_NOT_SUPPORTED'); break;
              default: config.log('> MEDIA_ERR: UNKNOWN_' + code); break;
            }
            /*  */
            range.value = 0;
            config.player.audio.action.play("error");
            config.UI.button.tasks.add.color.rule(range.value);
            config.player.audio.current.time.text = "00:00:00";
            document.querySelector('div[type="currenttime"]').textContent = config.player.audio.current.time.text;
            /*  */
            if (config.MEDIA_ERR) config.log(" • MEDIA_ERR: 1ST");
            else {
              config.MEDIA_ERR = true;
              config.player.audio.src = null;
              config.player.audio.action.content = "play";
              config.player.audio.value.set("src", config.player.audio.src);
              config.log(" • MEDIA_ERR: 2ND");
              if (config.core.options.showNotifications.content === true) {
                config.app.notifications.create({
                  "type": "alert",
                  "message": "An unexpected error occurred in the podcast player, please try again."
                });
              }
            }
          });
        }
      });
      /*  */
      var permission = config.player.audio.src && config.player.audio.src !== "about:blank";
      if (permission) {
        config.core.load.track();
      } else {
        config.player.audio.sleep.index = 0;
        config.player.audio.speed.index = 0;
        config.player.audio.mute.state = "-up";
        config.player.audio.seen.state = "-slash";
      }
      /*  */
      callback(true);
    }
  }
};
