config.make = {
  "podcast": {
    "map": function (count, index, results) {
      var result = results[index];
      if (result) {
        config.core.map.list[result.feedUrl] = {
          "items": [],
          "url": result.feedUrl,
          "type": "podcast." + config.UI.page.result.key,
          "feed": {
            "description": "N/A",
            "link": result.feedUrl,
            "country": result.country,
            "author": result.artistName,
            "number": result.trackCount,
            "tile": result.artworkUrl600,
            "title": result.collectionName,
            "genre": result.primaryGenreName,
            "releaseDate": result.releaseDate,
            "image": result.artworkUrl100 || result.artworkUrl60 || result.artworkUrl30
          }
        };
        /*  */
        var domain = result.feedUrl;
        config.print.message({
          "index": count,
          "domain": domain,
          "name": "progress"
        });
      }
    }
  }
};

config.fetch = {
  "limit": {
    get image () {
      var o = config.settings["config.fetch.limit.image"];
      return (o && 'V' in o) ? o.V : false;
    },
    set image (val) {
      if (val) {
        config.settings["config.fetch.limit.image"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    }
  },
  "podcast" : {
    "path": "https://itunes.apple.com/",
    "api": "https://api.rss2json.com/v1/api.json?rss_url=", /* for webapp */
    "corsanywhere": "https://cors-anywhere.herokuapp.com/", /* for webapp */
    "data": function (url, callback) {
      if (window !== window.top) {
        url = config.fetch.podcast.api + encodeURIComponent(url);
        config.http.request(url, "json", null, function (data) {
          if (data.method === "result") {
            var feed = data.result;
            if (feed.status.toLowerCase() === "ok") {
              callback(feed);
            }
          }
        });
      } else {
        config.http.request(url, "document", null, function (data) {
          if (data.method === "result") {
            var feed = config.parse.xml.to.feed(data);
            if (feed && feed.status) {
              if (feed.status.toLowerCase() === "ok") {
                callback(feed);
              }
            }
          }
        });
      }
    },
    "list": function (term) {
      var address = config.fetch.podcast.path + "search?term=" + term.trim().replace(' ', '+') + "&media=podcast&limit=" + config.UI.page.result.limit;
      if (window !== window.top) address = config.fetch.podcast.corsanywhere + address;
      /*  */
      config.http.request(address, null, null, function (data) {
        if (data.method === "result") {
          var obj = JSON.parse(data.result);
          if (obj) {
            var results = obj.results;
            if (results && results.length) {
              config.core.map.list = {};
              for (var index = 0; index < results.length; index++) {
                config.make.podcast.map(index, index, results);
              }
              /*  */
              config.settings.episodes[config.UI.page.result.key] = config.core.map.list;
              config.storage.write(config.general.id.settings, config.settings);
              config.UI.page.result.make({"from": "internet"});
              config.print.message({"name": "done"});
            } else {
              config.print.message({"name": "error"});
            }
          }
        }
      });
    },
    "track": function (url, name, write, callback) {
      config.fetch.podcast.data(url, function (result) {
        if (result.status.toLowerCase() === "ok") {
          config.settings.episodes[name] = config.settings.episodes[name] !== undefined ? config.settings.episodes[name] : {};
          config.settings.episodes[name][result.feed.url] = {
            "items": result.items,
            "url": result.feed.url,
            "type": "podcast." + name,
            "feed": {
              "genre": "N/A",
              "country": "N/A",
              "releaseDate": "N/A",
              "link": result.feed.url,
              "tile": result.feed.image,
              "title": result.feed.title,
              "image": result.feed.image,
              "author": result.feed.author,
              "number": result.items.length,
              "description": result.feed.description,
            }
          };
          /*  */
          if (write) {
            config.storage.write(config.general.id.settings, config.settings);
            config.UI.page.update.interface();
          }
          /*  */
          callback(true);
        }
      });
    },
    "keys": function (keys) {
      config.core.map.list = {};
      (function loop(arr, index) {
        var key = arr[index];
        var address = config.fetch.podcast.path + "search?term=" + key + "&media=podcast&limit=1";
        if (window !== window.top) address = config.fetch.podcast.corsanywhere + address;
        config.http.request(address, null, null, function (data) {
          if (data.method === "result") {
            var obj = JSON.parse(data.result);
            if (obj) {
              var results = obj.results;
              if (results && results.length) {
                config.make.podcast.map(index, 0, results);
                /*  */
                if (++index < arr.length) {
                  window.setTimeout(function () {
                    loop(arr, index);
                  }, 100);
                } else {
                  config.settings.episodes[config.UI.page.result.key] = config.core.map.list;
                  config.storage.write(config.general.id.settings, config.settings);
                  config.UI.page.result.make({"from": "internet"});
                  config.print.message({"name": "done"});
                }
              } else {
                if (++index < arr.length) {
                  loop(arr, index);
                }
              }
            }
          }
        });
      })(keys, 0);
    }
  }
};
