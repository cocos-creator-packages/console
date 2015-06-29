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

    var delay = 100;

    it('should recv ipc "console:log"', function( done ) {
        Tester.FakeCore.send( 'console:log', 'foo bar' );
        setTimeout( function () {
            expect( consoleEL.logs[0] ).to.deep.equal({
                type: 'log',
                text: 'foo bar',
                desc: 'foo bar',
                detail: '',
                count: 0,
            });

            done();
        }, delay);
    });

    it('should recv ipc "console:warn"', function( done ) {
        Tester.FakeCore.send( 'console:warn', 'foo bar' );
        setTimeout(function () {
            expect( consoleEL.logs[0] ).to.deep.equal({
                type: 'warn',
                text: 'foo bar',
                desc: 'foo bar',
                detail: '',
                count: 0,
            });

            done();
        }, delay);
    });

    it('should recv ipc "console:error"', function( done ) {
        Tester.FakeCore.send( 'console:error', 'foo bar' );
        setTimeout(function () {
            expect( consoleEL.logs[0] ).to.deep.equal({
                type: 'error',
                text: 'foo bar',
                desc: 'foo bar',
                detail: '',
                count: 0,
            });

            done();
        }, delay);
    });

    it('should recv logs in order', function( done ) {
        Tester.FakeCore.send( 'console:log', 'foobar 01' );
        Tester.FakeCore.send( 'console:log', 'foobar 02' );
        Tester.FakeCore.send( 'console:error', 'foobar 03 error' );
        Tester.FakeCore.send( 'console:warn', 'foobar 04 warn' );
        Tester.FakeCore.send( 'console:log', 'foobar 05' );

        setTimeout(function () {
            expect( consoleEL.logs[0] ).to.have.property( 'text', 'foobar 01' );
            expect( consoleEL.logs[1] ).to.have.property( 'text', 'foobar 02' );
            expect( consoleEL.logs[2] ).to.have.property( 'text', 'foobar 03 error' );
            expect( consoleEL.logs[3] ).to.have.property( 'text', 'foobar 04 warn' );
            expect( consoleEL.logs[4] ).to.have.property( 'text', 'foobar 05' );

            done();
        }, delay);
    });

    it('should recv ipc "console:clear"', function( done ) {
        Tester.FakeCore.send( 'console:log', 'foobar 01' );
        Tester.FakeCore.send( 'console:log', 'foobar 02' );
        Tester.FakeCore.send( 'console:log', 'foobar 03' );
        Tester.FakeCore.send( 'console:clear' );

        setTimeout(function () {
            expect( consoleEL.logs.length ).to.equal(0);

            done();
        }, delay);
    });
});
