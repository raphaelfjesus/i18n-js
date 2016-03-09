'use strict';

/**
 * Libraries.
 */
var chai = require('chai');
var expect = chai.expect;
var I18n = require('../../index').I18n;

describe('I18n#get()', function() {
  var i18n = new I18n({
    translations: {
      "en-us": require('../locales/en-US.json'),
      "pt-br": require('../locales/pt-BR.json')
    },
    locales: [ 'pt-BR', 'en-US' ] 
  });
  
  it('should return the translated text when present the translation id', function(done) {
    var translatedText = i18n.get('entry.lastname');
    expect(translatedText).to.equal('Lastname');

    done();
  });
  
  it('should return the translated text when present the translation id and option $lang', function(done) {
    var translatedText = i18n.get('entry.lastname', { $lang: 'pt-BR' });
    expect(translatedText).to.equal('Sobrenome');

    done();
  });
  
  it('should return the interpolated text when present the interpolation parameters', function(done) {
    var translatedText = i18n.get('error.length', 1, 255);
    expect(translatedText).to.equal('Length must be between 1 and 255');

    done();
  });
  
  it('if the options is object => { $count: [number] }', function(done) {
    expect(i18n.get('text.selectedRow', { $count: 0 })).to.equal('No selected row');
    expect(i18n.get('text.selectedRow', { $count: 1 })).to.equal('1 selected row');
    expect(i18n.get('text.selectedRow', { $count: 10 })).to.equal('{{count}} selected rows');

    done();
  });

});