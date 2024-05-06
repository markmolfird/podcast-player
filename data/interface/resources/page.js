config.UI.page = {
  "header": {
    "search": {
      "make": function (page) {
        const placeholder = "enter any keyword(s) then hit on the search icon";
        const element = config.UI.element.header.double.row.make(placeholder, "search");
        if (element) page.appendChild(element);
      }
    },
    "feed": {
      "make": function (page) {
        const placeholder = "enter feed URL then hit on the search icon";
        const element = config.UI.element.header.double.row.make(placeholder, "feed");
        if (element) page.appendChild(element);
      }
    },
    "topchart": {
      "make": function (page) {
        const element = config.UI.element.header.single.row.make(true, "topchart");
        if (element) page.appendChild(element);
      }
    },
    "subscribed": {
      "make": function (page) {
        const element = config.UI.element.header.single.row.make(false, "subscribed");
        if (element) page.appendChild(element);
      }
    }
  },
  "options": {
    get key () {
      const o = config.settings["config.UI.page.options.key"];
      return (o && 'V' in o) ? o.V : "general";
    },
    set key (val) {
      if (val) {
        config.settings["config.UI.page.options.key"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "make": function () {
      const page = document.querySelector(".IIIII-tab .podcast-list");
      config.UI.handle.tabs(".IIIII-tab", page);
      /*  */
      if (page) page.textContent = '';
      [...document.querySelector('.IIIII-tab').querySelectorAll('button')].map(function (elm) {elm.removeAttribute("selected")});
      document.querySelector('.IIIII-tab').querySelector('button[type=' + config.UI.page.options.key + ']').setAttribute("selected", true);
      /*  */
      const tab = document.querySelector(".IIIII-tab");
      const options = tab.querySelectorAll("div[rule='options']");
      [...options].map(function (elm) {
        (elm.getAttribute("type") === config.UI.page.options.key) ? elm.style.display = "block" : elm.style.display = "none";
      });
      /*  */
      if (config.UI.page.options.key === "color") config.UI.page.color.palette.make();
      if (config.UI.page.options.key === "cache") config.UI.page.cache.palette.make();
    }
  },
  "cache": {
    get render () {
      const o = config.settings["config.UI.page.cache.render"];
      return (o && 'V' in o) ? o.V : false;
    },
    set render (val) {
      if (val) {
        config.settings["config.UI.page.cache.render"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    get key () {
      const o = config.settings["config.UI.page.cache.key"];
      return (o && 'V' in o) ? o.V : "image";
    },
    set key (val) {
      if (val) {
        config.settings["config.UI.page.cache.key"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "clear": function () {
      config.app.notifications.create({
        "type": "confirm",
        "message": "Are you sure you want to permanently delete these items?"
      }, function (permission) {
        /* ToDo */
      });
    },
    "palette": {
      "make": function () {
        const tab = document.querySelector(".IIIII-tab");
        const choose = tab.querySelector("div[type='" + config.UI.page.options.key + "']").querySelector("table[type='choose']");
        [...choose.querySelectorAll("button[rule]")].map(function (elm) {elm.removeAttribute("selected")});
        choose.querySelector("button[rule='" + config.UI.page.cache.key + "']").setAttribute("selected", true);
        /*  */
        if (config.UI.page.options.key !== "cache") return;
        /* ToDo */
      }
    }
  },
  "track": {
    "make": function (tr, item, cls, drag) {
      config.UI.track.drag(tr, drag);
      /*  */
      const obj = {};
      const nor = item.enclosure ? "two" : "one";
      obj.url = tr.getAttribute("item-url") || '';
      obj.data = item.pubDate ? (new Date(item.pubDate)).toDateString() : '';
      obj.length = item.enclosure ? (item.enclosure.length ? item.enclosure.length : '') : '';
      obj.duration = item.enclosure ? (item.enclosure.duration ? item.enclosure.duration : '') : '';
      obj.src = item.image ? item.image : (item.thumbnail ? item.thumbnail : (item.feed ? item.feed.image : (item.path ? item.path : '')));
      obj.title = item.title ? item.title : (item.feed ? item.feed.title : '') + " - " + (item.items ? item.items.length + " Episodes" : '');
      /*  */
      const td = document.createElement('td');
      td.setAttribute("class", "extra");
      /*  */
      (function (elm, obj) {
        let tr = null;
        const table = document.createElement('table');
        if (nor === "two") {
          tr = document.createElement('tr');
          config.UI.element.text.make(tr, (obj.data ? obj.data + " - " : '') + obj.title, "item-description");
          config.UI.image.make.element(tr, null, obj.src, "item-image", 64);
          table.appendChild(tr);
          /*  */
          const length = obj.length ? config.UI.track.size(Number(obj.length)) : "Unknown Size";
          const duration = obj.duration ? ((obj.duration + '').indexOf(':') !== -1 ? obj.duration : config.general.fn.toHHMMSS(Number(obj.duration))) : "00:00:00";
          /*  */
          tr = document.createElement('tr');
          const td2 = config.UI.element.text.make(tr, length, "item-description left item-length");
          const td1 = config.UI.element.text.make(tr, duration, "item-description center item-duration");
          /*  */
          if (duration === "00:00:00") {
            config.UI.track.reload.duration(td1, obj);
          }
          /*  */
          table.appendChild(tr);
          elm.appendChild(table);
        } else { /* for settings page */
          tr = document.createElement('tr');
          config.UI.element.text.make(tr, obj.title, "item-description");
          config.UI.image.make.element(tr, null, obj.src, "item-image", 64);
          table.appendChild(tr);
          elm.appendChild(table);
        }
      })(td, obj);
      /*  */
      if (cls) tr.setAttribute("class", cls);
      tr.setAttribute("item-image", obj.src);
      tr.setAttribute("item-title", obj.title);
      tr.setAttribute("item-pubDate", obj.data);
      tr.setAttribute("item-length", obj.length);
      tr.setAttribute("item-duration", obj.duration);
      tr.appendChild(td);
    }
  },
  "color": {
    get key () {
      const o = config.settings["config.UI.page.color.key"];
      return (o && 'V' in o) ? o.V : "button";
    },
    set key (val) {
      if (val) {
        config.settings["config.UI.page.color.key"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "array": {
      "basic": ["#404040", "#FF0000", "#FF6A00", "#FFD800", "#B6FF00", "#4CFF00", "#00FF90", "#0094FF", "#0026FF", "#4800FF", "#B200FF", "#FF00DC", "#FF006E"],
      "black": ["#101010", "#202020", "#404040", "#606060", "#707070", "#808080", "#909090", "#A0A0A0", "#B0B0B0", "#C0C0C0", "#D0D0D0", "#E0E0E0", "#F0F0F0"],
      "full": [
        "#003366", "#336699", "#3366CC", "#003399", "#000099", "#0000CC", "#000066", "#006666", "#006699", "#0099CC", "#0066CC", "#0033CC", "#0000FF", "#3333FF", "#333399", "#669999", "#009999", "#33CCCC", "#00CCFF", "#0099FF", "#0066FF", "#3366FF", "#3333CC", "#666699", "#339966", "#00CC99", "#00FFCC", "#00FFFF", "#33CCFF", "#3399FF", "#6699FF", "#6666FF", "#6600FF", "#6600CC", "#339933", "#00CC66", "#00FF99", "#66FFCC", "#66FFFF", "#66CCFF", "#99CCFF", "#9999FF", "#9966FF", "#9933FF", "#9900FF", "#006600", "#00CC00", "#00FF00", "#66FF99", "#99FFCC", "#CCFFFF", "#CCCCFF", "#CC99FF", "#CC66FF", "#CC33FF", "#CC00FF", "#9900CC", "#003300", "#009933", "#33CC33", "#66FF66", "#99FF99", "#CCFFCC", "#FFFFFF", "#FFCCFF", "#FF99FF", "#FF66FF", "#FF00FF", "#CC00CC", "#660066", "#336600", "#009900", "#66FF33", "#99FF66", "#CCFF99", "#FFFFCC", "#FFCCCC", "#FF99CC", "#FF66CC", "#FF33CC", "#CC0099", "#993399", "#333300", "#669900", "#99FF33", "#CCFF66", "#FFFF99", "#FFCC99", "#FF9999", "#FF6699", "#FF3399", "#CC3399", "#990099", "#666633", "#99CC00", "#CCFF33", "#FFFF66", "#FFCC66", "#FF9966", "#FF6666", "#FF0066", "#CC6699", "#993366", "#999966", "#CCCC00", "#FFFF00", "#FFCC00", "#E2B100", "#FF6600", "#FF5050", "#CC0066", "#660033", "#996633", "#CC9900", "#FF9900", "#CC6600", "#FF3300", "#FF0000", "#CC0000", "#990033", "#663300", "#996600", "#CC3300", "#993300", "#990000", "#800000", "#993333"
      ]
    },
    "palette": {
      "make": function () {
        const tab = document.querySelector(".IIIII-tab");
        /*  */
        const intensity = tab.querySelector('input[name="intensity"]');
        intensity.value = config.settings.color ? (config.settings.color.intensity || '10') : '10';
        /*  */
        const choose = tab.querySelector("div[type='" + config.UI.page.options.key + "']").querySelector("table[type='choose']");
        [...choose.querySelectorAll("button[rule]")].map(function (elm) {elm.removeAttribute("selected")});
        choose.querySelector("button[rule='" + config.UI.page.color.key + "']").setAttribute("selected", true);
        /*  */
        config.UI.page.color.element.make("basic");
        config.UI.page.color.element.make("full");
        config.UI.page.color.element.make("black");
      }
    },
    "element": {
      "make": function (name) {
        const tab = document.querySelector(".IIIII-tab");
        const element = tab.querySelector("td[type='color-" + name + "']");
        element.textContent = '';
        /*  */
        let a = 1, b = 0, c = 0;
        const CGCA = config.UI.page.color.array[name];
        for (let i = 1; i <= CGCA.length; i++) {
          const button = document.createElement("button");
          button.setAttribute("rule", "color");
          button.setAttribute("name", config.UI.page.color.key);
          button.style.backgroundColor = CGCA[i - 1];
          button.addEventListener("click", function (e) {
            let rgb = this.getAttribute("style");
            config.app.notifications.vibrate.action(e, this);
            rgb = rgb.replace("background-color: ", '').replace(';', '');
            config.storage.update.color(this.getAttribute("name"), rgb);
          });
          /*  */
          element.appendChild(button);
          /*  */
          if (name === "full") {
            if (i === 7 * a + b) {
              const br = document.createElement("br");
              element.appendChild(br);
              a = a + 1;
              i > (CGCA.length / 2 - 1) ? c = c - 1 : c = c + 1;
              b = b + c;
            }
          }
        }
      }
    }
  },
  "front": {
    get key () {
      const o = config.settings["config.UI.page.front.key"];
      return (o && 'V' in o) ? o.V : null;
    },
    set key (val) {
      if (val) {
        config.settings["config.UI.page.front.key"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "fill": function (arr, index, callback) {
      let tr = null;
      const tables = {};
      (function loop(arr, index) {
        const url = arr[index];
        if (url) {
          const podcast = config.settings.episodes.subscribed[url];
          if (podcast && podcast.items.length) {
            const table = document.createElement('table');
            tr = document.createElement('tr');
            /*  */
            table.setAttribute("class", "item-c");
            table.setAttribute("podcast-url", url);
            config.UI.element.text.make(tr, podcast.feed.title, "item-description");
            config.UI.image.make.element(tr, null, podcast.feed.image, "item-image", 64);
            tr.addEventListener("click", function (e) {
              config.UI.page.player.key = e.target.closest("table").getAttribute("podcast-url");
              config.app.notifications.vibrate.action(e, this);
              config.UI.page.update.key = "player";
              config.UI.page.update.interface();
            });
            /*  */
            table.appendChild(tr);
            /*  */
            tr = document.createElement('tr');
            const pubdate = podcast.items[0].pubDate ? " - Latest episode " + (new Date(podcast.items[0].pubDate)).toDateString() : '';
            config.UI.footer.make(tr, podcast.items.length + " episodes" + pubdate, "item-title", null, true, "refresh");
            table.appendChild(tr);
            /*  */
            tables[url] = table;
            if (++index < arr.length) loop(arr, index);
            else callback(tables);
          } else if (++index < arr.length) loop(arr, index);
          else callback(tables);
        } else if (++index < arr.length) loop(arr, index);
      })(arr, index);
    },
    "make": function () {
      const clean = function (htw) {
        if (page) page.textContent = '';
        htw.setAttribute("class", "how-to-work-show");
      };
      /*  */
      const page = document.querySelector(".I-tab .podcast-tile");
      const htw = document.querySelector('div[class*="how-to-work"]');
      if (page) {
        config.UI.handle.tabs(".I-tab", page);
        const content = document.querySelector(".content");
        if (content) content.scrollTop = 0;
        /*  */
        if (config.settings.episodes) {
          if (config.settings.episodes.subscribed) {
            const keys = Object.keys(config.settings.episodes.subscribed);
            if (keys.length) {
              htw.setAttribute("class", "how-to-work-hide");
              config.UI.page.front.fill(keys, 0, function (e) {
                page.textContent = '';
                for (let id in e) {
                  page.appendChild(e[id]);
                }
              });
            } else clean(htw);
          } else clean(htw);
        } else clean(htw);
      }
    }
  },
  "result": {
    get key () {
      const o = config.settings["config.UI.page.result.key"];
      return (o && 'V' in o) ? o.V : "topchart";
    },
    set key (val) {
      if (val) {
        config.settings["config.UI.page.result.key"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    get limit () {
      const o = config.settings["config.UI.page.result.limit"];
      const v = (o && 'V' in o) ? o.V : "10";
      return parseInt(v);
    },
    set limit (val) {
      if (!parseInt(val)) val = 50;
      if (parseInt(val) < 0) val = 0;
      if (parseInt(val) > 200) val = 200;
      config.settings["config.UI.page.result.limit"] = {'V': val};
      config.storage.write(config.general.id.settings, config.settings);
    },
    "make": function (e) {
      config.log(" • loading results from: " + e.from);
      const page = document.querySelector(".III-tab .podcast-tile");
      if (page) {
        config.UI.handle.tabs(".III-tab", page);
        [...document.querySelector('.III-tab').querySelectorAll('button')].map(function (elm) {elm.removeAttribute("selected")});
        document.querySelector('.III-tab').querySelector('button[type=' + config.UI.page.result.key + ']').setAttribute("selected", true);
        /*  */
        page.textContent = '';
        config.UI.page.header[config.UI.page.result.key].make(page);
        /*  */
        window.setTimeout(function () {
          const list = config.settings.episodes[config.UI.page.result.key];
          if (list) {
            let count = 0;
            const keys = Object.keys(list);
            (function loop(arr, index) {
              const id = arr[index];
              const podcast = list[id];
              const flag = podcast && (podcast.type === ("podcast." + config.UI.page.result.key));
              if (flag) {
                config.UI.element.item.make(page, podcast, ++count, function () {
                  if (++index < arr.length) {
                    window.setTimeout(function () {
                      loop(arr, index);
                    }, 100);
                  }
                });
              } else if (++index < arr.length) {
                loop(arr, index);
              }
            })(keys, 0);
          }
        }, 0);
      }
    }
  },
  "settings": {
    get key () {
      const o = config.settings["config.UI.page.settings.key"];
      return (o && 'V' in o) ? o.V : "search";
    },
    set key (val) {
      if (val) {
        config.settings["config.UI.page.settings.key"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "make": function () {
      if (config.UI.page.settings.key === "color") return;
      /*  */
      const page = document.querySelector(".IIII-tab .podcast-list");
      config.UI.handle.tabs(".IIII-tab", page);
      const table = document.createElement('table');
      table.setAttribute("id", "playlist-table");
      table.setAttribute("class", "item-n");
      config.UI.drag.init(table);
      /*  */
      if (page) page.textContent = '';
      [...document.querySelector('.IIII-tab').querySelectorAll('button')].map(function (elm) {elm.removeAttribute("selected")});
      const button = document.querySelector('.IIII-tab').querySelector('button[type=' + config.UI.page.settings.key + ']');
      if (button) button.setAttribute("selected", true);
      /*  */
      const arr = Object.keys(config.settings.episodes.subscribed ? config.settings.episodes.subscribed : []);
      if (arr) {
        (function loop(arr, index) {
          const url = arr[index];
          if (url) {
            const podcast = config.settings.episodes.subscribed[url];
            if (podcast) {
              const items = podcast.items;
              for (let i = 0; i < items.length; i++) {
                const track = items[i];
                if (track && track[config.UI.page.settings.key]) {
                  const option = {};
                  if (config.UI.page.settings.key === "seen") option.eye = "eye";
                  if (config.UI.page.settings.key === "playlist") option.plus = "plus-circle";
                  if (config.UI.page.settings.key === "downloaded") option.download = "check";
                  /*  */
                  const tr = document.createElement("tr");
                  tr.setAttribute("item-url", track.enclosure.link);
                  config.UI.page.track.make(tr, track, '', false);
                  config.UI.button.single.make(tr, option);
                  table.appendChild(tr);
                }
              }
              /*  */
              if (++index < arr.length) {
                window.setTimeout(function () {
                  loop(arr, index);
                }, 300);
              }
            } else if (++index < arr.length) loop(arr, index);
          } else if (++index < arr.length) loop(arr, index);
        })(arr, 0);
      }
      /*  */
      page.appendChild(table);
    }
  },
  "player": {
    get key () {
      const o = config.settings["config.UI.page.player.key"];
      return (o && 'V' in o) ? o.V : '';
    },
    set key (val) {
      if (val) {
        config.settings["config.UI.page.player.key"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "tracks": function (podcast) {
      const table = document.createElement('table');
      table.setAttribute("class", "item-n");
      table.setAttribute("id", "items-table");
      table.setAttribute("podcast-url", config.UI.page.player.key);
      /*  */
      for (let i = 0; i < podcast.items.length; i++) {
        const track = podcast.items[i];
        const tr = config.UI.page.player.track(track);
        if (tr) {
          tr.setAttribute("podcast-url", podcast.url);
          tr.setAttribute("podcast-image", podcast.feed.image);
          table.appendChild(tr);
        }
      }
      /*  */
      return table;
    },
    "make": function () {
      let table = null;
      const page = document.querySelector(".II-tab .podcast-list");
      config.UI.handle.tabs(".II-tab", page);
      /*  */
      const current = config.settings.episodes.subscribed && (config.UI.page.player.key in config.settings.episodes.subscribed);
      if (current) {
        const podcast = config.settings.episodes.subscribed[config.UI.page.player.key];
        if (podcast && podcast.items) {
          const td = document.querySelector(".podcast-image");
          config.UI.image.make.element(null, td, podcast.feed.image, null, 200);
          /*  */
          const minutes = config.player.audio.sleep.array[config.player.audio.sleep.index];
          document.querySelector('div[type="currenttime"]').textContent = config.player.audio.current.time.text;
          document.getElementById("podcast-title").textContent = podcast.feed.title + " - " + podcast.feed.author;
          document.getElementById("podcast-sleep").textContent = minutes ? (" " + minutes + " Minutes") : (" Timer: OFF");
          /*  */
          table = document.getElementById("items-table");
          if (table) table.remove();
          table = config.UI.page.player.tracks(podcast);
          if (page) page.textContent = '';
          page.appendChild(table);
        }
      }
    },
    "track": function (track) {
      if (track && track.enclosure && track.enclosure.link) {
        const tr = document.createElement("tr");
        tr.setAttribute("item-url", track.enclosure.link);
        /*  */
        const seen = track.seen ? '' : "eye-slash";
        const plus = track.playlist ? "plus-circle" : '';
        const download = track.downloaded ? "check" : "download";
        const flag1 = config.player.audio.action.content === "pause";
        const flag2 = config.player.audio.src === track.enclosure.link;
        const status = flag1 && flag2 ? "highlight" : '';
        /*  */
        config.UI.button.single.make(tr, {"play": ''});
        config.UI.page.track.make(tr, track, status, false);
        config.UI.button.combined.make(tr, [{"plus": plus}, {"eye": seen}]);
        /*  */
        if (flag1 && flag2) {
          document.getElementById("podcast-title").textContent = track.title;
          tr.querySelector('button[type="play"]').querySelector('i').setAttribute("class", "fa fa-stop");
          document.querySelector('button[type="play"]').querySelector('i').setAttribute("class", "fa fa-pause");
          if (config.core.options.showNotifications.content === true) {
            if (window !== window.top) {
              config.app.notifications.create({
                "type": "normal",
                "message": document.getElementById("podcast-title").textContent
              });
            }
          }
        }
        /*  */
        if (!seen) {
          if (config.player.audio.seen.state) {
            tr.setAttribute("eye", config.player.audio.seen.state);
          }
        }
        /*  */
        return tr;
      }
      /*  */
      return null;
    }
  },
  "update": {
    get key () {
      const o = config.settings["config.UI.page.update.key"];
      return (o && 'V' in o) ? o.V : "front";
    },
    set key (val) {
      if (val) {
        config.settings["config.UI.page.update.key"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    },
    "interface": function () {
      const key = config.UI.page.update.key;
      if (!key) config.log(" • ERROR: unkown page key");
      else {
        config.UI.page.update.theme();
        config.UI.page[key].make(key === "result" ? {"from": "cache"} : config.UI.page[key].key);
        /*  */
        const svglogo = document.querySelector('#svglogo');
        if (svglogo) svglogo.removeAttribute("class");
        config.log(" • tab: " + key + " page");
      }
    },
    "theme": function () {
      let style = null;
      config.log(" • updating theme");
      const color = config.settings.color;
      style = document.getElementById("update.theme.style");
      if (!style) {
        style = document.createElement("style");
        style.setAttribute("id", "update.theme.style");
        style.setAttribute("type", "text/css");
        document.head.appendChild(style);
      };
      /*  */
      style.textContent =
        ("body, table, button, p {font-size: " + config.UI.style.font.size + "}") +
        (color && color.font ?
          "body, body * {color: " + color.font + "}" +
          ".top-controls[position='top'], .player-controls[position='bottom'] {box-shadow: 0 0 1px 0 " + color.font + "}" : ''
        ) +
        (color && color.intensity ?
          ".item-c {background-color: rgba(0,0,0," + parseInt(color.intensity) / 100 + ")}" +
          ".item-n table {background-color: rgba(0,0,0," + parseInt(color.intensity) / 100 + ")}" +
          ".player-controls {background-color: rgba(0,0,0," + parseInt(color.intensity) / 100 + ")}" +
          ".litecolor {background-color: rgba(0,0,0," + parseInt(color.intensity) / 100 + ") !important}" +
          ".main-controls button {background-color: rgba(0,0,0," + parseInt(color.intensity) / 100 + ")}" +
          ".top-controls[position='top'] tbody {background-color: rgba(0,0,0," + parseInt(color.intensity) / 100 + ")}" +
          ".II-tab .podcast-list tr[item-url] {outline: solid 1px rgba(0,0,0," + parseInt(color.intensity) / 100 + ")}" +
          ".player-controls[position='bottom'] tbody {background-color: rgba(0,0,0," + parseInt(color.intensity) / 100 + ")}" : ''
        ) +
        (color && color.background ?
          "html, body, .content {background-color: " + color.background + "}" +
          ".III-tab .search div {background-color: " + color.background + "}" +
          ".III-tab .search input {background-color: " + color.background + "}" +
          ".top-controls[position='top'] {background-color: " + color.background + "}" +
          "input[rule=player]::-ms-track {background-color: " + color.background + "}" +
          ".player-controls[position='bottom'] {background-color: " + color.background + "}" +
          "input[rule=player]::-moz-range-track {background-color: " + color.background + "}" +
          "input[rule=player]::-webkit-slider-runnable-track {background-color: " + color.background + "}" : ''
        ) +
        (color && color.button ?
          ".intro svg {fill: " + color.button + "}" +
          ".title svg {fill: " + color.button + "}" +
          ".item-title {background-color: " + color.button + "}" +
          ".item-n button {background-color: " + color.button + "}" +
          ".III-tab .search {background-color: " + color.button + "}" +
          ".top-controls button {background-color: " + color.button + "}" +
          ".titlecolor {background-color: " + color.button + " !important}" +
          ".highlight {outline: solid 1px " + color.button + " !important}" +
          ".III-tab .search button {background-color: " + color.button + "}" +
          ".player-controls button {background-color: " + color.button + "}" +
          "button[selected='true'] {background-color: " + color.button + "}" +
          "table[type='choose'] button {border: solid 1px " + color.button + "}" +
          ".item-c button[type='theme'] {background-color: " + color.button + "}" +
          "input[type=range]::-ms-thumb {background-color: " + color.button + "}" +
          ".item-c .action-button button {background-color: " + color.button + "}" +
          ".II-tab .title-images tr td img {background-color: " + color.button + "}" +
          "input[type=range]::-moz-range-thumb {background-color: " + color.button + "}" +
          "input[type=range]::-webkit-slider-thumb {background-color: " + color.button + "}" : ''
        );
    }
  }
};
