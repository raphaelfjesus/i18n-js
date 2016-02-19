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

```bash
$ npm install i18n-js
```

### Client-side

```bash
$ bower install i18n-js
```

## Usage

Antes iniciar o uso das funcionalidades providas pela biblioteca, primeiro importe-a para seu projeto:

Server-side

```javascript
var i18n = require('i18n-js');

// Sua implementação
```

Client-side

```javascript
<script type="text/javascript" src="i18n-js.min.js"></script>
<script type="text/javascript">
  // Sua implementação
</script> 
```

Em seguida, defina as oções que lhe atendam melhor:

```javascript
var i18n = i18n({
  // Uma string contendo um padrão de url (com '{part}' e '{lang}') ou uma function (part, lang) que retorne uma string. Valor padrão: '{lang}/{part}.json'
  urlTemplate: '{lang}/{part}.json',
  
  // Lista dos idiomas suportados pela aplicação. Valor padrão: []
  availables: [],
  
  // Idiomas a serem considerados caso uma tradução não seja encontrada. Valor padrão: []
  fallbacks: [ 'en-GB', { pt-BR: pt-PT} ],
  
  // Define o idioma preferido pela aplicação (Imutável), na falta de um locale o valor desta opção será utilizado. Valor padrão: 'en-US'
  preferred: 'en-US',
  
  // Indica o idioma corrente, normalmente preenchido de forma automática a partir das preferências do usuário logado na aplicação ou requisições HTTP. Valor padrão: undefined
  locale: 'en-US', 
  
  // Permite alterar o delimitador para traduções namespaced. Valor padrão: '.'
  objectDelimiter: '.', 
  
  // Esta opção é responsável por carregar o arquivo de tradução desejado, cujo seu retorno deverá ser um objeto contendo as traduções do idioma corrente, por exemplo: { en-us: { translationId: 'texto traduzido ' } }
  load: function(locale, preferred, fallbacks, urlTemplate) {
    // Implemente de acordo com as particularidades do framework utilizado por você
  }
});
```

Agora, crie os arquivos de traduções com os textos necessários, como por exemplo:

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
	"like": "{GENDER, select, male{He} female{She} other{They}} liked this."
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
	"like": "{GENDER, select, male{Ele gostou} female{Ela gostou} other{Eles gostaram}} disso."
  },
  "error": {
    "required": "Este campo é obrigatório",
    "length": "O tamanho para este campo deve estar entre {} e {}",
    "range": "O valor para este campo deve estar entre {{min}} e {{max}}"
  }
}
```

Pronto! Com as configurações definidas, vamos ilustrar o uso das funcionalidades:

### Translation

Agora, observe como é simples a tradução de um texto:

```javascript
// Uso comum (informal)
i18n.get('entry.customer'); // Customer
i18n.get('entry.customer', { $lang: 'pt-br' }); // Cliente

// Uso formal
i18n.get({ $id: 'error.required' }); // This field is required
i18n.get({ $id: 'error.required', $lang: 'pt-br' }); // Este campo é obrigatório

// Múltiplas traduções simultâneas
i18n.get([ 'entry.firstname', 'entry.lastname' ]); // [ 'Firstname', 'Lastname' ]
i18n.get([ 'entry.firstname', 'entry.lastname' ], { $lang: 'pt-br' }); // [ 'Nome', 'Sobrenome' ]
```

### Interpolation

Bom, agora que já sabemos como a tradução funciona, vejamos como interpolamos variáveis (substituição de variáveis) com o texto traduzido:
  
```javascript
// Uso comum (informal)
i18n.get('error.length', 1, 15); // Length must be between 1 and 15
i18n.get('error.length', 1, 15, { $lang: 'pt-br' }); // O tamanho para este campo deve estar entre 1 e 15

// Uso formal
i18n.get('error.range', { min: 1, max: 999 }); // Must be between 1 and 999
i18n.get('error.range', { min: 1, max: 999 }, { $lang: 'pt-br' }); // O valor para este campo deve estar entre 1 e 999
```

### Pluralization

O recurso de pluralização implementada nesta biblioteca, segue a especificação definida no [Guia do Usuário ICU](http://userguide.icu-project.org/formatparse/messages), onde seu uso é feito da seguinte maneira:

```javascript
i18n.get('text.selectedRow', { COUNT: 0 }); // No selected row
i18n.get('text.selectedRow', { COUNT: 0 }, { $lang: 'pt-br' }); // Nenhuma linha selecionada
i18n.get('text.selectedRow', { COUNT: 1 }); // 1 selected row
i18n.get('text.selectedRow', { COUNT: 1 }, { $lang: 'pt-br' }); // 1 linha selecionada
i18n.get('text.selectedRow', { COUNT: 10 }); // 10 selected rows
i18n.get('text.selectedRow', { COUNT: 10 }, { $lang: 'pt-br' }); // 10 linhas selecionadas

// Equivalente a

i18n.plural('text.selectedRow', 0); // No selected row
i18n.plural('text.selectedRow', 0, { $lang: 'pt-br' }); // Nenhuma linha selecionada
i18n.plural('text.selectedRow', 1); // 1 selected row
i18n.plural('text.selectedRow', 1, { $lang: 'pt-br' }); // 1 linha selecionada
i18n.plural('text.selectedRow', 10); // 10 selected rows
i18n.plural('text.selectedRow', 10, { $lang: 'pt-br' }); // 10 linhas selecionadas
```

### Gender

Assim como o recurso de pluralização, esta funcionalidade também segue a especificação definida no [Guia do Usuário ICU](http://userguide.icu-project.org/formatparse/messages), permitindo facilmente aplicar regras de gênero: 

```javascript
i18n.get('text.like', { GENDER: 'male' }); // He liked this.
i18n.get('text.like', { GENDER: 'male' }, { $lang: 'pt-br' }); // Ele gostou disso.
i18n.get('text.like', { GENDER: 'female' }); // She liked this.
i18n.get('text.like', { GENDER: 'female' }, { $lang: 'pt-br' }); // Ela gostou disso.
i18n.get('text.like', { GENDER: 'other' }); // They liked this.
i18n.get('text.like', { GENDER: 'other' }, { $lang: 'pt-br' }); // Eles gostaram disso.

// Equivalente a

i18n.gender('text.like', 'male'); // He liked this.
i18n.gender('text.like', 'male', { $lang: 'pt-br' }); // Ele gostou disso.
i18n.gender('text.like', 'female'); // She liked this.
i18n.gender('text.like', 'female', { $lang: 'pt-br' }); // Ela gostou disso.
i18n.gender('text.like', 'other'); // They liked this.
i18n.gender('text.like', 'other', { $lang: 'pt-br' }); // Eles gostaram disso.
```

### Aliases

Após apresentação das principais funcionalidades da biblioteca, vamos ver um recurso adicional e muito útil quando se deseja manter a semântica em seu código:

```javascript
// Default aliases
i18n.error('required'); // Equivalent to i18n.get('error.required')
i18n.warn('timeout'); // Equivalent to i18n.get('warn.timeout')
i18n.success('save'); // Equivalent to i18n.get('success.save')
i18n.info('changelog'); // Equivalent to i18n.get('info.changelog')

// Custom aliases
i18n.alias('text'); // Cria um apelido para o namespace 'text.'
i18n.text('welcome',  'Raphael'); // Equivalent to i18n.get('text.welcome', 'Raphael')

i18n.alias('t', 'text'); // Cria um apelido para o namespace 'text.' denominado de 't'
i18n.t('welcome', 'Raphael'); // Equivalent to i18n.get('text.welcome', 'Raphael')
```

## API

Para uma melhor compreensão da sintaxe e opções suportadas por esta biblioteca, leia atentamente esta seção e veja todas as possibilidades permitidas em seu uso:

####`urlTemplate` _<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>_

Uma [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) contendo um padrão de url (com *{part}* e *{lang}* em seu formato) ou uma *function (part, lang)* que retorne uma [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). **Valor padrão:** *'{lang}/{part}.json'*

```javascript
// Sintaxe
var i18n = require('i18n-js')(
  urlTemplate: '{lang}/{part}.json' 
);

// or 

var i18n = require('i18n-js')(
  urlTemplate: function(part, lang) {
    var directory = './'; // Sua lógica para obter o diretório dos arquivos de tradução
	return directory + '{lang}/{part}.json';
    url	
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
