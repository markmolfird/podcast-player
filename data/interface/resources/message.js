config.print = {
  "message": function (e) {
    const search = document.querySelector(".III-tab .podcast-tile .search");
    if (search) {
      const info = search.querySelector('div[type="info"]');
      if (info) {
        if (e.name === "fetch") info.textContent = "Fetching feeds...";
        if (e.name === "storage") info.textContent = "Loading results...";
        if (e.name === "collect") info.textContent = "Collecting feeds...";
        if (e.name === "progress") info.textContent = "Fetching feed #" + (e.index  + 1) + ' ' + e.domain;
        if (e.name === "subscribed") info.textContent = "Subscribed feed " + (e.index  + 1) + e.domain + " :: skipped";
        /*  */
        if (e.name === "done") {
          try {
            info.textContent = "Loading results...";
            const button = search.querySelector('button[type="search"]');
            if (button) button.querySelector('i').setAttribute("class", "fa fa-search");
          } catch (e) {}
          /*  */
          if (config.UI.element.header.timeout) window.clearTimeout(config.UI.element.header.timeout);
          config.UI.element.header.timeout = window.setTimeout(function () {
            if (info.textContent === "Loading results...") {
              info.textContent = "Error! please try another keyword or phrase.";
            }
          }, 1000 * 30);
        }
        /*  */
        if (e.name === "error") {
          if (config.UI.element.header.timeout) window.clearTimeout(config.UI.element.header.timeout);
          config.UI.element.header.timeout = window.setTimeout(function () {
            try {
              const button = {};
              button.trash = search.querySelector('button[type="trash"]');
              button.search = search.querySelector('button[type="search"]');
              button.retweet = search.querySelector('button[type="retweet"]');
              /*  */
              if (button.trash) button.trash.querySelector('i').setAttribute("class", "fa fa-trash");
              if (button.search) button.search.querySelector('i').setAttribute("class", "fa fa-search");
              if (button.retweet) button.retweet.querySelector('i').setAttribute("class", "fa fa-retweet");
              /*  */
              info.textContent = e.message ? e.message : "No result! please try another keyword or phrase.";
            } catch (e) {}
          }, 3000);
        }
      }
    }
  }
};
