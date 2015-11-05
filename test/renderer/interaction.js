'use strict';

describe('Interaction', function() {
  let consoleEL;

  beforeEach(function ( done ) {
    Helper.createFrom('packages://console/test/fixtures/panel.html', el => {
      consoleEL = el;
      document.body.appendChild(consoleEL);
      done();
    });
  });

  afterEach(function ( done ) {
    consoleEL.remove();
    Editor.sendToCore('console:clear');

    done();
  });

  let delay = 50;

  it('should recv clear log when press command+k', function( done ) {
    consoleEL['console:log']('foo bar');
    consoleEL['console:log']('foo bar 02');
    consoleEL['console:log']('foo bar 03');
    consoleEL['console:log']('foo bar 04');

    setTimeout(() => {
      consoleEL.clear();
      expect( consoleEL.logs.length ).to.equal(0);

      done();
    }, delay);
  });
});
