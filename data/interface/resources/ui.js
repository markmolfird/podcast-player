config.UI = {
  "style": {
    "font": {
      get size () {
        const o = config.settings["config.UI.style.font.size"];
        return (o && 'V' in o) ? o.V : "14px";
      },
      set size (val) {
        if (val) {
          config.settings["config.UI.style.font.size"] = {'V': val};
          config.storage.write(config.general.id.settings, config.settings);
        }
      }
    }
  },
  "footer": {
    "make": function (tr, txt, cls, colspan, button, type) {
      const td = document.createElement('td');
      if (cls) td.setAttribute("class", cls);
      if (colspan) td.setAttribute("colspan", colspan);
      td.textContent = txt || "Unknown";
      tr.appendChild(td);
      /*  */
      if (button) {
        const td = document.createElement('td');
        if (cls) td.setAttribute("class", cls);
        const button = document.createElement('button');
        const i = document.createElement('i');
        if (type) {
          button.setAttribute("type", type);
          if (type === "refresh") {
            button.title = "Refresh Episodes";
          }
        }
        /*  */
        button.addEventListener("click", function (e) {
          config.app.notifications.vibrate.action(e, this);
          config.UI.button.action(this, this.getAttribute("type"));
        });
        /*  */
        if (type) i.setAttribute("class", "fa fa-" + type);
        button.appendChild(i);
        td.appendChild(button);
        tr.appendChild(td);
      }
    }
  },
  "controls": {
    "visibility": {
      "handle": function (t) {
        if (t.getAttribute("type") === "collapse") config.UI.controls.visibility.hide();
        else if (t.getAttribute("type") === "expand") config.UI.controls.visibility.show();
      },
      "show": function () {
        const footer = document.querySelectorAll(".footer");
        const visibility = document.querySelectorAll('td[rule="visibility"]');
        /*  */
        [...footer].map(function (elm) {
          elm.classList.remove('visuallyhidden');
          elm.classList.remove("hidden");
        });
        /*  */
        [...visibility].map(function (elm) {
          elm.setAttribute("type", "collapse");
          elm.querySelector('i').setAttribute("class", "fa fa-angle-up");
        });
      },
      "hide": function () {
        const footer = document.querySelectorAll(".footer");
        const visibility = document.querySelectorAll('td[rule="visibility"]');
        /*  */
        [...footer].map(function (elm) {
          setTimeout(function () {elm.classList.add("hidden")}, 300);
          elm.classList.add('visuallyhidden');
        });
        /*  */
        [...visibility].map(function (elm) {
          elm.setAttribute("type", "expand");
          elm.querySelector('i').setAttribute("class", "fa fa-angle-down");
        });
      }
    }
  },
  "refresh": {
    "timeout": '',
    get interval () {
      const o = config.settings["config.UI.refresh.interval"];
      const v = (o && 'V' in o) ? o.V : "24";
      return parseInt(v);
    },
    set interval (val) {
      config.settings["config.UI.refresh.interval"] = {'V': val};
      config.storage.write(config.general.id.settings, config.settings);
    },
    "start": function () {
      const refresh = document.querySelector('button[type="refresh"]');
      if (refresh) refresh.querySelector('i').className = "fa fa-retweet fa-spin";
      config.UI.refresh.stop();
    },
    "stop": function (flag) {
      const stop = function () {
        const refresh = document.querySelector('button[type="refresh"]');
        if (refresh) refresh.querySelector('i').className = "fa fa-retweet";
        /*  */
        const trashAll = document.querySelector('button[type="trash-all"]');
        if (trashAll) trashAll.querySelector('i').className = "fa fa-trash";
      };
      if (config.UI.refresh.timeout) window.clearTimeout(config.UI.refresh.timeout);
      flag ? stop() : config.UI.refresh.timeout = window.setTimeout(stop, 3000);
    },
    "check": function () {
      config.log(" • check auto refresh");
      if (config.core.options.autoRefresh.content) {
        const newDate = new Date();
        const oldDate = new Date(config.core.options.autoRefresh.content);
        const hours = (newDate - oldDate) / 1000 / 60 / 60;
        /*  */
        if (hours > config.UI.refresh.interval) {
          config.app.refresh();
          config.core.options.autoRefresh.content = newDate.toString();
          config.log(" • updating podcast's data, next update is in " + config.UI.refresh.interval + " hour(s)");
        }
        /*  */
        window.setTimeout(function () {
          config.UI.refresh.check();
        }, 1000 * 60 * 30);
      }
    }
  }
};
