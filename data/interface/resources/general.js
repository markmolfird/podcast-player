config.general = {
  "id": {
    "app": "podcast-player-prime-app",
    "settings": "podcast-player-prime-settings",
    "filename": "podcast-player-prime-filename",
    "interface": "podcast-player-prime-interface",
    "downloaded": "podcast-player-prime-downloaded"
  },
  "podcast": {
    get cap () {
      const o = config.settings["config.general.podcast.cap"];
      return (o && 'V' in o) ? o.V : 15;
    },
    set cap (val) {
      if (val) {
        config.settings["config.general.podcast.cap"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    }
  },
  "gpu": {
    get permission () {
      const o = config.settings["config.general.gpu.permission"];
      return (o && 'V' in o) ? o.V : false;
    },
    set permission (val) {
      if (val) {
        config.settings["config.general.gpu.permission"] = {'V': val};
        config.storage.write(config.general.id.settings, config.settings);
      }
    }
  },
  "fn": {
    "toHHMMSS": function (sec) {
      const s = parseInt(sec, 10);
      if (s) {
        let hours = Math.floor(s / 3600);
        let minutes = Math.floor((s - (hours * 3600)) / 60);
        let seconds = s - (hours * 3600) - (minutes * 60);
        /*  */
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        /*  */
        return (hours + ':' + minutes + ':' + seconds);
      } else {
        return "00:00:00";
      }
    }
  }
};
