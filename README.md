# ok-selector
A small library for plucking values out of objects, both native and immutable.

## native
Given the following state:

```javascript
const state = {
  level1: {
    level2: {
      level3: {
        value: 'yes'
      }
    }
  },
  array: [
    {id: 1, value: 2},
    {id: 2, value: 4},
    {id: 3, value: 6},
    {id: 4, value: 8},
  ]
};
```

These tests hold true

```javascript
it('should support dot.strings', () => {
  expect(read(state, 'level1.level2.level3.value')).to.equal('yes');
  expect(read(state, 'level1.level2.level3')).to.deep.equal({value: 'yes'});
  expect(read(state, 'array')).to.deep.equal([
    {id: 1, value: 2},
    {id: 2, value: 4},
    {id: 3, value: 6},
    {id: 4, value: 8},
  ]);
});

it('should support addressing arrays by id', () => {
  expect(read(state, 'array:3')).to.deep.equal({id: 3, value: 6});
  expect(read(state, 'array:3.value')).to.deep.equal(6);
});

it('should support plucking all values from an array', () => {
  expect(read(state, 'array*.value')).to.deep.equal([2, 4, 6, 8]);
});
```

## immutable
`ok-selector` supports [immutablejs](https://github.com/facebook/immutable-js).

Given the following state:

```javascript
const state = Immutable.fromJS({
  level1: {
    level2: {
      level3: {
        value: 'yes'
      }
    }
  },
  array: [
    {id: 1, value: 2},
    {id: 2, value: 4},
    {id: 3, value: 6},
    {id: 4, value: 8},
  ]
});
```

These tests hold true

```javascript
it('should support dot.strings', () => {
  expect(read(state, 'level1.level2.level3.value')).to.equal('yes');
  expect(read(state, 'level1.level2.level3').toJS()).to.deep.equal({value: 'yes'});
  expect(read(state, 'array').toJS()).to.deep.equal([
    {id: 1, value: 2},
    {id: 2, value: 4},
    {id: 3, value: 6},
    {id: 4, value: 8},
  ]);
});

it('should support addressing arrays by id', () => {
  expect(read(state, 'array:3').toJS()).to.deep.equal({id: 3, value: 6});
  expect(read(state, 'array:3.value')).to.deep.equal(6);
});

it('should support plucking all values from an array', () => {
  expect(read(state, 'array*.value').toJS()).to.deep.equal([2, 4, 6, 8]);
});
```

# Unwrapping

`read` always returns an object of based on the underlying implementation. Sometimes this is not what you want. `unwrap` will convert the response of read to a native object. For immutable objects it'll call `toJS`. Depending on the size and complexity of your state tree this can be relatively expensive.



