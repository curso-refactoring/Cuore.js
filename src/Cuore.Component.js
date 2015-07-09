CUORE.Component = CUORE.Class(null, {

    init: function() {
        this.setHandlerSet(new CUORE.HandlerSet());
        this.name = this._generateUUID();
        this.procedure = 'nullProcedure';
        this.SEPARATOR = '_';
        this.labels = new CUORE.I18ner(this);
        this.renderer = new CUORE.Renderer();
        this.enabled = true;
        this.behaviour = CUORE.Behaviours.APPEND;
    },

    setHandlerSet: function(handlerSet) {
        this.handlerSet = handlerSet;
    },

    setDirectory: function(directory) {
        this.services = directory;
        this.labels.requestAll();
    },

    behave: function(behaviour) {
        this.behaviour = behaviour;
    },

    doYouReplace: function() {
        return this.behaviour === CUORE.Behaviours.REPLACE;
    },

    doYouHijack: function() {
        return this.behaviour === CUORE.Behaviours.HIJACK;
    },

    draw: function() {
        this.renderer.render(this);
    },

    updateRender: function() {
        this.renderer.update(this);
    },

    destroy: function() {
        this.renderer.erase();
        CUORE.Bus.unsubscribe(this, this.getManagedEvents());
    },

    execute: function(theService, theProcedure, params, asynchronous) {
        if (!this.services) throw new Error("Cannot call service. A service directory is not configured");
        this.services.execute(theService, theProcedure, params, asynchronous);
    },

    eventDispatch: function(eventName, params) {
        this.handlerSet.notifyHandlers(eventName, params);
    },

    addHandler: function(eventName, handler) {
        handler.setOwner(this);
        this.handlerSet.register(eventName, handler);
        CUORE.Bus.subscribe(this, eventName);
    },

    addExecHandler: function(eventName, handler) {
        this.addHandler(eventName, new CUORE.Handlers.Executor(handler));
    },

    addClass: function(aClass) {
        this.renderer.addClass(aClass);
    },

    removeClass: function(aClass) {
        this.renderer.removeClass(aClass);
    },

    getText: function(key) {
        return this.labels.getText(key);
    },

    getName: function() {
        return this.name;
    },

    setName: function(aName) {
        this.name = aName;
    },

    setContainer: function(container) {
        if (this.doYouHijack()) this.setName(container);
        this.renderer.setContainer(container);
    },

    getManagedEvents: function() {
        return this.handlerSet.getManagedEvents();
    },

    setText: function(aKey, aText) {
        this.labels.setText(aKey, aText);
        this.updateRender();
    },

    setI18NKey: function(key) {
        this.labels.setI18NKey(key);
    },

    setRenderer: function(renderer) {
        this.renderer = renderer;
    },

    isEnabled: function() {
        return this.enabled;
    },

    enable: function() {
        this.enabled = true;
        this.updateRender();
    },

    disable: function() {
        this.enabled = false;
        this.updateRender();
    },

    addDecoration: function(decoration) {
        if (decoration instanceof CUORE.Decoration) {
            this.renderer.addDecoration(decoration);
        }
    },

    onEnvironmentUp: function() {},

    _generateUUID: function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

});