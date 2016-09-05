import { expect } from 'chai';
import Immutable from 'immutable';
import read from './ok-selector';

describe('ok-selector', () => {
  context('native objects', () => {
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
  });

  context('Immutable objects', () => {
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
  })
})