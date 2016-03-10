# i18n-js

[![Build Status](https://travis-ci.org/raphaelfjesus/i18n-js.svg?branch=master)](http://travis-ci.org/raphaelfjesus/i18n-js)
[![Code Climate](https://codeclimate.com/github/raphaelfjesus/i18n-js/badges/gpa.svg)](https://codeclimate.com/github/raphaelfjesus/i18n-js)
[![Test Coverage](https://codeclimate.com/github/raphaelfjesus/i18n-js/badges/coverage.svg)](https://codeclimate.com/github/raphaelfjesus/i18n-js/coverage)

You need a simple and objective javascript library for manipulating translations, regardless of web framework ([AngularJS](https://angularjs.org/), [React](https://facebook.github.io/react/), [Backbone.js](http://backbonejs.org/), [Ember.js](http://emberjs.com/), among others) or [Node.JS](https://nodejs.org)? If your answer is yes, then read this document and see the resources available for this library.

## Features

 - Translation
 - Interpolation
 - Pluralization
 - Aliases

## Requirements

 - [ECMAScript 6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)

## Installation

**Server-side**

In an environment with [Node.js](https://nodejs.org), install with [NPM](https://www.npmjs.com):

```bash
$ npm install i18n-js
```

**Client-side**

On your page, install with [Bower](http://bower.io/):

```bash
$ bower install i18n-js
```

## Usage

Before you start using the functionality provided by the library, first import it into your project:

Server-side

```javascript
// Minimum configuration
var path = require('path');
var i18n = require('i18n-js')({
  urlTemplate: path.resolve('./locales/{locale}.json'), 
  locales: [ 'en-US', 'pt-BR' ] 
});
```

Client-side

```html
<script src="bower_components/i18n-js/i18n-js.min.js"></script>
<script type="text/javascript">
  // TODO
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
    "selectedRow": {
      "zero": "No selected row",
      "one": "1 selected row",
      "other": "{{count}} selected rows"
    },
    "welcome": "Welcome, {}!",
    "alphabet": "The first 4 letters of the english alphabet are: %s, %s, %s and %s",
    "names": "%2$s, %3$s and %1$s",
    "presentation": "My name is {} and I have {} children.",
    "myName": "My name is {{firstname}}.",
    "myFullname": "My full name is {{firstname}} {{lastname}}.",
    "myDaughter": "My daughter's name is {{name}} and has only {{age}} years old.",
    "myMarried": "My name is {} and I am married to {} lady."
  },
  "error": {
    "required": "This field is required",
    "length": "Length must be between {} and {}",
    "range": "Must be between {{min}} and {{max}}",
    "maxLength": "Length must be no more than {}",
    "maxPercentage": "Percentage must be no more than {{max}}"
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
    "selectedRow": {
      "zero": "Nenhuma linha selecionada",
      "one": "1 linha selecionada",
      "other": "{{count}} linhas selecionadas"
    },
    "welcome": "Seja bem-vindo, {}!",
    "alphabet": "As primeiras 4 letras do alfabeto Inglês são: %s, %s, %s e %s",
    "names": "%2$s, %3$s e %1$s",
    "presentation": "Meu nome é {} e tenho {} filhos.",
    "myName": "Meu nome é {{firstname}}.",
    "myFullname": "Meu nome completo é {{firstname}} {{lastname}}.",
    "myDaughter": "O nome da minha filha é {{name}} e tem apenas {{age}} anos de idade.",
    "myMarried": "Meu nome é {} e sou casado com a senhora {}."
  },
  "error": {
    "required": "Este campo é obrigatório",
    "length": "O tamanho para este campo deve estar entre {} e {}",
    "range": "O valor para este campo deve estar entre {{min}} e {{max}}",
    "maxLength": "O tamanho máximo para este campo é {}",
    "maxPercentage": "A porcentagem máxima para este campo é {{max}}"
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
    "selectedRow": {
      "zero": "No hay filas seleccionadas",
      "one": "1 fila seleccionada",
      "other": "{{count}} líneas seleccionadas"
    },
    "welcome": "Bienvenido, {{}}!",
    "alphabet": "Las 4 primeras letras del alfabeto inglés son: %s, %s, %s y %s",
    "names": "%2$s, %3$s y %1$s",
    "presentation": "Mi nombre es {} y tengo {} hijos.",
    "myName": "Mi nombre es {{firstname}}.",
    "myFullname": "Mi nombre completo es {{firstname}} {{lastname}}.",
    "myDaughter": "El nombre de mi hija es {{name}} y tiene sólo {{age}} años.",
    "myMarried": "Mi nombre es {} y estoy casada con {} dama."
  },
  "error": {
    "required": "Este campo es obligatorio",
    "length": "El tamaño de este campo debe estar entre {} y {}",
    "range": "El valor de este campo debe estar entre {{min}} y {{max}}",
    "maxLength": "El tamaño máximo para este campo es {}",
    "maxPercentage": "El porcentaje máximo para este campo es {{max}}"
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
```

or, custom pluralizer:

```javascript
var MessageFormat = require('messageformat');
var i18n = require('i18n-js')({
  // Using message format for pluralization (override default pluralization)
  pluralizer: function(language, translatedText, interpolationParameters) {
    var format = new MessageFormat(language).compile(translatedText);
    return format(interpolationParameters);
  }
});

i18n.get('text.searchResult', { $count: 0 }); // No records found
i18n.get('text.searchResult', { $count: 1 }); // 1 record found
i18n.get('text.searchResult', { $count: 10 }); // 10 records found
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

## API Reference

For a better understanding of the syntax and options supported by this library, read this section and see all the possibilities offered in their use:

- [`i18n.get(translationId, [options])`](#i18ngettranslationid-options)
- [`i18n.setLocale(locale)`](#i18nsetlocalelocale)
- [`i18n.alias(name)`](#i18naliasname)

#### `i18n.get(translationId, [options])`

Gets the corresponding translation to translation id.

##### Parameters

| Param                    | Type     | Details
| ------------------------ | -------- | ---------------------------------------------------------------------------------------
| **translationId**        | `String` | A JavaScript string as the translation key.
| **options** *(optional)* | `Object` | If you need to send parameters to translated text interpolation or define how the translation should be done using the properties `$lang`, `$count` or `$gender`.

##### Returns

- **string** - The translated text.

##### Usage

```javascript
var vsprintf = require('sprintf-js').vsprintf;
var i18n = require('i18n-node')({
  // preferred: 'en-US', // Default value
  fallbacks: {
    'ca': 'es-ES',
    'en': [ 'en-US', 'pt-BR' ]
  },
  // Not override the default interpolation
  interpolator: function(translatedText, interpolationParameters) {
    return (/%/).test(translatedText) ? vsprintf(translatedText, interpolationParameters) : translatedText;
  }
});
  
// Translation
i18n.get('heading'); // Demonstration of the use of I18n Node.JS library
i18n.get('heading', { $lang: 'pt-BR' }); // Demonstração do uso da biblioteca I18n Node.JS

i18n.get({ $id: 'entry.firstname' }); // Firstname
i18n.get({ $id: 'entry.firstname' }, { $lang: 'pt-BR' }); // Nome

i18n.get([ 'entry.firstname', 'entry.lastname' ]); // { 'entry.firstname': Firstname, 'entry.lastname': Lastname }
i18n.get([ 'entry.firstname', 'entry.lastname' ], { $lang: 'pt-BR' }); // { 'entry.firstname': Nome, 'entry.lastname': Sobrenome }

// Translation fallback
i18n.get('entry.firstname', { $lang: 'ca' }); // Nombre
i18n.get('entry.firstname', { $lang: 'en' }); // Firstname

// Translation with default interpolation
i18n.get('error.maxLength', 255); // Length must be no more than 255
i18n.get('error.maxLength', 255, { $lang: 'pt-BR' }); // O tamanho máximo para este campo é 255
i18n.get('error.length', 1, 255); // Length must be between 1 and 255
i18n.get('error.length', 1, 255, { $lang: 'pt-BR' }); // O tamanho para este campo deve estar entre 1 e 255

i18n.get('error.maxPercentage', { max: 50 }); // Percentage must be no more than 50
i18n.get('error.maxPercentage', { max: 50 }, { $lang: 'pt-BR' }); // A porcentagem máxima para este campo é 50
i18n.get('error.range', { min: 1, max: 999 }); // Must be between 1 and 999
i18n.get('error.range', { min: 1, max: 999 }, { $lang: 'pt-BR' }); // O valor para este campo deve estar entre 1 e 999

i18n.get('text.welcome', 'Raphael'); // Welcome, Raphael!
i18n.get('text.welcome', 'Raphael', { $lang: 'pt-BR' }); // Seja bem-vindo, Raphael!
i18n.get('text.myMarried', 'Raphael', 'Elizabeth'); // My name is Raphael and I am married to Elizabeth lady.
i18n.get('text.myMarried', 'Raphael', 'Elizabeth', { $lang: 'pt-BR' }); // Meu nome é Raphael e sou casado com a senhora Elizabeth.          

i18n.get('text.myName', { firstname: 'Raphael' }); // My name is Raphael.
i18n.get('text.myName', { firstname: 'Raphael' }, { $lang: 'pt-BR' }); // Meu nome é Raphael.
i18n.get('text.myFullname', { firstname: 'Raphael', lastname: 'Freitas' }); // My full name is Raphael Freitas.
i18n.get('text.myFullname', { firstname: 'Raphael', lastname: 'Freitas' }, { $lang: 'pt-BR' }); // Meu nome completo é Raphael Freitas.

i18n.get('text.presentation', 'Raphael', 2); // My name is Raphael and I have 2 children.
i18n.get('text.presentation', 'Raphael', 2, { $lang: 'pt-BR' }); // Meu nome é Raphael e tenho 2 filhos.
i18n.get("text.myDaughter", { name: 'Isabelle', age: 3 }); // My daughter's name is Isabelle and has only 3 years old.
i18n.get("text.myDaughter", { name: 'Isabelle', age: 3 }, { $lang: 'pt-BR' }); // O nome da minha filha é Isabelle e tem apenas 3 anos de idade.    

// Translation with custom interpolation
i18n.get('text.alphabet', 'a', 'b', 'c', 'd'); // The first 4 letters of the english alphabet are: a, b, c and d
i18n.get('text.alphabet', 'a', 'b', 'c', 'd', { $lang: 'pt-BR' }); // As primeiras 4 letras do alfabeto Inglês são: a, b, c e d

i18n.get('text.names', 'Angelina Jolie', 'Megan Fox', 'Beyoncé'); // Megan Fox, Beyoncé and Angelina Jolie
i18n.get('text.names', 'Angelina Jolie', 'Megan Fox', 'Beyoncé', { $lang: 'pt-BR' }); // Megan Fox, Beyoncé e Angelina Jolie          

// Translation with default pluralization (property $count is required)
i18n.get('text.selectedRow', { $count: 0 }); // No selected row
i18n.get('text.selectedRow', { $count: 1 }); // 1 selected row
i18n.get('text.selectedRow', { $count: 10 }); // 10 selected rows

i18n.get('text.selectedRow', { $count: 0, $lang: 'pt-BR' }); // Nenhuma linha selecionada
i18n.get('text.selectedRow', { $count: 1, $lang: 'pt-BR' }); // 1 linha selecionada
i18n.get('text.selectedRow', { $count: 10, $lang: 'pt-BR' }); // 10 linhas selecionadas

// Translation with default aliases => e.g. i18n.error('required') equivalent to i18n.get('error.required')
i18n.error('required'); // This field is required
i18n.error('required', { $lang: 'pt-BR' }); // Este campo é obrigatório

i18n.warn('timeout'); // Timeout
i18n.warn('timeout', { $lang: 'pt-BR' }); // Tempo expirado

i18n.success('save'); // Successfully saved
i18n.success('save', { $lang: 'pt-BR' }); // Salvo com sucesso

i18n.info('changelog'); // Changelog
i18n.info('changelog', { $lang: 'pt-BR' }); // Log de alterações
```

<hr>

#### `i18n.setLocale(locale)`

Sets the locale to be used in translation.

##### Parameters

| Param             | Type              | Details
| ----------------- | ----------------- | ---------------------------------------------------------------------------------------
| **locale**        | `String`          | The locale to be used.

##### Usage

```javascript
i18n.setLocale('es-ES');
```

<hr>

#### `i18n.alias(name)`

Sets an alias for a translation namespace.

##### Parameters

| Param             | Type              | Details
| ----------------- | ----------------- | ---------------------------------------------------------------------------------------
| **name**          | `String | Object` | The alias name to be used.

##### Usage

```javascript
i18n.alias('text');
i18n.text('welcome', 'Raphael'); // Equivalent to i18n.get('text.welcome')

i18n.alias({ label: 'entry' });
i18n.label('firstname'); // Equivalent to i18n.get('entry.firstname')
```

> Default aliases can not be overwritten.
```javascript
i18n.error('required'); // Equivalent to i18n.get('error.required')
i18n.warn('timeout'); // Equivalent to i18n.get('warn.timeout')
i18n.success('save'); // Equivalent to i18n.get('success.save')
i18n.info('changelog'); // Equivalent to i18n.get('info.changelog')
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
