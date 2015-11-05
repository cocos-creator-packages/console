'use strict';

describe('Basic', function() {
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
    done();
  });

  let delay = 100;

  it('should recv ipc "console:log"', function( done ) {
    consoleEL['console:log']('foo bar');
    setTimeout(() => {
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
    consoleEL['console:warn']('foo bar');
    setTimeout(() => {
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
    consoleEL['console:error']('foo bar');
    setTimeout(() => {
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
    consoleEL['console:log']('foobar 01');
    consoleEL['console:log']('foobar 02');
    consoleEL['console:error']('foobar 03 error');
    consoleEL['console:warn']('foobar 04 warn');
    consoleEL['console:log']('foobar 05');

    setTimeout(() => {
      expect( consoleEL.logs[0] ).to.have.property( 'text', 'foobar 01' );
      expect( consoleEL.logs[1] ).to.have.property( 'text', 'foobar 02' );
      expect( consoleEL.logs[2] ).to.have.property( 'text', 'foobar 03 error' );
      expect( consoleEL.logs[3] ).to.have.property( 'text', 'foobar 04 warn' );
      expect( consoleEL.logs[4] ).to.have.property( 'text', 'foobar 05' );

      done();
    }, delay);
  });

  it('should recv ipc "console:clear"', function( done ) {
    consoleEL['console:log']('foobar 01');
    consoleEL['console:log']('foobar 02');
    consoleEL['console:log']('foobar 03');
    consoleEL['console:clear']();

    setTimeout(() => {
      expect( consoleEL.logs.length ).to.equal(0);

      done();
    }, delay);
  });
});
