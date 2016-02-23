'use strict';

/**
 * Libraries.
 */
var chai = require('chai');
var expect = chai.expect;
var I18n = require('../../index').I18n;
var vsprintf = require('sprintf-js').vsprintf;

describe('I18n#interpolate()', function() {
  var i18n = new I18n({
    interpolator: function(translatedText, interpolationParameters) {
      if((/%/).test(translatedText)) {
        translatedText = vsprintf(translatedText, interpolationParameters);
      }
      
      return translatedText;
    }
  });

  describe('when not present', function() {
    describe('the translated text', function() {
      it('should throw exception if undefined', function(done) {
        var fn = function() { i18n.interpolate(undefined); };
        expect(fn).to.throw(/required/);
  
        done();
      });
      
      it('should throw exception if empty string', function(done) {
        var fn = function() { i18n.interpolate(''); };
        expect(fn).to.throw(/required/);
  
        done();
      });
      
      it('should throw exception if blank string', function(done) {
        var fn = function() { i18n.interpolate(' '); };
        expect(fn).to.throw(/required/);
  
        done();
      });
    });
    
    describe('the interpolation parameters', function() {
      it('should throw exception if undefined', function(done) {
        var fn = function() { i18n.interpolate('Hi, {{name}}'); };
        expect(fn).to.throw(/required/);
  
        done();
      });
    });
  });
  
  describe('when present', function() {
    describe('the translated text', function() {
      it('should throw exception if translated text is not string', function(done) {
        var fn = function() { i18n.interpolate(1); };
        expect(fn).to.throw(/not supported/);
        
        var fn2 = function() { i18n.interpolate({ id: 'text' }); };
        expect(fn2).to.throw(/not supported/);
        
        var fn3 = function() { i18n.interpolate(Date.now()); };
        expect(fn3).to.throw(/not supported/);
        
        var fn4 = function() { i18n.interpolate(true); };
        expect(fn4).to.throw(/not supported/);
  
        done();
      });
    });
    
    describe('the interpolation parameters', function() {
      describe('should return the interpolated text for the default interpolator', function() {
        it('if the interpolation parameter is number', function(done) {
          expect(i18n.interpolate('Length must be at least {}', 1)).to.equal('Length must be at least 1');
          expect(i18n.interpolate('Length must be no more than {}', 255)).to.equal('Length must be no more than 255');
    
          done();
        });
        
        it('if the interpolation parameter is string', function(done) {
          expect(i18n.interpolate('You are logged in as {}.', 'administrator')).to.equal('You are logged in as administrator.');
          expect(i18n.interpolate('Welcome, {}!', 'Raphael')).to.equal('Welcome, Raphael!');
    
          done();
        });
        
        it('if the interpolation parameter is object', function(done) {
          expect(i18n.interpolate('Percentage must be no more than {{max}}', { max: 50 })).to.equal('Percentage must be no more than 50');
          expect(i18n.interpolate('Must be between {{min}} and {{max}}', { min: 1, max: 999 })).to.equal('Must be between 1 and 999');
          expect(i18n.interpolate('My name is {{firstname}}.', { firstname: 'Raphael' })).to.equal('My name is Raphael.');
          expect(i18n.interpolate('My full name is {{firstname}} {{lastname}}.', { firstname: 'Raphael', lastname: 'Freitas' })).to.equal('My full name is Raphael Freitas.');
          expect(i18n.interpolate("My daughter's name is {{name}} and has only {{age}} years old.", { name: 'Isabelle', age: 3 })).to.equal("My daughter's name is Isabelle and has only 3 years old.");
    
          done();
        });
        
        it('if the interpolation parameter is array', function(done) {
          expect(i18n.interpolate('Length must be between {} and {}', 1, 255)).to.equal('Length must be between 1 and 255');
          expect(i18n.interpolate('My name is {} and I am married to {} lady.', 'Raphael', 'Elizabeth')).to.equal('My name is Raphael and I am married to Elizabeth lady.');
          expect(i18n.interpolate('My name is {} and I have {} children.', 'Raphael', 2)).to.equal('My name is Raphael and I have 2 children.');
          
          done();
        });
      });
      
      describe('should return the interpolated text for the custom interpolator (e.g. vsprintf)', function() {
        it('if the interpolation parameter is single value', function(done) {
          expect(i18n.interpolate('%+010d', -123)).to.equal('-000000123');
          
          done();
        });
        
        it('if the interpolation parameter is multiple values', function(done) {
          expect(i18n.interpolate('The first 4 letters of the english alphabet are: %s, %s, %s and %s', 'a', 'b', 'c', 'd')).to.equal('The first 4 letters of the english alphabet are: a, b, c and d');
          expect(i18n.interpolate('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants')).to.equal('Polly wants a cracker');
          
          done();
        });
      });
    });
  });
  
});