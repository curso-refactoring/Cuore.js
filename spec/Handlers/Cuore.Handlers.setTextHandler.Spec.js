describe("setTextHandler", function () {

    it("inherits  Handler", function () {
        var aSetTextHandler = new CUORE.Handlers.SetText();
        expect(aSetTextHandler instanceof CUORE.Handler).toBeTruthy();
        expect(aSetTextHandler instanceof CUORE.Handlers.SetText).toBeTruthy();
    });

    it("sets the text of the owner reading as json object when dispatched", function () {
        var aSetTextHandler = new CUORE.Handlers.SetText();
        var aButton = {};
        aButton.setText = jasmine.createSpy('setText');
        aSetTextHandler.setOwner(aButton);

        var theMessage = new CUORE.Message();
        theMessage.putOnAnswer('text','testText');
        theMessage.putOnQuery('key','theKey');
        
        aSetTextHandler.handle(theMessage);
        expect(aButton.setText).toHaveBeenCalledWith('theKey', 'testText');
    });
    
    it("prevents setting the text if the message is not valid", function () {
        var aSetTextHandler = new CUORE.Handlers.SetText();
        var aButton = {};
        aButton.setText = jasmine.createSpy('setText');
        aSetTextHandler.setOwner(aButton);

        var emptyMessage = new CUORE.Message();

        aSetTextHandler.handle(emptyMessage);

        expect(aButton.setText).not.toHaveBeenCalled();
    }); 
});