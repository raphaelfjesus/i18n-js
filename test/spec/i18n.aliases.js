'use strict';

/**
 * Libraries.
 */
var chai = require('chai');
var expect = chai.expect;
var I18n = require('../../index').I18n;

describe('I18n#alias()', function() {
  var i18n = new I18n({
    translations: {
      "en-us": require('../locales/en-US.json'),
      "pt-br": require('../locales/pt-BR.json'),
      "es-es": require('../locales/es-ES.json') 
    }
  });
  
  describe('when not present', function() {
    it('should throw exception', function(done) {
      var fn = function() { i18n.alias(); };
      expect(fn).to.throw(/required/);
      
      var fn2 = function() { i18n.alias(''); };
      expect(fn2).to.throw(/required/);
      
      var fn3 = function() { i18n.alias([]); };
      expect(fn3).to.throw(/required/);

      done();
    });
  });
  
  describe('when present', function() {
    it('should throw exception if alias is not object or string', function(done) {
      var fn = function() { i18n.alias(1); };
      expect(fn).to.throw(/not supported/);

      var fn2 = function() { i18n.alias(Date.now()); };
      expect(fn2).to.throw(/not supported/);
      
      var fn3 = function() { i18n.alias(true); };
      expect(fn3).to.throw(/not supported/);

      done();
    });
    
    describe('should apply the alias successfully', function() {
      it('for default aliases (error, warn, success, info)', function(done) {
        expect(i18n.error('required')).to.equal('This field is required');
        expect(i18n.error('length', 1, 255)).to.equal('Length must be between 1 and 255');
        
        expect(i18n.warn('timeout')).to.equal('Timeout');
        expect(i18n.success('save')).to.equal('Successfully saved');
        expect(i18n.info('changelog')).to.equal('Changelog');
  
        done();
      });
      
      it('for custom aliases', function(done) {
        i18n.alias({ entry: 'entry' });
        expect(i18n.entry('firstname')).to.equal('Firstname');
        
        i18n.alias('text');
        expect(i18n.text('welcome', 'Raphael')).to.equal('Welcome, Raphael!');
  
        done();
      });
    });
  });

});