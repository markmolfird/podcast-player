config.http = {
  "request": function (url, type, open, callback) {
    var action = function () {
      var xhr = new XMLHttpRequest();
      xhr.requestURL = url;
      /*  */
      try {
        xhr.onreadystatechange = function (e) {
          var target = e.target;
          if (target.readyState === 4) {
            var error = target.status >= 400 || target.status < 200;
            if (error) config.print.message({"name": "error", "message": "Fetch error! please try again."});
            else {
              if (open === "HEAD") {
                var size = '', type = '';
                try {type = xhr.getResponseHeader("Content-Type")} catch (e) {}
                try {size = xhr.getResponseHeader("Content-Length")} catch (e) {}
                callback({"url": this.requestURL, "method": "result", "result": {"size": size, "type": type}});
              } else if (target.responseType) {
                callback({"url": this.requestURL, "method": "result", "result": target.response});
              } else {
                callback({"url": this.requestURL, "method": "result", "result": target.responseText});
              }
            }
          }
        };
        /*  */
        xhr.onerror = function () {
          config.print.message({"name": "error", "message": "Fetch error! please try again."});
        };
        /*  */
        xhr.onprogress = function (e) {
          callback({"url": this.requestURL, "method": "progress", "xhr": e.target, "loaded": e.loaded, "total": e.total});
        };
        /*  */
        xhr.open(open ? open : 'GET', url, true);
        if (type) xhr.responseType = type;
        xhr.send();
      } catch (e) {
        config.print.message({"name": "error", "message": "Fetch error! please try again."});
      }
    };
    /*  */
    if (url) {
      if (config.port.name !== "webapp") {
        try {
          var url = new URL(url);
          if (url) action();
          else {
            config.print.message({"name": "error", "message": "Invalid URL! please try again."});
          }
        } catch (e) {
          config.print.message({"name": "error", "message": "Invalid URL! please try again."});
        }
      } else {
        action();
      }
    } else {
      config.print.message({"name": "error", "message": "Invalid URL! please try again."});
    }
  }
};
