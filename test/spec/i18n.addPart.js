'use strict';

/**
 * Libraries.
 */
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var I18n = require('../../index').I18n;

describe('I18n#addPart()', function() {
  var i18n = new I18n({
    urlTemplate: path.resolve('./test/locales/{lang}/{part}.json'),
    load: function(url) {
      console.log(url);
      return require(url);
    }
  });
  
  i18n.addPart('dashboard');
  
  it('should load part added successfully', function(done) {
    var translatedText = i18n.get('heading', { $lang: 'pt-BR' });
    expect(translatedText).to.equal('Painel de Instrumentos');

    done();
  });

});