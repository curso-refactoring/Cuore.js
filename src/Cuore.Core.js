CUORE.Core = (function(undefined) {

    var OBJ_PROTO = Object.prototype;

    var bind = function(obj, method) {
            return function() {
                return method.apply(obj, [].slice.call(arguments));
            };
        };

    var request = function(url, data, callback) {
        if (!_createXHR()) return;
        var request = _createXHR();

        request.onreadystatechange = function() {
            if (isSuccessful(request)) {
                try {
                    parsedResponse = JSON.parse(request.responseText);
                } catch (e) {
                    parsedResponse = new CUORE.Message();
                }
                callback(parsedResponse);
            }
        };

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(data);
    };

    var isSuccessful = function(request) {
        var isReadyStateOK = (request.readyState === 4);
        var isStatusOK = (request.status === 200 || request.status === 304);

        return isReadyStateOK && isStatusOK;
    }

    var requestGet = function(url, data, callback) {
        if (!_createXHR()) return;
        var request = _createXHR();
        request.onreadystatechange = function() {
            
            if (isSuccessful(request)) {
                var parsedResponse = JSON.parse(request.responseText);
                callback(parsedResponse);
            }

        };

        request.open('GET', url + _map2query(data), true);
        request.send();
    };

    var requestJSONP = function(url, data, callback) {

            callback = callback || function() {};
            var callbackName = _generateCallbackName();

            window[callbackName] = function(response) {
                callback(response);
                var theScript = document.getElementById(callbackName);
                document.getElementsByTagName("head")[0].removeChild(theScript);
            };

            script = _generateScript(url, data, callbackName);
            document.getElementsByTagName("head")[0].appendChild(script);

            return callbackName;
    };

    var _generateScript = function(url, data, callbackName) {
        var script = document.createElement("script");
        script.id = callbackName;
        script.type = "text/javascript";
        script.src = url + callbackName + _buildParamsFrom(data);

        return script;
    };

    var _generateCallbackName = function() {
        return 'F' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };


    var _buildParamsFrom = function(data) {
            var query = '';
            for (var prop in data) if (data.hasOwnProperty(prop)) {
                query += '&' + encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]);
            }

            return query;
        };

    var isOwnProperty = function(object, property) {
            return OBJ_PROTO.hasOwnProperty.call(object, property);
        };

    var toType = function(object) {
            return OBJ_PROTO.toString.call(object).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
        };

    var _createXHR = function() {
            return new XMLHttpRequest();
        };

    var _map2query = function(map) {
        if (typeof map != 'object') return '';

        var query = _buildParamsFrom(map);

        var url = query.replace(/^&/, '');
        if (url !== '') url = '?' + url;

        return url;
    };

    var _indexOfPolyfill = function() {

        [].indexOf || (Array.prototype.indexOf = function(
        item, index, theLength) {
            for (
            var theLength = this.length, index = (theLength + ~~index) % theLength;
            index < theLength && ((!(index in this) || this[index] !== item));
            index++);
            return index ^ theLength ? index : -1;
        })
    };

    _indexOfPolyfill();

    return {
        bind: bind,
        request: request,
        requestGet: requestGet,
        requestJSONP: requestJSONP,
        isOwnProperty: isOwnProperty,
        toType: toType
    };

})();
