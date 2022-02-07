var background = {
  "port": null,
  "message": {},
  "receive": function (id, callback) {
    if (id) {
      background.message[id] = callback;
    }
  },
  "connect": function (port) {
    chrome.runtime.onMessage.addListener(background.listener); 
    /*  */
    if (port) {
      background.port = port;
      background.port.onMessage.addListener(background.listener);
      background.port.onDisconnect.addListener(function () {
        background.port = null;
      });
    }
  },
  "send": function (id, data) {
    if (id) {
      if (context !== "webapp") {
        chrome.runtime.sendMessage({
          "method": id,
          "data": data,
          "path": "interface-to-background"
        }); 
      }
    }
  },
  "post": function (id, data) {
    if (id) {
      if (background.port) {
        background.port.postMessage({
          "method": id,
          "data": data,
          "port": background.port.name,
          "path": "interface-to-background"
        });
      }
    }
  },
  "listener": function (e) {
    if (e) {
      for (var id in background.message) {
        if (background.message[id]) {
          if ((typeof background.message[id]) === "function") {
            if (e.path === "background-to-interface") {
              if (e.method === id) {
                background.message[id](e.data);
              }
            }
          }
        }
      }
    }
  }
};

var config = {
  "settings": {},
  "MEDIA_ERR": false,
  "load": function () {
    config.storage.load(config.app.load);
    window.removeEventListener("load", config.load, false);
  },
  "listener": {
    "mouse": {
      "up": function () {
        var currentTime = document.querySelector('div[type="currenttime"]');
        var range = document.querySelector('input[rule="player"]');
        currentTime.action = true;
        range.action = true;
      }
    },
    "content": {
      "loaded": function () {
        var content = document.querySelector(".content");
        var support = document.querySelector("#support");
        var donation = document.querySelector("#donation");
        /*  */
        if (support) support.style.display = window === window.top ? "block" : "none";
        if (donation) donation.style.display = window === window.top ? "block" : "none";
        if (content) content.style.width = window === window.top ? "calc(100% + 17px)" : "100%";
      }
    },
    "click": function (e) {
      if (e.target) {
        var td = e.target.closest("td");
        if (td) {
          var keys = "left|center|right|footer";
          if (keys.indexOf(td.className) !== -1) {
            return;
          }
        }
      }
      /*  */
      config.UI.controls.visibility.hide();
    }
  },
  "resize": {
    "timeout": null,
    "method": function () {
      if (config.port.name === "win") {
        if (config.resize.timeout) window.clearTimeout(config.resize.timeout);
        config.resize.timeout = window.setTimeout(async function () {
          var current = await chrome.windows.getCurrent();
          /*  */
          config.storage.write("interface.size", {
            "top": current.top,
            "left": current.left,
            "width": current.width,
            "height": current.height
          });
        }, 1000);
      }
    }
  },
  "port": {
    "name": '',
    "connect": function () {
      config.port.name = "webapp";
      var context = document.documentElement.getAttribute("context");
      /*  */
      if (chrome.runtime) {
        if (chrome.runtime.connect) {
          if (context !== config.port.name) {
            if (document.location.search === "?win") {
              config.port.name = "win";
            }
            /*  */
            background.connect(chrome.runtime.connect({"name": config.port.name}));
          }
        }
      }
      /*  */
      document.documentElement.setAttribute("context", config.port.name);
    }
  },
  "storage": {
    "local": {},
    "read": function (id) {
      return config.storage.local[id];
    },
    "load": function (callback) {
      chrome.storage.local.get(null, function (e) {
        config.storage.local = e;
        callback();
      });
    },
    "write": function (id, data) {
      if (id) {
        if (data !== '' && data !== null && data !== undefined) {
          var tmp = {};
          tmp[id] = data;
          config.storage.local[id] = data;
          chrome.storage.local.set(tmp, function () {});
        } else {
          delete config.storage.local[id];
          chrome.storage.local.remove(id, function () {});
        }
      }
    }
  }
};

config.port.connect();

window.addEventListener("load", config.load, false);
window.addEventListener("click", config.listener.click, false);
window.addEventListener("resize", config.resize.method, false);
document.addEventListener("mouseup", config.listener.mouse.up);
document.addEventListener("DOMContentLoaded", config.listener.content.loaded, false);
