'use strict';

/**
 * Libraries.
 */
var chai = require('chai');
var expect = chai.expect;
var I18n = require('../../index').I18n;

describe('I18n#translate()', function() {
  var i18n = new I18n({
    translations: {
      "en-us": {
        "entry": {
          "customer": "Customer",
          "firstname": "Firstname",
          "lastname": "Lastname" 
        },
        "text": {
          "selectedRow": "{COUNT, plural, zero{No selected row} one{1 selected row} other{# selected rows}}",
          "like": "{GENDER, select, male{He} female{She} other{They}} like this.",
          "welcome": "Welcome, {}!",
          "alphabet": "The first 4 letters of the english alphabet are: %s, %s, %s and %s",
          "presentation": "My name is {} and I have {} children."
        },
        "error": {
          "required": "This field is required",
          "length": "Length must be between {} and {}",
          "range": "Must be between {{min}} and {{max}}"
        },
        "warn": {
          "timeout": "Timeout"
        },
        "success": {
          "save": "Successfully saved"
        },
        "info": {
          "changelog": "Changelog"
        }
      },
      "pt-br": {
        "entry": {
          "customer": "Cliente",
          "firstname": "Nome",
          "lastname": "Sobrenome" 
        },
        "text": {
          "selectedRow": "{COUNT, plural, zero{Nenhuma linha selecionada} one{1 linha selecionada} other{# linhas selecionadas}}",
          "like": "{GENDER, select, male{Ele gosta} female{Ela gosta} other{Eles gostam}} disso.",
          "welcome": "Seja bem-vindo, {}!",
          "alphabet": "As primeiras 4 letras do alfabeto Inglês são: %s, %s, %s e %s",
          "presentation": "Meu nome é {} e tenho {} filhos."
        },
        "error": {
          "required": "Este campo é obrigatório",
          "length": "O tamanho para este campo deve estar entre {} e {}",
          "range": "O valor para este campo deve estar entre {{min}} e {{max}}"
        },
        "warn": {
          "timeout": "Tempo expirado"
        },
        "success": {
          "save": "Salvo com sucesso"
        },
        "info": {
          "changelog": "Log de alterações"
        }
      },
      "es-es": {
        "entry": {
          "customer": "Cliente",
          "firstname": "Nombre",
          "lastname": "Apellido" 
        },
        "text": {
          "selectedRow": "{COUNT, plural, zero{No hay filas seleccionadas} one{1 fila seleccionada} other{# líneas seleccionadas}}",
          "like": "{GENDER, select, male{Que le gusta} female{Que le gusta} other{Que les gusta}} lo.",
          "welcome": "Bienvenido, {{}}!" 
        },
        "error": {
          "required": "Este campo es obligatorio",
          "length": "El tamaño de este campo debe estar entre {} y {}",
          "range": "El valor de este campo debe estar entre {{min}} y {{max}}"
        },
        "warn": {
          "timeout": "Tiempo transcurrido"
        },
        "success": {
          "save": "Se ha guardado correctamente"
        },
        "info": {
          "changelog": "Cambio de registro"
        }
      }
    },
    fallbacks: {
      'ca': 'es-ES', // use Spanish translations if Catalan translations are missing
      'en': [ 'en-US', 'en-GB' ]
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