describe("A HandlerSet", function() {

    var aHandlerSet;
    beforeEach(function() {
        aHandlerSet = new CUORE.HandlerSet();
    });

    it("doesn't crash when no handler for an event", function() {
        expect(function() {
            aHandlerSet.notifyHandlers("notHandledEvent", null);
        }).not.toThrow();
    });

    describe("with a handler registered", function() {
        var aHandler, eventName = "an event name";
        beforeEach(function() {
            aHandler = CUORE.Mocks.Handler();
            aHandlerSet.register(eventName, aHandler);
        });

        it("its managed events will contain the eventName of the handler", function() {
            expect(aHandlerSet.getManagedEvents()).toContain(eventName);
        });

        it("its managed events won't contain duplicates", function() {
            aHandlerSet.register(eventName, CUORE.Mocks.Handler());
            aHandlerSet.register(eventName, CUORE.Mocks.Handler());
            aHandlerSet.register(eventName, CUORE.Mocks.Handler());

            expect(aHandlerSet.getManagedEvents()).toEqual([eventName]);
        });

        it("when an event is notified, all the registered handlers for this event are called", function() {
            var anEventData = "some data for the event";
            var otherHandler = CUORE.Mocks.Handler('other handler');
            aHandlerSet.register(eventName, otherHandler);

            aHandlerSet.notifyHandlers(eventName, anEventData);

            expect(aHandler.handle).toHaveBeenCalledWith(anEventData);
            expect(otherHandler.handle).toHaveBeenCalledWith(anEventData);
        });

        it("when an event is notified, handlers not registered for this event won't be called", function() {
            aHandlerSet.notifyHandlers('other event', 'some data');

            expect(aHandler.handle).not.toHaveBeenCalledWith();
        });
    });

});