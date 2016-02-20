# i18n-js

[![Build Status](https://travis-ci.org/raphaelfjesus/i18n-js.svg?branch=master)](http://travis-ci.org/raphaelfjesus/i18n-js)
[![Code Climate](https://codeclimate.com/github/raphaelfjesus/i18n-js/badges/gpa.svg)](https://codeclimate.com/github/raphaelfjesus/i18n-js)
[![Test Coverage](https://codeclimate.com/github/raphaelfjesus/i18n-js/badges/coverage.svg)](https://codeclimate.com/github/raphaelfjesus/i18n-js/coverage)

Está precisando de uma biblioteca javascript simples e objetiva para manipular traduções, independente de framework web ([AngularJS](https://angularjs.org/), [React](https://facebook.github.io/react/), [Backbone.js](http://backbonejs.org/), [Ember.js](http://emberjs.com/), entre outros) ou [Node.JS](https://nodejs.org)? Se sua resposta é sim, então continue lendo este documento e veja os recursos disponíveis por esta biblioteca.

## Features

 - Translation
 - Interpolation
 - Pluralization
 - Gender
 - Aliases

## Installation

### Server-side

In an environment with [Node.js](https://nodejs.org), install with [NPM](https://www.npmjs.com):

```bash
$ npm install i18n-js
```

### Client-side

On your page, install with [Bower](http://bower.io/):

```bash
$ bower install i18n-js
```

## Usage

Before you start using the functionality provided by the library, first import it into your project:

Server-side

```javascript
var i18n = require('i18n-js');

// Write your code here
```

Client-side

```html
<script type="text/javascript" src="i18n-js.min.js"></script>
<script type="text/javascript">
  // Write your code here
</script> 
```

Then set the options that suit you best:

```javascript
var i18n = i18n({
  // A string containing a standard url (with {part} and {lang}) or function (part, lang) that returns a string. Default value: '{lang}/{part}.json'
  urlTemplate: '{lang}/{part}.json',
  
  // List of supported languages for translation. Default value: []
  availables: [],
  
  // Languages to be used if a translation is not found. Default value: []
  fallbacks: [ 'en-GB', { pt-BR: pt-PT } ],
  
  // Sets the language preferred by application (immutable), in the absence of a locale the value of this option is used. Default value: 'en-US'
  preferred: 'en-US',
  
  // Current language, typically set automatically from the user's preferences logged in the application or from HTTP requests. Default value: undefined
  locale: 'en-US', 
  
  // Delimiter used for translations namespaced. Default value: '.'
  objectDelimiter: '.', 
  
  // Loader of the translation files, returning an object with the syntax { [locale]: { translationId: 'translation'} }
  load: function(locale, preferred, fallbacks, urlTemplate) {
    // Write your code according to the framework used by you
  }
});
```

Now, create the translation files with the required texts, for example:

**./locales/en-us.json**
```json
{
  "entry": {
    "customer": "Customer",
    "firstname": "Firstname",
    "lastname": "Lastname" 
  },
  "text": {
    "selectedRow": "{COUNT, plural, zero{No selected row} one{1 selected row} other{# selected rows}}",
	  "like": "{GENDER, select, male{He} female{She} other{They}} like this."
  },
  "error": {
    "required": "This field is required",
    "length": "Length must be between {} and {}",
    "range": "Must be between {{min}} and {{max}}"
  }
}
```

**./locales/pt-br.json**
```json
{
  "entry": {
    "customer": "Cliente",
    "firstname": "Nome",
    "lastname": "Sobrenome" 
  },
  "text": {
    "selectedRow": "{COUNT, plural, zero{Nenhuma linha selecionada} one{1 linha selecionada} other{# linhas selecionadas}}",
	  "like": "{GENDER, select, male{Ele gosta} female{Ela gosta} other{Eles gostam}} disso."
  },
  "error": {
    "required": "Este campo é obrigatório",
    "length": "O tamanho para este campo deve estar entre {} e {}",
    "range": "O valor para este campo deve estar entre {{min}} e {{max}}"
  }
}
```

Ready! With the default options, let's illustrate the use of the features:

### Translation

Now, notice how simple the translation of a text:

```javascript
// Common use (informal)
i18n.get('entry.customer'); // Customer
i18n.get('entry.customer', { $lang: 'pt-br' }); // Cliente

// Formal use
i18n.get({ $id: 'error.required' }); // This field is required
i18n.get({ $id: 'error.required', $lang: 'pt-br' }); // Este campo é obrigatório

// Multiple simultaneous translations
i18n.get([ 'entry.firstname', 'entry.lastname' ]); // [ 'Firstname', 'Lastname' ]
i18n.get([ 'entry.firstname', 'entry.lastname' ], { $lang: 'pt-br' }); // [ 'Nome', 'Sobrenome' ]
```

### Interpolation

Well, now that we know how the translation works, see how interpolate variables (variables replacement) with the translated text:
  
```javascript
// Common use (informal)
i18n.get('error.length', 1, 15); // Length must be between 1 and 15
i18n.get('error.length', 1, 15, { $lang: 'pt-br' }); // O tamanho para este campo deve estar entre 1 e 15

// Formal use
i18n.get('error.range', { min: 1, max: 999 }); // Must be between 1 and 999
i18n.get('error.range', { min: 1, max: 999 }, { $lang: 'pt-br' }); // O valor para este campo deve estar entre 1 e 999
```

### Pluralization

The pluralization feature implemented in this library follows the specification defined in [ICU User Guide](http://userguide.icu-project.org/formatparse/messages), where its use is done as follows:

```javascript
i18n.get('text.selectedRow', { COUNT: 0 }); // No selected row
i18n.get('text.selectedRow', { COUNT: 0 }, { $lang: 'pt-br' }); // Nenhuma linha selecionada
i18n.get('text.selectedRow', { COUNT: 1 }); // 1 selected row
i18n.get('text.selectedRow', { COUNT: 1 }, { $lang: 'pt-br' }); // 1 linha selecionada
i18n.get('text.selectedRow', { COUNT: 10 }); // 10 selected rows
i18n.get('text.selectedRow', { COUNT: 10 }, { $lang: 'pt-br' }); // 10 linhas selecionadas

// equivalent to

i18n.plural('text.selectedRow', 0); // No selected row
i18n.plural('text.selectedRow', 0, { $lang: 'pt-br' }); // Nenhuma linha selecionada
i18n.plural('text.selectedRow', 1); // 1 selected row
i18n.plural('text.selectedRow', 1, { $lang: 'pt-br' }); // 1 linha selecionada
i18n.plural('text.selectedRow', 10); // 10 selected rows
i18n.plural('text.selectedRow', 10, { $lang: 'pt-br' }); // 10 linhas selecionadas
```

### Gender

As well as the pluralization feature, this feature also follows the specification defined in [ICU User Guide](http://userguide.icu-project.org/formatparse/messages), allowing you to easily apply gender rules:

```javascript
i18n.get('text.like', { GENDER: 'male' }); // He like this.
i18n.get('text.like', { GENDER: 'male' }, { $lang: 'pt-br' }); // Ele gostou disso.
i18n.get('text.like', { GENDER: 'female' }); // She like this.
i18n.get('text.like', { GENDER: 'female' }, { $lang: 'pt-br' }); // Ela gostou disso.
i18n.get('text.like', { GENDER: 'other' }); // They like this.
i18n.get('text.like', { GENDER: 'other' }, { $lang: 'pt-br' }); // Eles gostam disso.

// equivalent to

i18n.gender('text.like', 'male'); // He like this.
i18n.gender('text.like', 'male', { $lang: 'pt-br' }); // Ele gosta disso.
i18n.gender('text.like', 'female'); // She like this.
i18n.gender('text.like', 'female', { $lang: 'pt-br' }); // Ela gosta disso.
i18n.gender('text.like', 'other'); // They like this.
i18n.gender('text.like', 'other', { $lang: 'pt-br' }); // Eles gostam disso.
```

### Aliases

After presentation of the main features of the library, we see an additional and very useful feature when you want to keep the semantics in your code:

```javascript
// Default aliases
i18n.error('required'); // Equivalent to i18n.get('error.required')
i18n.warn('timeout'); // Equivalent to i18n.get('warn.timeout')
i18n.success('save'); // Equivalent to i18n.get('success.save')
i18n.info('changelog'); // Equivalent to i18n.get('info.changelog')

// Custom aliases
i18n.alias('text'); // Create an alias 'text' for the namespace 'text.'
i18n.text('welcome',  'Raphael'); // Equivalent to i18n.get('text.welcome', 'Raphael')

i18n.alias('t', 'text'); // Create an alias 't' for the namespace 'text.'
i18n.t('welcome', 'Raphael'); // Equivalent to i18n.get('text.welcome', 'Raphael')
```

## API

For a better understanding of the syntax and options supported by this library, read this section and see all the possibilities offered in their use:

####`urlTemplate` _<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>_

A string containing a standard url (with *{part}* and *{lang}*) or *function (part, lang)* that returns a string. **Default value:** *'{lang}/{part}.json'*

```javascript
// Syntax
var i18n = require('i18n-js')(
  urlTemplate: '{lang}/{part}.json' 
);

// or 

var i18n = require('i18n-js')(
  urlTemplate: function(part, lang) {
    var directoryTranslationFiles = './';
	  return directory + '/{lang}/{part}.json';
  } 
);
```

## Contributing

1. Fork it ( https://github.com/raphaelfjesus/i18n-js/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Tests

To run the test suite, first install the dependencies, then run npm test:

```bash
$ npm install
$ npm test
```

## License

[MIT](LICENSE)
