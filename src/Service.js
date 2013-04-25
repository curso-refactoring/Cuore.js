CUORE.Service = CUORE.Class(null, {

    init: function () {
        this.name = 'ABSTRACT';
        this.executionPrefix = 'EXECUTED';
        this.SEPARATOR = '_';
        this.baseURL = '';
    },

    execute: function (procedure, data) {
        var eventName = this._getEventName(procedure);
        this[procedure](data, eventName);
    },

    getName: function () {
        return this.name;
    },

    getBaseURL: function () {
        return this.baseURL;
    },

    setBaseURL: function (baseURL) {
        this.baseURL = baseURL;
    },

    _wrapResponse: function(response){
        return new CUORE.Message(response);
    },

    _wrapRequestdata: function(data){
        var theMessage = new CUORE.Message();
        theMessage.putMapOnQuery(data);

        return theMessage.asJson();
    },


    _emit: function (eventName, response) {
        var theMessage = this._wrapResponse(response);
        CUORE.Bus.emit(eventName, theMessage);
    },

    _doRequest: function (url, dataData, callback)
    {
        CUORE.Core.request(url, dataData, callback);
    },

    _request: function (url, data, eventName) {
        var dataData = this._wrapRequestdata(data)

        var callback = this._responseCallback(eventName);
        this._doRequest(url, dataData, callback);
    },

    _getEventName: function (procedure) {
        return this.getName() + this.SEPARATOR + procedure + this.SEPARATOR + this.executionPrefix;
    },

    _responseCallback: function(eventName) {
        var callback= function(response) {
            this._emit(eventName, response);
        }
        return CUORE.Core.bind(this,callback);;
    }
});