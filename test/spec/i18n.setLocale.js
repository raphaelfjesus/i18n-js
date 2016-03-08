'use strict';

/**
 * Libraries.
 */
var chai = require('chai');
var expect = chai.expect;
var I18n = require('../../index').I18n;

describe('I18n#setLocale()', function() {
  var i18n = new I18n({
    locales: [ 'pt-BR', 'en-US' ] 
  });
  
  describe('when not present the locale', function() {
    it('should throw exception if undefined', function(done) {
      var fn = function() { i18n.setLocale(undefined); };
      expect(fn).to.throw(/required/);

      done();
    });
  });
  
  describe('when present the locale', function() {
    describe('but type is not supported', function() {
      it('should throw exception if different type of array or string', function(done) {
        var fn = function() { i18n.setLocale(1); };
        expect(fn).to.throw(/not supported/);
        
        var fn2 = function() { i18n.setLocale({}); };
        expect(fn2).to.throw(/not supported/);
  
        done();
      });
    });
    
    describe('or locale not available', function() {
      it('should throw exception if string', function(done) {
        var fn = function() { i18n.setLocale('not found'); };
        expect(fn).to.throw(/not available/);
  
        done();
      });
      
      it('should throw exception if array', function(done) {
        var fn = function() { i18n.setLocale([ 'not found' ]); };
        expect(fn).to.throw(/not available/);
  
        done();
      });
    });
    
    describe('otherwise', function() {
      describe('should update the locale', function() {
        it('if the locale is string', function(done) {
          i18n.setLocale('pt-BR');
          expect(i18n.locale).to.equal('pt-BR');
    
          done();
        });
        
        it('if the locale is array', function(done) {
          i18n.setLocale([ 'not-found', 'pt-BR' ] );
          expect(i18n.locale).to.equal('pt-BR');
    
          done();
        });
      });
    });
  });
  
});