config.parse = {
  "xml": {
    "to": {
      "feed": function (data) {
        if (data.url && data.result) {
          var channel = data.result.querySelector("channel");
          if (channel) {
            var items = [...channel.querySelectorAll("item")];
            var podcast = {"feed": {}, "items": [], "status": "error"};
            /*  */
            var link = {};
            link.a = channel.querySelector("link");
            link.b = channel.querySelector("link[href]");
            link.c = channel.querySelector("link[href][rel='self']");
            link.r = link.c ? link.c.getAttribute("href") : (link.b ? link.b.getAttribute("href") : (link.a ? link.a.textContent : ''));
            /*  */
            var image = {};
            image.a = channel.querySelector("image");
            image.b = image.a.getAttribute("href");
            image.c = image.a.querySelector("url");
            image.r = image.b ? image.b : (image.c ? image.c.textContent : '');
            /*  */
            podcast.feed.link = link.r;
            podcast.feed.url = data.url;
            podcast.feed.image = image.r;
            podcast.feed.number = items && items.length ? items.length : 0;
            podcast.feed.title = channel.querySelector("title") ? channel.querySelector("title").textContent : '';
            podcast.feed.author = channel.querySelector("author") ? channel.querySelector("author").textContent : '';
            podcast.feed.description = channel.querySelector("description") ? channel.querySelector("description").textContent : '';
            /*  */
            if (items) {
              var max = items.length > config.general.podcast.cap ? config.general.podcast.cap : items.length;
              for (var i = 0; i < max; i++) {
                var item = items[i];
                if (item) {
                  var enclosure = item.querySelector("enclosure");
                  if (enclosure) {
                    var url = enclosure.getAttribute("url");
                    if (url) {
                      podcast.items.push({
                        "categories": [],
                        "link": item.querySelector("link") ? item.querySelector("link").textContent : '',
                        "guid": item.querySelector("guid") ? item.querySelector("guid").textContent : '',
                        "title": item.querySelector("title") ? item.querySelector("title").textContent : '',
                        "author": item.querySelector("author") ? item.querySelector("author").textContent : '',
                        "pubDate": item.querySelector("pubDate") ? item.querySelector("pubDate").textContent : '',
                        "content": item.querySelector("content") ? item.querySelector("content").textContent : '',
                        "thumbnail": item.querySelector("image") ? item.querySelector("image").getAttribute("href") : '',
                        "description": item.querySelector("description") ? item.querySelector("description").textContent : '',
                        "enclosure": {
                          "rating": {"value": '', "scheme": ''},
                          "link": item.querySelector("enclosure").getAttribute("url") || '',
                          "type": item.querySelector("enclosure").getAttribute("type") || "audio/mpeg",
                          "length": parseInt(item.querySelector("enclosure").getAttribute("length") || 0),
                          "duration": parseInt(item.querySelector("enclosure").getAttribute("duration") || 0)
                        }
                      });
                    }
                  }
                }
              }
            }
            /*  */
            if (podcast.items.length) podcast.status = "ok";
            /*  */
            return podcast;
          }
        }
      }
    }
  }
};
