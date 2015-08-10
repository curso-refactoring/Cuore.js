CUORE.Services.Label = CUORE.Class(CUORE.Service, {

    init: function() {
        CUORE.Services.Label.parent.init.call(this);

        this.name = 'LABELS';
        this.cache = new CUORE.LabelCache(document.labels);
        this.setLocale(navigator.language || navigator.browserLanguage);
    },

    cache: function() {
        return this.cache.labels;
    },

    setLocale: function(aLocale) {
        if (!aLocale) return;

        this.locale = aLocale;
        this.cache.setLocale(this.locale);
    },

    getLabel: function(params, eventName) {
        if (!(params && params.key)) return;

        var eventNameWithKey = eventName + this.SEPARATOR + params.key;
        var cachedLabel = this.fromCache(params.key);

        if (cachedLabel) {
            var cachedResponse = buildResponse(params, cachedLabel);
            CUORE.Services.Label.parent.emit.call(this, eventNameWithKey, cachedResponse);
        } else {
            if (!params.locale) params.locale = this.locale;
            var url = this.getBaseURL() + '/labels/get';
            this.request(url, params, eventNameWithKey);
        }
    },

    buildResponse: function(params, text) {
        var cachedResponse = new CUORE.Message();
        cachedResponse.putMapOnQuery(params);
        cachedResponse.putOnAnswer('text', text);
        return cachedResponse.asJson();
    },

    fromCache: function(key) {
        var text = this.cache.serve(key);
        return text;
    },

    feedCache: function(theKey, value) {
        this.cache.feed(theKey, value);
    },

    emit: function(eventName, response) {
        var theKey = this.extractKey(eventName);
        if (!theKey) return;
        var theMessage = new CUORE.Message(response);
        var text = theMessage.getFromAnswer('text');
        this.feedCache(theKey, text);
        text = text || theKey;
        theMessage.putOnAnswer('text', text);

        CUORE.Services.Label.parent.emit.call(this, eventName, theMessage.asJson());
    },

    extractKey: function(eventName) {
        var match = eventName.match(/_([a-zA-Z\.]*)$/);
        var theKey = match ? match[1] : null;

        return theKey;
    }
});