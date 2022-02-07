config.UI.button = {
  "single": {
    "make": function (tr, obj) {
      var td = document.createElement('td');
      td.setAttribute("class", "single");
      for (var id in obj) {
        var button = document.createElement('button');
        var i = document.createElement('i');
        button.setAttribute("type", id);
        button.addEventListener("click", function (e) {
          config.app.notifications.vibrate.action(e, this);
          config.UI.button.action(this, this.getAttribute("type"));
        });
        i.setAttribute("class", "fa fa-" + (obj[id] ? obj[id] : id));
        button.appendChild(i);
        td.appendChild(button);
      }
      /*  */
      tr.appendChild(td);
    }
  },
  "combined": {
    "make": function (tr, arr) {
      var td = document.createElement('td');
      td.setAttribute("class", "combined");
      for (var k = 0; k < arr.length; k++) {
        var obj = arr[k];
        for (var id in obj) {
          var button = document.createElement('button');
          var i = document.createElement('i');
          button.setAttribute("type", id);
          button.addEventListener("click", function (e) {
            config.app.notifications.vibrate.action(e, this);
            config.UI.button.action(this, this.getAttribute("type"));
          });
          i.setAttribute("class", "fa fa-" + (obj[id] ? obj[id] : id));
          button.appendChild(i);
          td.appendChild(button);
        }
      }
      tr.appendChild(td);
    }
  },
  "action": function (elm, type) {
    var item = elm.parentNode.parentNode;
    var url = item.getAttribute("item-url");
    /*  */
    if (type.indexOf("trash") !== -1) {/* ToDo */};
    if (type.indexOf("eye") !== -1) config.UI.button.tasks.seen(url);
    if (type.indexOf("plus") !== -1) config.UI.button.tasks.playlist(url);
    if (type.indexOf("download") !== -1) config.UI.button.tasks.download(url);
    if (type.indexOf("play") !== -1) config.player.audio.action.play("item", url);
    if (type.indexOf("check") !== -1) config.UI.button.tasks.bookmark(item.getAttribute("podcast-url") || item.parentNode.getAttribute("podcast-url"));
    if (type.indexOf("refresh") !== -1) {
      config.app.notifications.vibrate.action(null, null);
      var url = item.parentNode.getAttribute("podcast-url");
      if (url) {
        var loader = item.querySelector('i');
        if (loader) loader.className = "fa fa-refresh fa-spin";
        config.fetch.podcast.track(url, "subscribed", true, function () {
          if (loader) loader.className = "fa fa-refresh";
        });
      }
    };
  },
  "tasks": {
    "loader": function (elm) {
      var loader = elm.querySelector('i');
      if (loader) loader.className = "fa fa-spinner fa-spin";
    },
    "playlist": function (url) {
      var page =  document.querySelector(".content div[style*='block']");
      var item = page.querySelector("tr[item-url='" + url + "']");
      if (item) {
        var button = item.querySelector("button[type='plus']");
        var icon = button ? button.querySelector('i').getAttribute("class") : '';
        /*  */
        config.storage.update.subscribed(url, "playlist", icon === "fa fa-plus");
        config.UI.button.tasks.loader(button);
      }
    },
    "seen": function (url) {
      var page =  document.querySelector(".content div[style*='block']");
      var item = page.querySelector("tr[item-url='" + url + "']");
      if (item) {
        var button = item.querySelector("button[type='eye']");
        var icon = button ? button.querySelector('i').getAttribute("class") : '';
        /*  */
        config.storage.update.subscribed(url, "seen", icon === "fa fa-eye-slash");
        config.UI.button.tasks.loader(button);
      }
    },
    "download": function (url) {
      var page =  document.querySelector(".content div[style*='block']");
      var item = page.querySelector("tr[item-url='" + url + "']");
      if (item) {
        var button = item.querySelector("button[type='download']");
        var icon = button ? button.querySelector('i').getAttribute("class") : '';
        if (icon === "fa fa-download") config.player.audio.download.start(url);
        else if (icon === "fa fa-times") config.player.audio.download.abort(url);
        else config.UI.page.update.interface();
        /*  */
        config.UI.button.tasks.loader(button);
      }
    },
    "bookmark": function (url) {
      var page =  document.querySelector(".content div[style*='block']");
      var item = page.querySelector("[podcast-url='" + url + "']");
      if (item) {
        var button = item.querySelector("button[type='check']");
        var icon = button ? button.querySelector('i').getAttribute("class") : '';
        /*  */
        if (icon === "fa fa-check") {
          delete config.settings.episodes.subscribed[url];
          config.storage.write(config.general.id.settings, config.settings);
          config.UI.page.update.interface();
        } else if (icon === "fa fa-check-square-o") {
          config.fetch.podcast.track(url, "subscribed", true, function () {});
        } else {
          config.UI.page.update.interface();
        }
        /*  */
        config.UI.button.tasks.loader(button);
      }
    },
    "add": {
      "color": {
        "rule": function (p) {
          var color = config.settings.color;
          var style = document.getElementById("add.color.rule.style");
          /*  */
          if (!style) {
            style = document.createElement("style");
            style.setAttribute("id", "add.color.rule.style");
            style.setAttribute("type", "text/css");
            document.head.appendChild(style);
          }
          /*  */
          if (color) {
            var rule = "background: linear-gradient(to left, " + (color.background || "#4C4C4C") + " " + (100 - p) + "%, " + (color.button || "#FF6A00") + " " + (100 - p) + "%)";
            style.textContent =
              "input[rule=player]:focus::-webkit-slider-runnable-track {" + rule + "}" +
              "input[rule=player]::-webkit-slider-runnable-track {" + rule + "}" +
              "input[rule=player]:focus::-moz-range-track {" + rule + "}" +
              "input[rule=player]::-moz-range-track {" + rule + "}" +
              "input[rule=player]:focus::-ms-track {" + rule + "}" +
              "input[rule=player]::-ms-track {" + rule + "}";
          }
        }
      }
    },
    "check": {
      "progress": function (url, icon, obj) {
        var tr = document.querySelector("tr[item-url='" + url + "']");
        if (tr) {
          var total = parseInt(tr.getAttribute("item-length"));
          var button = tr.querySelector("button[type='download']");
          var length = tr.querySelector('td[class*="item-length"]');
          /*  */
          var p = (obj.loaded / (obj.total || total)) * 100;
          var CS = config.settings.color ? config.settings.color.font : "#FFF";
          var CE = config.settings.color? config.settings.color.button : "#FF6A00";
          if (obj.loaded) length.textContent = config.UI.track.size(obj.loaded) + " of " + config.UI.track.size(obj.total) + " (" + Math.floor(p) + "%)";
          /*  */
          button.querySelector('i').style.color = config.settings.color ? config.settings.color.background : "#4C4C4C";
          button.style.background = "linear-gradient(" + CS + " " + p + "%, " + CE + " " + p + "%)";
          button.querySelector('i').setAttribute("class", icon);
          button.setAttribute("title", length.textContent);
        }
      }
    },
    "render": {
      "audio": {
        "duration": function () {
          config.player.audio.value.get("duration", function (d) {
            var duration = document.querySelector('div[type="duration"]');
            duration.textContent = config.general.fn.toHHMMSS(d);
            config.player.audio.duration.index = d;
            /*  */
            if (d === 0) config.player.audio.value.set("currentTime", 0);
            else if (config.player.audio.saved.time > 0) {
              config.player.audio.value.set("currentTime", config.player.audio.saved.time);
            }
            /*  */
            [...document.querySelectorAll(".aon")].map(function (elm) {elm.style.opacity = "1.0"});
            config.log(" • track duration " + d + ", stored time " + config.player.audio.saved.time);
          });
        }
      }
    },
    "apply": {
      "scroll": function (scroll, elm) {
        var tcontrols = document.querySelector(".II-tab .top-controls");
        var pcontrols = document.querySelector(".II-tab .player-controls");
        /*  */
        if (config.core.options.scrollAction.content === true) {
          var position = parseInt(scroll > -1 ? scroll : 0);
          if (position > 200) pcontrols.setAttribute("position", "bottom");
          if (position > 50) tcontrols.setAttribute("position", "top");
          /*  */
          if (position === 0) {
            elm.style.height = "100%";
            tcontrols.removeAttribute("position");
            pcontrols.removeAttribute("position");
          } else {
            var height = document.body.style.height;
            if (!height || height === "100%") {
              elm.style.height = parseInt(getComputedStyle(document.body).height) + 10 + "px";
            }
          }
        }
      }
    },
    "play": {
      "episode": function (e) {
        var list = document.querySelector(".II-tab .podcast-list");
        var tracks = [...list.querySelectorAll('tr[item-url]')];
        var current = 0, playlist = [];
        /*  */
        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          var target = track.querySelector('button[type="plus"]').querySelector('i');
          if (target.className.indexOf("circle") !== -1) {
            playlist.push(track);
            var url = track.getAttribute("item-url");
            if (url === config.player.audio.src) {
              current = i;
            }
          }
        }
        /*  */
        if (playlist && playlist.length) {
          current = e === "previous" ? current - 1 : current + 1;
          current = current < 0 || current > playlist.length - 1 ? 0 : current;
          var url = playlist[current].getAttribute("item-url");
          config.player.audio.action.play("item", url);
        } else {
          config.player.audio.action.play("item", config.player.audio.src);
        }
      }
    }
  }
};
