config.core.listeners = {
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
  },
  "add": function (callback) {
    config.log(" • adding listeners");
    document.querySelector(".content").style.display = "block";
    /*  */
    var reload = document.querySelector('button[type="reload"]');
    reload.addEventListener("click", function () {
      document.location.reload();
    }, false);
    /*  */
    var support = document.querySelector('#support');
    support.addEventListener('click', function () {
      if (window === window.top) {
        var url = config.addon.homepage();
        chrome.tabs.create({"url": url, "active": true});
      }
    }, false);
    /*  */
    var donation = document.querySelector('#donation');
    donation.addEventListener('click', function () {
      if (window === window.top) {
        var url = config.addon.homepage() + "?reason=support";
        chrome.tabs.create({"url": url, "active": true});
      }
    }, false);
    /*  */
    var options = document.querySelector('button[type="options"]');
    options.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      config.UI.page.update.key = "options";
      config.UI.page.update.interface();
    }, false);
    /*  */
    var settings = document.querySelector('button[type="settings"]');
    settings.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      config.UI.page.update.key = "settings";
      config.UI.page.update.interface();
    }, false);
    /*  */
    var add = document.querySelector('button[type="add"]');
    add.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      config.UI.page.update.key = "result";
      config.UI.page.update.interface();
    }, false);
    /*  */
    var blockImage = document.getElementById('blockImage');
    blockImage.addEventListener("click", function (e) {
      config.fetch.limit.image = e.target.checked;
      config.app.notifications.vibrate.action(e, this);
    }, false);
    /*  */
    var podcastCap = document.getElementById('podcastCap');
    podcastCap.addEventListener("change", function (e) {
      config.general.podcast.cap = e.target.value;
    }, false);
    /*  */
    var maxSearch = document.getElementById('maxSearch');
    maxSearch.addEventListener("change", function (e) {
      config.UI.page.result.limit = e.target.value;
    }, false);
    /*  */
    var intensity = document.querySelector('input[name="intensity"]');
    intensity.addEventListener('input', function (e) {
      config.storage.update.color(this.getAttribute("name"), e.target.value);
    }, false);
    /*  */
    var trashAll = document.querySelector('button[type="trash-all"]');
    trashAll.addEventListener("click", function (e) {
      config.UI.page.cache.clear();
      config.app.notifications.vibrate.action(e, this);
      trashAll.querySelector('i').setAttribute("class", "fa fa-spinner fa-spin");
    }, false);
    /*  */
    var renderCache = document.getElementById('renderCache');
    renderCache.addEventListener("click", function (e) {
      config.UI.page.cache.render = e.target.checked;
      config.app.notifications.vibrate.action(e, this);
    }, false);
    /*  */
    var clearLog = document.querySelector('button[type="clear-log"]');
    clearLog.addEventListener("click", function (e) {
      var log = document.getElementById("log");
      if (log) log.textContent = '';
      config.app.notifications.vibrate.action(e, this);
    }, false);
    /*  */
    var markAsSeen = document.getElementById('markAsSeen');
    markAsSeen.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      var value = config.core.options.markAsSeen.content;
      if (value === true) config.core.options.markAsSeen.content = false;
      else config.core.options.markAsSeen.content = true;
    }, false);
    /*  */
    var autoRefresh = document.getElementById('autoRefresh');
    autoRefresh.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      var value = config.core.options.autoRefresh.content;
      if (value) config.core.options.autoRefresh.content = '';
      else config.core.options.autoRefresh.content = (new Date()).toString();
    }, false);
    /*  */
    var autoDelete = document.getElementById('autoDelete');
    autoDelete.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      var value = config.core.options.autoDelete.content;
      if (value === true) config.core.options.autoDelete.content = false;
      else config.core.options.autoDelete.content = true;
    }, false);
    /*  */
    var scrollAction = document.getElementById('scrollAction');
    scrollAction.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      var value = config.core.options.scrollAction.content;
      if (value === true) config.core.options.scrollAction.content = false;
      else config.core.options.scrollAction.content = true;
    }, false);
    /*  */
    var buttonVibrate = document.getElementById('buttonVibrate');
    buttonVibrate.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      var value = config.core.options.buttonVibrate.content;
      if (value === true) config.core.options.buttonVibrate.content = false;
      else config.core.options.buttonVibrate.content = true;
    }, false);
    /*  */
    var showNotifications = document.getElementById('showNotifications');
    showNotifications.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      var value = config.core.options.showNotifications.content;
      if (value === true) config.core.options.showNotifications.content = false;
      else config.core.options.showNotifications.content = true;
    }, false);
    /*  */
    var imageScale = document.getElementById('imageScale');
    imageScale.addEventListener("change", function (e) {
      config.UI.image.CACHE.img = {};
      config.UI.image.CACHE.dataURL = {};
      config.UI.image.scale = e.target.value;
    }, false);
    /*  */
    var imageThumbnail = document.getElementById('imageThumbnail');
    imageThumbnail.addEventListener("click", function (e) {
      config.UI.image.CACHE.img = {};
      config.UI.image.CACHE.dataURL = {};
      config.UI.image.thumbnail = e.target.checked;
      config.app.notifications.vibrate.action(e, this);
    }, false);
    /*  */
    var renderGPU = document.getElementById('renderGPU');
    renderGPU.addEventListener("click", function (e) {
      config.UI.image.CACHE.img = {};
      config.general.gpu.permission = e.target.checked;
      config.app.notifications.vibrate.action(e, this);
    }, false);
    /*  */
    var refresh = document.querySelector('.top-controls button[type="refresh"]');
    refresh.addEventListener("click", function (e) {
      config.app.notifications.vibrate.action(e, this);
      config.app.notifications.create({
        "type": "confirm",
        "message": "This operation will refresh all podcasts data (and also cleans up the app). Do you want to continue?"
      }, function (permission) {
        if (permission) config.app.refresh();
      });
    }, false);
    /*  */
    [...document.querySelectorAll('button[type="home"]')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.key = "front";
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('button[type="back"]')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        config.UI.handle.click.for.button.back();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('.III-tab .main-controls button')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.UI.page.result.key = this.getAttribute("type");
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('.IIII-tab .main-controls button')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.UI.page.settings.key = this.getAttribute("type");
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('.IIIII-tab .main-controls button')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.UI.page.options.key = this.getAttribute("type");
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('.IIIII-tab button[type="choose"]')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.UI.page.color.key = this.getAttribute("rule");
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('.IIIII-tab button[type="cache"]')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.UI.page.cache.key = this.getAttribute("rule");
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('.IIIII-tab .fontSize')].map(function (elm) {
      elm.style.fontSize = elm.getAttribute("value");
      elm.addEventListener("click", function (e) {
        config.UI.style.font.size = this.getAttribute("value");
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('td[rule="visibility"]')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        config.UI.controls.visibility.handle(this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('.IIIII-tab .refreshInterval')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.core.options.autoRefresh.content = (new Date()).toString();
        config.UI.refresh.interval = this.getAttribute("value");
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    [...document.querySelectorAll('.IIIII-tab button[type="theme"]')].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.storage.update.color("background", this.getAttribute("background"));
        config.storage.update.color("intensity", this.getAttribute("intensity"));
        config.storage.update.color("button", this.getAttribute("button"));
        config.storage.update.color("font", this.getAttribute("font"));
        config.app.notifications.vibrate.action(e, this);
        config.UI.page.update.interface();
      }, false);
    });
    /*  */
    var flip = document.querySelector('.title-flip').querySelectorAll('button');
    [...flip].map(function (elm) {
      elm.addEventListener("click", function (e) {
        config.app.notifications.vibrate.action(e, this);
        [...flip].map(function (elm) {elm.removeAttribute("selected")});
        this.setAttribute("selected", true);
        /*  */
        var images = document.querySelector('.title-images').querySelectorAll('td');
        var id = parseInt(this.getAttribute("slide"));
        [...images].map(function (elm) {elm.classList.add("hidden"); elm.classList.add('visuallyhidden')});
        images[id].classList.remove('hidden');
        setTimeout(function () {images[id].classList.remove('visuallyhidden')}, 20);
      }, false);
    });
    /*  */
    callback(true);
  }
};
