config.UI.element = {
  "text": {
    "make": function (tr, txt, cls, colspan) {
      const td = document.createElement('td');
      if (cls) td.setAttribute("class", cls);
      if (colspan) td.setAttribute("colspan", colspan);
      td.textContent = txt || '';
      tr.appendChild(td);
      return td;
    }
  },
  "item": {
    "make": function (page, data, index, callback) {
      if (data) {
        let tr = null;
        const table = document.createElement('table');
        const search = page.querySelector('div[type="search"');
        const number = (data.items.length ? data.items.length : data.feed.number) + " Episodes";
        const bookmark = config.settings.episodes.subscribed && (data.url in config.settings.episodes.subscribed) ? "check" : "check-square-o";
        /*  */
        if (search) {
          search.textContent = index + " item(s) found! to subscribe, please press on the checkbox";
        }
        /*  */
        table.setAttribute("class", "item-c");
        table.setAttribute("podcast-url", data.url);
        table.setAttribute("podcast-link", data.feed.link);
        table.setAttribute("podcast-image", data.feed.image);
        table.setAttribute("podcast-title", data.feed.title);
        table.setAttribute("podcast-author", data.feed.author);
        /*  */
        tr = document.createElement('tr');
        config.UI.element.text.make(tr, (index ? index + ' - ' : '') + (data.feed.title ? data.feed.title : "Unknown Title"), "item-description");
        config.UI.button.single.make(tr, {"check": bookmark});
        config.UI.image.make.element(tr, null, data.feed.image, "item-image", 64);
        table.appendChild(tr);
        /*  */
        tr = document.createElement('tr');
        config.UI.footer.make(tr, number + (data.feed.author ? " - " + data.feed.author : " - Unknown Author") + (data.feed.link ? " - Website: " + data.feed.link : ''), "item-title", "3");
        table.appendChild(tr);
        /*  */
        page.appendChild(table);
        callback(true);
      }
    }
  },
  "header": {
    "timeout": null,
    "single": {
      "row": {
        "make": function (retweet, name) {
          let i, tr, td, div, button;
          const table = document.createElement('table');
          table.setAttribute("format", "single-row");
          table.setAttribute("class", "search");
          /*  */
          tr = document.createElement('tr');
          td = document.createElement('td');
          div = document.createElement('div');
          /*  */
          div.setAttribute("name", name);
          div.setAttribute("type", "info");
          div.textContent = "No item found!";
          td.setAttribute("class", "status");
          td.appendChild(div);
          tr.appendChild(td);
          /*  */
          i = document.createElement('i');
          td = document.createElement('td');
          button = document.createElement('button');
          /*  */
          i.setAttribute("class", "fa fa-trash");
          button.appendChild(i);
          button.setAttribute("name", name);
          button.setAttribute("type", "trash");
          button.addEventListener("click", function (e) {
            config.UI.handle.trash.for.result();
            config.app.notifications.vibrate.action(e, this);
            this.querySelector('i').setAttribute("class", "fa fa-spinner fa-spin");
          });
          /*  */
          td.appendChild(button);
          tr.appendChild(td);
          /*  */
          if (retweet) { /* extra button for topchart tab */
            i = document.createElement('i');
            td = document.createElement('td');
            button = document.createElement('button');
            /*  */
            i.setAttribute("class", "fa fa-retweet");
            button.appendChild(i);
            button.setAttribute("name", name);
            button.setAttribute("type", "retweet");
            button.addEventListener("click", function (e) {
              config.UI.handle.click.for.button.topchart();
              config.app.notifications.vibrate.action(e, this);
              this.querySelector('i').setAttribute("class", "fa fa-spinner fa-spin");
            });
            /*  */
            td.appendChild(button);
            tr.appendChild(td);
          }
          /*  */
          table.appendChild(tr);
          /*  */
          return table;
        }
      }
    },
    "double": {
      "row": {
        "make": function (placeholder, name) {
          let i, tr, td, div, input, button;
          const table = document.createElement('table');
          table.setAttribute("format", "double-row");
          table.setAttribute("class", "search");
          /*  */
          tr = document.createElement('tr');
          td = document.createElement('td');
          input = document.createElement('input');
          /*  */
          input.setAttribute("name", name);
          input.setAttribute("type", "text");
          input.setAttribute("placeholder", placeholder);
          /*  */
          input.addEventListener("keypress", function (e) {
            let key = e.which || e.keyCode || -1;
            if (e.type === "keypress" && key === 13) {
              key = config.UI.page.result.key;
              config.UI.handle.click.for.button[key]();
            }
          });
          /*  */
          td.setAttribute("type", "text");
          td.appendChild(input);
          tr.appendChild(td);
          /*  */
          i = document.createElement('i');
          td = document.createElement('td');
          button = document.createElement('button');
          /*  */
          td.setAttribute("class", "nopadding");
          i.setAttribute("class", "fa fa-search");
          button.appendChild(i);
          button.setAttribute("name", name);
          button.setAttribute("type", "search");
          button.addEventListener("click", function (e) {
            const key = config.UI.page.result.key;
            config.UI.handle.click.for.button[key]();
          });
          /*  */
          td.appendChild(button);
          tr.appendChild(td);
          table.appendChild(tr);
          /*  */
          tr = document.createElement('tr');
          td = document.createElement('td');
          div = document.createElement('div');
          /*  */
          td.setAttribute("class", "status");
          div.setAttribute("type", "info");
          div.textContent = "Podcast list (please press the checkbox next to the image to add each item to the playlist)";
          td.appendChild(div);
          tr.appendChild(td);
          /*  */
          i = document.createElement('i');
          td = document.createElement('td');
          button = document.createElement('button');
          /*  */
          td.setAttribute("class", "nopadding");
          i.setAttribute("class", "fa fa-trash");
          button.appendChild(i);
          button.setAttribute("name", name);
          button.setAttribute("type", "trash");
          button.addEventListener("click", function (e) {
            config.UI.handle.trash.for.result();
            config.app.notifications.vibrate.action(e, this);
            this.querySelector('i').setAttribute("class", "fa fa-spinner fa-spin");
          });
          /*  */
          td.appendChild(button);
          tr.appendChild(td);
          table.appendChild(tr);
          /*  */
          return table;
        }
      }
    }
  }
};
