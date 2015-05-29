Tester.checkLeaks(false);

describe('<editor-console>', function() {
    before(function ( done ) {
        Editor.Panel.load( 'console.panel', function ( err, frameEL ) {
            document.body.appendChild(frameEL);
            done();
        });
    });

    it('should recv ipc "console:log"', function() {
        Tester.send( 'console:log', 'foo bar' );
    });

    it('should recv ipc "console:error"', function() {
        Tester.send( 'console:error', 'foo bar' );
    });
});
