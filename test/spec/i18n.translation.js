'use strict';

/**
 * Libraries.
 */
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var I18n = require('../../index').I18n;

describe('I18n#translate()', function() {
  var i18n = new I18n({
    translations: {
      "en-us": require('../locales/en-US.json'),
      "pt-br": require('../locales/pt-BR.json')/*,
      "es-es": require('../locales/es-ES.json') */
    },
    fallbacks: {
      'ca': 'es-ES', // use Spanish translations if Catalan translations are missing
      'en': [ 'en-US', 'pt-BR' ]
    },
    urlTemplate: path.resolve('./test/locales/{locale}.json'),
    load: function(url) {
      return require(url);
    }
  });

  describe('when not present the translation id', function() {
    it('should throw exception if undefined', function(done) {
      var fn = function() { i18n.translate(undefined); };
      expect(fn).to.throw(/required/);

      done();
    });
    
    it('should throw exception if empty string', function(done) {
      var fn = function() { i18n.translate(''); };
      expect(fn).to.throw(/required/);

      done();
    });
    
    it('should throw exception if blank string', function(done) {
      var fn = function() { i18n.translate(' '); };
      expect(fn).to.throw(/required/);

      done();
    });
    
    it('should throw exception if empty array', function(done) {
      var fn = function() { i18n.translate([]); };
      expect(fn).to.throw(/required/);

      done();
    });
    
    it('should throw exception if empty object', function(done) {
      var fn = function() { i18n.translate({}); };
      expect(fn).to.throw(/required/);

      done();
    });
  });
  
  describe('when present the translation id', function() {
    describe('but type is not supported', function() {
      it('should throw exception if numeric type', function(done) {
        var fn = function() { i18n.translate(1); };
        expect(fn).to.throw(/not supported/);
  
        done();
      });
      
      it('should throw exception if date type', function(done) {
        var fn = function() { i18n.translate(new Date()); };
        expect(fn).to.throw(/not supported/);
  
        done();
      });
      
      it('should throw exception if boolean type', function(done) {
        var fn = function() { i18n.translate(true); };
        expect(fn).to.throw(/not supported/);
  
        done();
      });
    });
    
    describe('or translation not found', function() {
      it('should throw exception if is string', function(done) {
        var fn = function() { i18n.translate('not.found'); };
        var fn2 = function() { i18n.translate('not.found', { $lang: 'pt-BR' }); };
        expect(fn).to.throw(/not found/);
        expect(fn2).to.throw(/not found/);
  
        done();
      });
      
      it('should throw exception if is object', function(done) {
        var fn = function() { i18n.translate({ $id: 'not.found' }); };
        var fn2 = function() { i18n.translate({ $id: 'not.found' }, { $lang: 'pt-BR' }); };
        expect(fn).to.throw(/not found/);
        expect(fn2).to.throw(/not found/);
  
        done();
      });
      
      it('should throw exception if is array', function(done) {
        var fn = function() { i18n.translate([ 'not.found', 'not.exists' ]); };
        var fn2 = function() { i18n.translate([ 'not.found', 'not.exists' ], { $lang: 'pt-BR' }); };
        expect(fn).to.throw(/not found/);
        expect(fn2).to.throw(/not found/);
  
        done();
      });
      
      it('should throw exception if is array (fallback)', function(done) {
        var fn = function() { i18n.translate('not.found', { $lang: 'en' }); };
        expect(fn).to.throw(/not found/);
        
        done();
      });
    });
    
    describe('otherwise', function() {

      describe('should return the translated text for the default language', function() {
        it('if the translation id is string', function(done) {
          var translatedText = i18n.translate('entry.firstname');
          expect(translatedText).to.equal('Firstname');
    
          done();
        });
        
        it('if the translation id is object', function(done) {
          var translatedText = i18n.translate({ $id: 'entry.firstname' });
          expect(translatedText).to.equal('Firstname');
    
          done();
        });
        
        it('if the translation id is array', function(done) {
          var translatedText = i18n.translate([ 'entry.firstname', 'entry.lastname' ]);
          expect(translatedText).to.exist;
          expect(translatedText['entry.firstname']).to.equal('Firstname');
          expect(translatedText['entry.lastname']).to.equal('Lastname');
    
          done();
        });
      });
    
      describe('should return the translated text for the selected language', function() {
        it('if the translation id is string', function(done) {
          var translatedText = i18n.translate('entry.firstname', { $lang: 'pt-BR' });
          expect(translatedText).to.equal('Nome');
          
          var i18n2 = new I18n({
            locales: [ 'pt-BR', 'es-ES' ],
            translations: {
              "en-us": require('../locales/en-US.json'),
              "pt-br": require('../locales/pt-BR.json'),
              "es-es": require('../locales/es-ES.json') 
            }
          });
  
          i18n2.setLocale('es-ES');
          translatedText = i18n2.translate('entry.firstname');
          expect(translatedText).to.equal('Nombre');
    
          done();
        });
        
        it('if the translation id is object', function(done) {
          var translatedText = i18n.translate({ $id: 'entry.lastname' }, { $lang: 'pt-BR' });
          expect(translatedText).to.equal('Sobrenome');
    
          done();
        });
        
        it('if the translation id is array', function(done) {
          var translatedText = i18n.translate([ 'entry.firstname', 'entry.lastname' ], { $lang: 'pt-BR' });
          expect(translatedText).to.exist;
          expect(translatedText['entry.firstname']).to.equal('Nome');
          expect(translatedText['entry.lastname']).to.equal('Sobrenome');
    
          done();
        });
      });
      
      describe('should return the translated text using the language set as fallbacks', function() {
        it('if fallback is only one language (1 : 1)', function(done) {
          expect(i18n.translate('entry.firstname', { $lang: 'ca' })).to.equal('Nombre');
          
          done();
        });
        
        it('if fallback for multiple languages (1 : N)', function(done) {
          expect(i18n.translate('entry.firstname', { $lang: 'en' })).to.equal('Firstname');
    
          done();
        });
      });
    });
  });
  
});