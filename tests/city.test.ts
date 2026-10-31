import { describe, expect, it } from 'vitest';
import { cityReducer, initialCity } from '../src/components/city/model';

describe('city navigation', () => {
  it('keeps expansion scoped to the selected building and ignores invalid selections', () => {
    expect(cityReducer(initialCity, { type: 'expand' })).toEqual(initialCity);
    const selected = cityReducer(initialCity, { type: 'select', index: 0 });
    const inside = cityReducer(selected, { type: 'expand' });
    expect(inside.expanded).toBe(true);
    expect(cityReducer(inside, { type: 'select', index: 3 })).toEqual({
      selected: 3,
      expanded: false,
      touring: false,
    });
    expect(cityReducer(inside, { type: 'select', index: 50 })).toEqual(inside);
  });
  it('visits all five districts and returns to a clean overview', () => {
    let state = cityReducer(initialCity, { type: 'tour' });
    for (let i = 0; i < 5; i++) {
      expect(state).toEqual({ selected: i, expanded: false, touring: true });
      state = cityReducer(state, { type: 'next' });
    }
    expect(state).toEqual(initialCity);
  });
});
