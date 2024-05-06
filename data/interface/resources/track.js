config.UI.track = {
  "map": {
    "length": {},
    "element": {},
    "duration": {},
    "audiocontext": {}
  },
  "size": function (s) {
    s = Number(s);
    if (s) {
      if (s >= Math.pow(2, 30)) return (s / Math.pow(2, 30)).toFixed(1) + " GB";
      if (s >= Math.pow(2, 20)) return (s / Math.pow(2, 20)).toFixed(1) + " MB";
      if (s >= Math.pow(2, 10)) return (s / Math.pow(2, 10)).toFixed(1) + " KB";
      return s + " B";
    } else {
      return "Unknown Size";
    }
  },
  "move": function (url, direction) {
    let index = -1;
    const episodes = config.settings["episodes"] || {};
    const playlist = episodes["playlist"] || [];
    /*  */
    for (let i = 0; i < playlist.length; i++) {
      if (playlist[i] === url) {
        index = i;
        break;
      }
    }
    /*  */
    if (index !== -1) {
      const nindex = (direction === "up") ? (index - 1) : (index + 1);
      if (playlist[nindex]) {
        const tmp = playlist[index];
        playlist[index] = playlist[nindex];
        playlist[nindex] = tmp;
        episodes["playlist"] = playlist;
        config.settings["episodes"] = episodes;
        config.storage.write(config.general.id.settings, config.settings);
      }
    }
  },
  "drag": function (tr, drag) {
    if (drag) {
      (function (tr, drag) {
        let i, button;
        tr.setAttribute("name", "drag");
        tr.setAttribute("draggable", true);
        const td = document.createElement('td');
        td.setAttribute("class", "drag");
        /*  */
        i = document.createElement('i');
        button = document.createElement('button');
        i.setAttribute("class", "fa fa-arrow-up");
        button.style.cursor = "pointer";
        button.addEventListener("click", function (e) {
          const url = this.parentNode.parentNode.getAttribute("item-url");
          config.UI.track.move(url, "up");
        });
        /*  */
        button.appendChild(i);
        td.appendChild(button);
        /*  */
        i = document.createElement('i');
        button = document.createElement('button');
        i.setAttribute("class", "fa fa-bars");
        button.style.cursor = "move";
        button.appendChild(i);
        td.appendChild(button);
        /*  */
        i = document.createElement('i');
        button = document.createElement('button');
        i.setAttribute("class", "fa fa-arrow-down");
        button.style.cursor = "pointer";
        button.addEventListener("click", function (e) {
          const url = this.parentNode.parentNode.getAttribute("item-url");
          config.UI.track.move(url, "down");
        });
        /*  */
        button.appendChild(i);
        td.appendChild(button);
        /*  */
        tr.appendChild(td);
      })(tr, drag);
    }
  },
  "reload": {
    "info": function (td, o) {
      if (td) {
        const valid = config.UI.track.map && config.UI.track.map.audiocontext && config.UI.track.map.audiocontext[o.url];
        if (valid) {
          const tr = td.closest("tr");
          if (tr) {
            const td = tr.querySelector(".item-length");
            if (td.textContent === "Unknown Size") {
              const audiocontext = config.UI.track.map.audiocontext[o.url];
              if (audiocontext) {
                const a = audiocontext.channelCount > 1 ? "Stereo" : "Mono";
                const b = (audiocontext.context.sampleRate / 1000) + "kHz";
                /*  */
                td.textContent = a + '-' + b;
              }
            }
          }
        } else {
          if (o.audio) {
            const tr = td.closest("tr");
            if (tr) {
              const td = tr.querySelector(".item-length");
              if (td.textContent === "Unknown Size") {
                try {
                  const AudioContext = window.AudioContext || window.webkitAudioContext;
                  if (AudioContext) {
                    const audiocontext = new AudioContext();
                    const track = audiocontext.createMediaElementSource(o.audio);
                    if (track) {
                      const a = track.channelCount > 1 ? "Stereo" : "Mono";
                      const b = (track.context.sampleRate / 1000) + "kHz";
                      config.UI.track.map.audiocontext[o.url] = {
                        "channelCount": track.channelCount,
                        "context": {
                          "sampleRate": track.context.sampleRate
                        }
                      };
                      /*  */
                      td.textContent = a + ' ' + b;
                      o.audio.remove();
                    }
                  } else {
                    td.textContent = "N/A";
                  }
                } catch (e) {
                  td.textContent = "N/A";
                }
              }
            }
          }
        }
      }
    },
    "duration": function (td, o) {
      if (td) {
        let tr, src, duration;
        const valid = config.UI.track.map && config.UI.track.map.duration && config.UI.track.map.duration[o.url];
        if (valid) {
          duration = config.UI.track.map.duration[o.url];
          config.UI.track.reload.info(td, o);
          td.textContent = duration;
        } else {
          try {
            const audio = document.createElement("audio");
            const source = document.createElement("source");
            audio.setAttribute("preload", "metadata");
            source.setAttribute("type", "audio/mpeg");
            audio.addEventListener("loadedmetadata", function (e) {
              tr = e.target.closest("tr");
              if (tr) {
                duration = e.target.duration;
                if (duration) {
                  duration = config.general.fn.toHHMMSS(Number(duration));
                  tr.querySelector(".item-duration").textContent = duration;
                  config.UI.track.map.duration[o.url] = duration;
                  /*  */
                  td = tr.querySelector(".item-length");
                  src = e.target.querySelector("source").src;
                  /*  */
                  config.UI.track.reload.info(td, {
                    "url": src, 
                    "audio": e.target
                  });
                } else {
                  tr.querySelector(".item-duration").textContent = "00:00:00";
                }
              }
            }, false);
            /*  */
            audio.addEventListener("error", function (e) {
              tr = e.target.closest("tr");
              if (tr) {
                tr.querySelector(".item-duration").textContent = "00:00:00";
              }
            }, false);
            /*  */
            audio.appendChild(source);
            td.appendChild(audio);
            source.src = o.url;
          } catch (e) {
            td.textContent = "00:00:00";
          }
        }
      }
    }
  }
};
