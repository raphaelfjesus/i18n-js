'use strict';

/**
 * Libraries.
 */
var chai = require('chai');
var expect = chai.expect;
var i18n = require('../../index');

describe('I18n', function() {
  
  it('should return an instance of the class I18n', function(done) {
    expect(new i18n.I18n()).to.exists;
    expect(i18n()).to.exists;

    done();
  });
  
  it('should return an copy in deep of the object', function(done) {
    let instance = new i18n.I18n({
      locales: [ 'pt-BR', 'en-US' ]
    });
    
    instance.setLocale('pt-BR');
    expect(instance.locale).to.equal('pt-BR');
    
    done();
  });
  
});