CUORE.LabelCache = CUORE.Class(null, {
  init: function(labels) {
    this.labels = labels || {};
  },

  _initLocale: function(locale) {
    if(this.labels[locale]) return;
    
    this.labels[locale] = {};
  },

  setLocale: function(locale) {
    this._initLocale(locale);
    this.locale = locale;
  },

  serve: function(key) {
    return this.labels[this.locale][key];
  },

  feed: function(key, value) {
    if (value) {
        this.labels[this.locale][Key] = value;
    }
  }

});