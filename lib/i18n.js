'use strict';

class I18n {
  
  constructor(options) {
    this.setOptions(options);
  }
  
  setOptions(options) {
    options = options || {};
    
    this.urlTemplate = options.urlTemplate || '{lang}/{part}.json';
    this.availables = options.availables || [];
    this.fallbacks = options.fallbacks || {};
    this.preferred = options.preferred || 'en-US';
    this.locale = undefined; // Internal use
    this.objectDelimiter = options.objectDelimiter || '.';
    this.translations = options.translations || {};
    this.missingHandler = options.missingHandler || function(translationId, languageKeys) {
      throw new Error('Translation not found.');
    };
    this.parts = new Map();
  }
  
  translate(translationId, options) {
    if(isEmpty(translationId)) { throw new Error('Translation id required.'); }
    if((typeof translationId !== 'string' && !Array.isArray(translationId) && typeof translationId !== 'object') || translationId instanceof Date) { throw new Error('Type not supported for translation id.'); }
    
    if(Array.isArray(translationId)) {
      let results = {};
      
      for (let id of translationId) {
        results[id] = this.translate(id, options);
      }
      
      return results;
    }
    
    if(typeof translationId === 'object') {
      return this.translate(translationId.$id, options);
    }
    
    var possibleLangKeys = [];
    if (options && options.$lang) {
      possibleLangKeys.push(options.$lang);
    }
    
    if (this.locale) {
      possibleLangKeys.push(this.locale);
    }
    
    if (this.preferred) {
      possibleLangKeys.push(this.preferred);
    }
    
    for (let possibleLangKey of possibleLangKeys) {
      let translation = this.getTranslation(translationId, possibleLangKey);
      if (typeof translation !== 'undefined') {
        return translation;
      }
    }
    
    return this.missingHandler(translationId, possibleLangKeys);
  }
  
  // @private
  getTranslation(translationId, languageKey) {
    var langKey = this.fallbacks[languageKey] || languageKey;
    if(Array.isArray(langKey)) {
      for(let key of langKey) {
        let translation = this.getTranslation(translationId, key);
        
        if(translation) {
          return translation;
        }
      }
      
      return translation;
    }
    
    var translations = this.translations[langKey.toLowerCase()];
    var translationIdArray = translationId.split(this.objectDelimiter);
    var translation = translations;
    
    for(let translationId of translationIdArray) { 
      translation = translation[translationId];
      if(!translation) {
        return translation;
      }
    }
    
    return translation;
  }
  
}

function isEmpty(translationId) {
  if(!translationId) {
    return true;
  }
  
  var type = typeof translationId;
  var isEmpty = (type === 'string' && !translationId.trim()) || (Array.isArray(translationId) && translationId.length === 0) || (!(translationId instanceof Date) && type === 'object' && Object.keys(translationId).length === 0);
  return isEmpty;
}

module.exports = I18n;