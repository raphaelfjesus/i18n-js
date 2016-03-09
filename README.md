# i18n-js

[![Build Status](https://travis-ci.org/raphaelfjesus/i18n-js.svg?branch=master)](http://travis-ci.org/raphaelfjesus/i18n-js)
[![Code Climate](https://codeclimate.com/github/raphaelfjesus/i18n-js/badges/gpa.svg)](https://codeclimate.com/github/raphaelfjesus/i18n-js)
[![Test Coverage](https://codeclimate.com/github/raphaelfjesus/i18n-js/badges/coverage.svg)](https://codeclimate.com/github/raphaelfjesus/i18n-js/coverage)

You need a simple and objective javascript library for manipulating translations, regardless of web framework ([AngularJS](https://angularjs.org/), [React](https://facebook.github.io/react/), [Backbone.js](http://backbonejs.org/), [Ember.js](http://emberjs.com/), among others) or [Node.JS](https://nodejs.org)? If your answer is yes, then read this document and see the resources available for this library.

## Features

 - Translation
 - Interpolation
 - Pluralization
 - Gender
 - Aliases

## Requirements

 - [ECMAScript 6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)

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
  fallbacks: {
    'ca': 'es-ES', // use Spanish translations if Catalan translations are missing
    'de': [ 'en-US', 'en-GB' ] // use English translations if Deutsch translations are missing
  },
  
  // Sets the language preferred by application (immutable), in the absence of a locale the value of this option is used. Default value: 'en-US'
  preferred: 'en-US',
  
  // Delimiter used for translations namespaced. Default value: '.'
  objectDelimiter: '.', 
  
  // An function(translatedText, interpolationParameters) for custom interpolation. Default value: undefined
  interpolator: undefined, 
  
  // Loader of the translation files, returning an object with the syntax { locale: { translationId: 'translation'} }
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
}
```

**./locales/es-es.json**
```json
{
  "entry": {
    "customer": "Cliente",
    "firstname": "Nombre",
    "lastname": "Apellido" 
  },
  "text": {
    "selectedRow": "{COUNT, plural, zero{No hay filas seleccionadas} one{1 fila seleccionada} other{# líneas seleccionadas}}",
    "like": "{GENDER, select, male{Que le gusta} female{Que le gusta} other{Que les gusta}} lo.",
    "welcome": "Bienvenido, {{}}!",
    "alphabet": "Las 4 primeras letras del alfabeto Inglés son: %s, %s, %s y %s",
    "presentation": "Mi nombre es {} y tengo {} hijos."
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
```

Ready! With the default options, let's illustrate the use of the features:

### Translation

Now, notice how simple the translation of a text:

```javascript
// Common use
i18n.get('entry.customer'); // Customer
i18n.get('entry.customer', { $lang: 'pt-br' }); // Cliente

// Formal use
i18n.get({ $id: 'error.required' }); // This field is required
i18n.get({ $id: 'error.required', $lang: 'pt-br' }); // Este campo é obrigatório
i18n.get({ $id: 'error.required' }, { $lang: 'pt-br' }); // Este campo é obrigatório

// Multiple simultaneous translations
i18n.get([ 'entry.firstname', 'entry.lastname' ]); // { 'entry.firstname': 'Firstname', 'entry.lastname': 'Lastname' }
i18n.get([ 'entry.firstname', 'entry.lastname' ], { $lang: 'pt-br' }); // { 'entry.firstname': 'Nome', 'entry.lastname': 'Sobrenome' }
i18n.get([ { $id: 'entry.firstname', $lang: 'pt-br' }, { $id: 'entry.lastname', $lang: 'es-es' }, { $id: 'entry.customer' } ]); // { 'entry.firstname': 'Nome', 'entry.lastname': 'Apellido', 'entry.customer': 'Customer' }

// Translation from the fallback language
i18n.get('entry.firstname', { $lang: 'ca' }); // Catalan translation => Spanish translation = Nombre
i18n.get('entry.firstname', { $lang: 'de' }); // Deutsch translation => English translation = Firstname
```

### Interpolation

Well, now that we know how the translation works, see how interpolate variables (variables replacement) with the translated text:
  
```javascript
// Common use
i18n.get('error.length', 1, 15); // Length must be between 1 and 15
i18n.get('error.length', 1, 15, { $lang: 'pt-br' }); // O tamanho para este campo deve estar entre 1 e 15

i18n.get('text.welcome', 'Raphael'); // Welcome, Raphael!
i18n.get('text.welcome', 'Raphael', { $lang: 'pt-br' }); // Seja bem-vindo, Raphael!

i18n.get('text.presentation', 'Raphael', 2); // My name is Raphael and I have 2 children.
i18n.get('text.presentation', 'Raphael', 2, { $lang: 'pt-br' }); // Meu nome é Raphael e tenho 2 filhos.

// Named parameters
i18n.get('error.range', { min: 1, max: 999 }); // Must be between 1 and 999
i18n.get('error.range', { min: 1, max: 999 }, { $lang: 'pt-br' }); // O valor para este campo deve estar entre 1 e 999
```

or, custom interpolator:

```javascript
var vsprintf = require('sprintf-js').vsprintf;
var i18n = require('i18n-js')({
  // Using sprintf to format
  interpolator: function(translatedText, interpolationParameters) {
    return (/%/).test(translatedText) ? vsprintf(translatedText, interpolationParameters) : translatedText;
  }
});

i18n.get('text.alphabet', 'a', 'b', 'c', 'd'); // The first 4 letters of the english alphabet are: a, b, c and d
i18n.get('text.alphabet', 'a', 'b', 'c', 'd', { $lang: 'pt-br' }); // As primeiras 4 letras do alfabeto Inglês são: a, b, c e d
```

### Pluralization

The pluralization feature implemented in this library follows the specification defined in [ICU User Guide](http://userguide.icu-project.org/formatparse/messages), where its use is done as follows:

```javascript
i18n.get('text.selectedRow', { $count: 0 }); // No selected row
i18n.get('text.selectedRow', { $count: 1 }); // 1 selected row
i18n.get('text.selectedRow', { $count: 10 }); // 10 selected rows

i18n.get('text.selectedRow', { $count: 0, $lang: 'pt-br' }); // Nenhuma linha selecionada
i18n.get('text.selectedRow', { $count: 1, $lang: 'pt-br' }); // 1 linha selecionada
i18n.get('text.selectedRow', { $count: 10, $lang: 'pt-br' }); // 10 linhas selecionadas

// equivalent to

i18n.plural('text.selectedRow', 0); // No selected row
i18n.plural('text.selectedRow', 1); // 1 selected row
i18n.plural('text.selectedRow', 10); // 10 selected rows

i18n.plural('text.selectedRow', 0, { $lang: 'pt-br' }); // Nenhuma linha selecionada
i18n.plural('text.selectedRow', 1, { $lang: 'pt-br' }); // 1 linha selecionada
i18n.plural('text.selectedRow', 10, { $lang: 'pt-br' }); // 10 linhas selecionadas
```

or, custom pluralizer:

```javascript
var MessageFormat = require('messageformat');
var i18n = require('i18n-js')({
  // Using message format for pluralization (override default pluralization)
  pluralizer: function(language, translatedText, interplateParams) {
    var format = new MessageFormat(language).compile(translatedText);
    return format(interplateParams);
  }
});

i18n.get('text.searchResult', { $count: 0 }); // No records found
i18n.get('text.searchResult', { $count: 1 }); // 1 record found
i18n.get('text.searchResult', { $count: 10 }); // 10 records found

// Equivalent to

i18n.plural('text.searchResult', { $count: 0 }); // No records found
i18n.plural('text.searchResult', { $count: 1 }); // 1 record found
i18n.plural('text.searchResult', { $count: 10 }); // 10 records found
```

### Gender

As well as the pluralization feature, this feature also follows the specification defined in [ICU User Guide](http://userguide.icu-project.org/formatparse/messages), allowing you to easily apply gender rules:

```javascript
i18n.get('text.like', { $gender: 'male' }); // He like this.
i18n.get('text.like', { $gender: 'female' }); // She like this.
i18n.get('text.like', { $gender: 'other' }); // They like this.

i18n.get('text.like', { $gender: 'male', $lang: 'pt-br' }); // Ele gostou disso.
i18n.get('text.like', { $gender: 'female', $lang: 'pt-br' }); // Ela gostou disso.
i18n.get('text.like', { $gender: 'other', $lang: 'pt-br' }); // Eles gostam disso.

// equivalent to

i18n.gender('text.like', 'male'); // He like this.
i18n.gender('text.like', 'female'); // She like this.
i18n.gender('text.like', 'other'); // They like this.

i18n.gender('text.like', 'male', { $lang: 'pt-br' }); // Ele gosta disso.
i18n.gender('text.like', 'female', { $lang: 'pt-br' }); // Ela gosta disso.
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
i18n.text('welcome', 'Raphael'); // Equivalent to i18n.get('text.welcome', 'Raphael')

i18n.alias({ t: 'text'}); // Create an alias 't' for the namespace 'text.'
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
    var directory = './';
    return directory + '/{lang}/{part}.json';
  } 
);
```

####`availables` _<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)>_

List of supported languages for translation. **Default value:** *[]*

####`fallbacks` _<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)>_

Languages to be used if a translation is not found. **Default value:** *[]*

####`preferred` _<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>_

Sets the language preferred by application (immutable), in the absence of a locale the value of this option is used. **Default value:** *'en-US'*

####`locale` _<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>_

Current language, typically set automatically from the user's preferences logged in the application or from HTTP requests. **Default value:** *undefined*

####`objectDelimiter` _<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>_

Delimiter used for translations namespaced. **Default value:** *'.'*

####`interpolator` _<[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>_

An function(translatedText, interpolationParameters) for custom interpolation. **Default value:** *undefined*

####`load` _<[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>_

Loader of the translation files, returning an object with the syntax { locale: { translationId: 'translation'} } **Default value:** *empty function*

```javascript
// Syntax
var i18n = require('i18n-js')(
  load: function(locale, preferred, fallbacks, urlTemplate) {
    // Write your code according to the framework used by you
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

The MIT License (MIT)

Copyright (c) 2016 Raphael F. Jesus <raphaelfjesus@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
