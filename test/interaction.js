Tester.checkLeaks(false);

describe('<editor-console>', function() {
    var consoleEL;
    beforeEach(function ( done ) {
        Editor.sendToCore('console:clear');
        fixture('panel', function (el) {
            consoleEL = el;
            done();
        });
    });
    after(function () {
        Editor.sendToCore('console:clear');
    });

    var delay = 50;

    it('should recv clear log when press command+k', function( done ) {
        Tester.send( 'console:log', 'foo bar' );
        setTimeout( function () {
            expect( consoleEL.logs[0] ).to.deep.equal({
                type: 'log',
                text: 'foo bar',
                count: 0,
            });

            done();
        }, delay);
    });
});
