config.UI.handle = {
  "term": {
    "for": {
      "feed": '',
      "search": '',
      "topchart": '',
      "subscribed": ''
    }
  },
  "search": {
    "element": {
      "table": function () {return document.querySelector(".III-tab .podcast-tile .search")},
      "icon": function () {return config.UI.handle.search.element.button().querySelector('i')},
      "input": function () {return config.UI.handle.search.element.table().querySelector('input[type="text"]')},
      "button": function () {return config.UI.handle.search.element.table().querySelector('button[type="search"]')},
      "retweet": function () {return config.UI.handle.search.element.table().querySelector('i[class="fa fa-retweet"]')}
    }
  },
  "map": {
    "tab": {
      "to": {
        "key": {
          ".I-tab": "front",
          ".II-tab": "player",
          ".III-tab": "result",
          ".IIII-tab": "settings",
          ".IIIII-tab": "options",
        }
      }
    }
  },
  "tabs": function (id, elm) {
    for (var item in config.UI.handle.map.tab.to.key) {
      var tab = document.querySelector(item);
      var page = tab.querySelector('.clearcache');
      /*  */
      if (page && page !== elm) page.textContent = '';
      tab.style.display = "none";
    }
    /*  */
    document.querySelector(id).style.display = "block";
  },
  "trash": {
    "for": {
      "result": function () {
        config.app.notifications.create({
          "type": "confirm",
          "message": "Are you sure you want to permanently delete these item(s)?"
        }, function (permission) {
          if (permission) {
            delete config.settings.episodes[config.UI.page.result.key];
            config.storage.write(config.general.id.settings, config.settings);
            window.setTimeout(function () {
              config.UI.page.result.make({"from": "cache"});
            }, 300);
          } else config.UI.page.update.interface();
        });
      }
    }
  },
  "click": {
    "for": {
      "button": {
        "back": function () {
          var id = document.querySelector(".II-tab").style.display === "block" ? ".I-tab" : ".II-tab";
          config.UI.page.update.key = config.UI.handle.map.tab.to.key[id];
          config.UI.page.update.interface();
        },
        "subscribed": function () {
          var list = config.settings.episodes[config.UI.page.result.key];
          if (list) {
            config.UI.page.result.make({"from": "cache"});
          }
        },
        "search": function () {
          var term = config.UI.handle.search.element.input().value;
          var list = config.settings.episodes[config.UI.page.result.key];
          if (list && term === config.UI.handle.term.for.search) {
            config.UI.page.result.make({"from": "cache"});
          } else {
            if (term) {
              config.UI.handle.term.for.search = term;
              config.print.message({"name": "fetch"});
              config.UI.handle.search.element.icon().setAttribute("class", "fa fa-spinner fa-spin");
              config.fetch.podcast.list(term);
            }
          }
        },
        "feed": function () {
          var term = config.UI.handle.search.element.input().value;
          var list = config.settings.episodes[config.UI.page.result.key];
          if (list && term === config.UI.handle.term.for.feed) {
            config.UI.page.result.make({"from": "cache"});
          } else {
            if (term) {
              config.UI.handle.term.for.feed = term;
              config.print.message({"name": "fetch"});
              config.fetch.podcast.track(term, "feed", true, function () {});
              config.UI.handle.search.element.icon().setAttribute("class", "fa fa-spinner fa-spin");
            }
          }
        },
        "topchart": function () {
          var list = config.settings.episodes[config.UI.page.result.key];
          if (list) config.UI.page.result.make({"from": "cache"});
          else {
            config.print.message({"name": "fetch"});
            config.UI.handle.search.element.retweet().setAttribute("class", "fa fa-spinner fa-spin");
            config.fetch.podcast.keys([
              "serial",
              "radio lab",
              "fresh air",
              "ted radio hour",
              "myths and legends",
              "this american life",
              "stuff you should know"
            ]);
          }
        }
      }
    }
  }
};
