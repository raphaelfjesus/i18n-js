'use strict';

/**
 * Libraries.
 */
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var MessageFormat = require('messageformat');
var I18n = require('../../index').I18n;

describe('I18n#pluralize()', function() {
  var i18n = new I18n({
    urlTemplate: path.resolve('./test/locales/{lang}.json'),
    load: function(url) {
      return require(url);
    }
  });
  
  describe('when not present', function() {
    describe('the translated text', function() {
      it('should throw exception if undefined', function(done) {
        var fn = function() { i18n.pluralize(undefined); };
        expect(fn).to.throw(/required/);
  
        done();
      });
      
      it('should throw exception if empty string', function(done) {
        var fn = function() { i18n.pluralize(''); };
        expect(fn).to.throw(/required/);
  
        done();
      });
      
      it('should throw exception if blank string', function(done) {
        var fn = function() { i18n.pluralize(' '); };
        expect(fn).to.throw(/required/);
  
        done();
      });
    });
    
    describe('the options', function() {
      let translatedText = i18n.translate('text.selectedRow');
      
      it('should throw exception if undefined', function(done) {
        var fn = function() { i18n.pluralize(translatedText); };
        expect(fn).to.throw(/required/);
      
        done();
      });
      
      it('should throw exception if empty string', function(done) {
        var fn = function() { i18n.pluralize(translatedText, ''); };
        expect(fn).to.throw(/required/);
  
        done();
      });
    });
    
    describe('the pluralization rule for selected language', function() {
      let translatedText = i18n.translate('text.selectedRow');
      
      it('should throw exception', function(done) {
        var fn = function() { i18n.pluralize(translatedText, { $count: 1, $lang: 'es-ES' }); };
        expect(fn).to.throw(/not found/);
      
        done();
      });
    });
  });
  
  describe('when present', function() {
    describe('the translated text', function() {
      it('should throw exception if translated text is not object', function(done) {
        var fn = function() { i18n.pluralize(1); };
        expect(fn).to.throw(/not supported/);
        
        var fn2 = function() { i18n.pluralize('not object'); };
        expect(fn2).to.throw(/not supported/);
        
        var fn3 = function() { i18n.pluralize(Date.now()); };
        expect(fn3).to.throw(/not supported/);
        
        var fn4 = function() { i18n.pluralize(true); };
        expect(fn4).to.throw(/not supported/);
  
        done();
      });
    });
    
    describe('the options', function() {
      let translatedText =i18n.translate('text.selectedRow');
        
      it('should throw exception if options is not number or object', function(done) {
        var fn = function() { i18n.pluralize(translatedText, 'not number and object'); };
        expect(fn).to.throw(/not supported/);
        
        var fn2 = function() { i18n.pluralize(translatedText, true); };
        expect(fn2).to.throw(/not supported/);
  
        done();
      });
      
      describe('should return the pluralized text for the default pluralizator', function() {
        it('if the options is number => [count]', function(done) {
          expect(i18n.pluralize(translatedText, 0)).to.equal('No selected row');
          expect(i18n.pluralize(translatedText, 1)).to.equal('1 selected row');
          expect(i18n.pluralize(translatedText, 10)).to.equal('{{count}} selected rows');
    
          done();
        });
        
        it('if the options is object => { $count: [number] }', function(done) {
          expect(i18n.pluralize(translatedText, { $count: 0 })).to.equal('No selected row');
          expect(i18n.pluralize(translatedText, { $count: 1 })).to.equal('1 selected row');
          expect(i18n.pluralize(translatedText, { $count: 10 })).to.equal('{{count}} selected rows');
    
          done();
        });
      });
      
      describe('custom pluralizator (e.g. message-format)', function() {
        let i18n = new I18n({
            urlTemplate: path.resolve('./test/locales/{lang}.json'),
            load: function(url) {
              return require(url);
            },
            pluralizer: function(language, translatedText, interplateParams) {
              var format = new MessageFormat(language).compile(translatedText);
              return format(interplateParams);
            }
          });
          
        it('should throw exception if the translated text is not string', function(done) {
          let translatedText = i18n.translate('text.selectedRow');
          
          let fn2 = function() { i18n.pluralize(translatedText, { GENDER: 'male', RES: 1, CAT: 2 }); };
          expect(fn2).to.throw(/not supported/);
          
          done();
        });
        
        it('should return the pluralized text if locale has only 2 letters', function(done) {
          var translatedText = '{GENDER, select, male{He} female{She} other{They} } found {RES, plural, =0{no results} one{1 result} other{# results} } in the {CAT, selectordinal, one{#st} two{#nd} few{#rd} other{#th} } category.';
          
          expect(i18n.pluralize(translatedText, { GENDER: 'male', RES: 1, CAT: 2, $lang: 'en' })).to.equal('He found 1 result in the 2nd category.');
          
          done();
        });
        
        it('should return the pluralized text', function(done) {
          var translatedText = '{GENDER, select, male{He} female{She} other{They} } found {RES, plural, =0{no results} one{1 result} other{# results} } in the {CAT, selectordinal, one{#st} two{#nd} few{#rd} other{#th} } category.';
          
          expect(i18n.pluralize(translatedText, { GENDER: 'male', RES: 1, CAT: 2 })).to.equal('He found 1 result in the 2nd category.');
          expect(i18n.pluralize(translatedText, { GENDER: 'female', RES: 1, CAT: 2 })).to.equal('She found 1 result in the 2nd category.');
          expect(i18n.pluralize(translatedText, { GENDER: 'male', RES: 2, CAT: 1 })).to.equal('He found 2 results in the 1st category.');
          expect(i18n.pluralize(translatedText, { RES: 2, CAT: 2 })).to.equal('They found 2 results in the 2nd category.');
          
          done();
        });
      });
    });
  });
  
});