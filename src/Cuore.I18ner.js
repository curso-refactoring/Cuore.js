CUORE.I18ner = CUORE.Class(null, {

  init: function(component) {
    this.labels = {};
    this.component = component;
  },

  setText: function(aKey, aText) {
      this.labels[aKey] = aText;
  },

  getText: function(key) {
      if(!key) return null;

      return this.labels[key];
  },

  setI18NKey: function(key) {
      if (!key) return;

      this.setText(key, key);

      this.component.addHandler('LABELS_getLabel_EXECUTED_' + key, new CUORE.Handlers.SetText());
      this.requestLabelText(key, this.component);
  },

  requestLabelText: function(aKey) {
      this._executeLabelsService(aKey);
  },

  requestAll: function() {
    for(var key in this.labels){
      this._executeLabelsService(key);
    }
  },

  _executeLabelsService:function(aKey){
    var directory = this.component.services;
      if (!directory) return;
       directory.execute("LABELS", 'getLabel', {
              key: aKey
          }, true);
  }

  

});