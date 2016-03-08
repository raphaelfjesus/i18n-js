'use strict';

class I18n {
  
  constructor(options) {
    this.setOptions(options);
    
    this.alias(this.aliases);
  }
  
  setOptions(options) {
    options = options || {};
    
    this.urlTemplate = options.urlTemplate || 'locales/{lang}/{part}.json';
    this.locales = options.locales || [];
    this.fallbacks = options.fallbacks || {};
    this.preferred = options.preferred || 'en-US';
    this.objectDelimiter = options.objectDelimiter || '.';
    this.translations = options.translations || {};
    this.missingHandler = options.missingHandler || function(translationId, languageKeys) {
      throw new Error('Translation not found.');
    };
    this.interpolator = options.interpolator;
    this.load = options.load;
    this.parts = new Map();
    this.locale = undefined;
    this.aliases = options.aliases || { error: 'error', warn: 'warn', success: 'success', info: 'info' };
  }
  
  get(translationId) {
    var options = {};
    var interpolationParameters = [];
    
    if(arguments && arguments.length > 1) {
      interpolationParameters = Array.prototype.slice.call(arguments, 1);

      let opts = interpolationParameters[interpolationParameters.length - 1];
      if(typeof opts === 'object' && opts.hasOwnProperty('$lang')) {
        options = opts;
        interpolationParameters.pop();
      }
    }

    var translatedText = this.translate(translationId, options);
  
    if(interpolationParameters.length > 0) {
      translatedText = this.interpolate(translatedText, interpolationParameters);
    }
    
    return translatedText;
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
    
    possibleLangKeys.push(this.preferred);
    
    for (let possibleLangKey of possibleLangKeys) {
      let translation = this.getTranslation(translationId, possibleLangKey);
      if (typeof translation !== 'undefined') {
        return translation;
      }
    }
    
    return this.missingHandler(translationId, possibleLangKeys);
  }
  
  interpolate(translatedText, interpolationParameters) {
    if(!translatedText) { throw new Error('Translated text required.'); }
    if(typeof translatedText !== 'string') { throw new Error('Type not supported for translated text.'); }
    if(!interpolationParameters) { throw new Error('Interpolation parameters required.'); }
    
    if(arguments.length > 2) {
      interpolationParameters = Array.prototype.slice.call(arguments, 1);
    }
    
    var interpolatedText = this.getInterpolation(translatedText, interpolationParameters, /{}/);
    if(this.interpolator) {
      interpolatedText = this.interpolator(interpolatedText, Array.isArray(interpolationParameters) ? interpolationParameters : [ interpolationParameters ]);
    }
    
    return interpolatedText;
  }
  
  alias(aliases) {
    if(isEmpty(aliases)) { throw new Error('Alias required.'); }
    if((typeof aliases !== 'string' && typeof aliases !== 'object') || aliases instanceof Date) { throw new Error('Type not supported for alias.'); }
    
    var self = this;
    
    if(typeof aliases === 'string') {
      let obj = {};
      obj[aliases] = aliases;
      aliases = obj;
    }
    
    Object.keys(aliases).forEach(function (key) {
      self[key] = function(translationId) {
        let interpolationParameters = arguments && arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
        return self.get(aliases[key] + '.' + translationId, interpolationParameters);
      };
    });
  }
  
  setLocale(locale) {
    if(!locale) { throw new Error('Locale required.'); }
    if(typeof locale !== 'string' && !Array.isArray(locale)) { throw new Error('Type not supported for locale.'); }

    var exists = (locale) => {
      for(let l of this.locales) {
        if (l.toLowerCase() === locale.toLowerCase()) {
          return true;
        }
      }
      
      return false;
    };
    
    var locales = typeof locale === 'string' ? [ locale ] : locale;
    for(let l of locales) {
      if(exists(l)) {
        this.locale = l;
        return;
      }
    }

    throw new Error('Locale not available.');
    //this.locale = this.preferred;    
  }
  
  addPart(name, priority) {
    if (!this.parts.has(name)) {
      this.parts.set(name, new Part(name, priority));
  
    } else if (!this.parts.get(name).active) {
      this.parts.get(name).active = true;
    }
  }
  
  // @private
  getInterpolation(text, value, regex) {
    if(Array.isArray(value)) {
      for (let val of value) {
        text = this.getInterpolation(text, val, regex);
      }
    }
    
    if('object' === typeof value) {
      for(let property in value) {
        text = this.getInterpolation(text, value[property], new RegExp('{{'+property+'}}', 'g'));
      }
    }
    
    if (regex.test(text)) {
      text = text.replace(regex, value);
    }
    
    return text;
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

    var translations = this.loadTranslations(langKey);
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
  
  // @private
  loadTranslations(locale) {
    if(this.translations[locale.toLowerCase()]) return this.translations[locale.toLowerCase()];
    
    this.translations[locale.toLowerCase()] = {};
    
    if(!(/\{part\}/g).test(this.urlTemplate)) {
      let url = this.urlTemplate.replace(/\{lang\}/g, locale);
      return extend(this.translations[locale.toLowerCase()], this.load(url));
    }
    
    var getPrioritizedParts = (parts) => {
      let prioritizedParts = [];
        
      parts.forEach(function(part) {
        if (part.active) {
          prioritizedParts.push(part);
        }
      });

      prioritizedParts.sort(function (a, b) {
        return a.priority - b.priority;
      });
      
      return prioritizedParts;
    };
    
    var prioritizedParts = getPrioritizedParts(this.parts);
    for(let prioritizedPart of prioritizedParts) {
      let url = this.urlTemplate.replace(/\{part\}/g, prioritizedPart.name).replace(/\{lang\}/g, locale);
      extend(this.translations[locale.toLowerCase()], this.load(url));
    }
    
    return this.translations[locale.toLowerCase()];
  }
  
}

class Part {
  
  constructor(name, priority, active, translations) {
    this.name = name;
    this.priority = priority || 0;
    this.active = active || true;
    this.translations = translations || {};
  }

}

function extend(target, source) {
  var src, val;
  
  Object.keys(source).forEach(function (key) {
		src = target[key];
		val = source[key];

		if (typeof val !== 'object'/* || val === null*/) {
			target[key] = val;
			return;

		} else if (typeof src !== 'object'/* || src === null*/) {
			target[key] = extend({}, val);
			return;

		} else {
			target[key] = extend(src, val);
			return;
		}
	});
	
	return target;
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