'use strict';

describe('Interaction', function() {
  Helper.runPanel( 'console.panel' );

  it('should recv clear log when press command+k', function() {
    let targetEL = Helper.targetEL;

    Helper.recv('console:log', 'foo bar');
    Helper.recv('console:log', 'foo bar 02');
    Helper.recv('console:log', 'foo bar 03');
    Helper.recv('console:log', 'foo bar 04');

    Helper.keydown( targetEL, 'k', ['command'] );
    expect( targetEL.logs.length ).to.equal(0);
  });
});
