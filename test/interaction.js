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
        Tester.FakeCore.send( 'console:log', 'foo bar' );
        Tester.FakeCore.send( 'console:log', 'foo bar 02' );
        Tester.FakeCore.send( 'console:log', 'foo bar 03' );
        Tester.FakeCore.send( 'console:log', 'foo bar 04' );
        setTimeout( function () {
            Tester.keydown( consoleEL, 'k', 'command' );
            expect( consoleEL.logs.length ).to.equal(0);

            done();
        }, delay);
    });
});
