# informant

informant is a tiny form validation helper

## API
```js
var informant = require('informant')
```

informant always return a hash of whose keys are the IDs of validated form fields. The complexity of the values vary based on the number of arguments, and their types.

### Argument types

#### Element | NodeList | String
Accepts an element, nodelist, or selector string. If the element/s are empty or radio/checkboxes, the values will be boolean. Otherwise the values will be `{ value: field_value }`.

```js
informant('[name="subscribed"]')
> { subscribed: false }

informant(document.getElementById('email'), '[name="subscribed"]')
> {
  email: { value: 'foo@bar.com' },
  subscribed: false
}
```

#### Object
Accepts objects with an el property and any of the rules: min, max, and match.

##### min / max

```js
informant({ el: '.message', min: 10, max: 140 })
> { message: { min: false, max: true, value: 'Hi' }}
```

##### match

Accepts either a String or RegExp.

```js
informant({ el: '#name', match: 'John' })
> { name: { match: true, value: 'John'} }

informant({ el: '#name', match: /^[a-zA-Z \-]+$/ })
> { name: { match: false, value: 'susan69' } }
```
