export const districts = [
  { id: 'polarbear', x: -5.2, z: 2.4, color: '#dbd4a0' },
  { id: 'polarbear-vocab', x: 4.6, z: 3.5, color: '#a5d3a6' },
  { id: 'hyperraft', x: 0, z: -3.6, color: '#9bdfb1' },
  { id: 'qualitysphere', x: 6, z: -3.4, color: '#c0d6a0' },
  { id: 'polarbear-memory', x: -5.8, z: -3.7, color: '#c1d2aa' },
] as const;
export type CityState = {
  selected: number | null;
  expanded: boolean;
  touring: boolean;
};
export type CityAction =
  | { type: 'select'; index: number }
  | { type: 'home' | 'tour' | 'next' | 'expand' };
export const initialCity: CityState = {
  selected: null,
  expanded: false,
  touring: false,
};
export function cityReducer(state: CityState, action: CityAction): CityState {
  switch (action.type) {
    case 'select':
      return action.index >= 0 && action.index < districts.length
        ? { selected: action.index, expanded: false, touring: false }
        : state;
    case 'home':
      return initialCity;
    case 'tour':
      return { selected: 0, expanded: false, touring: true };
    case 'next':
      return state.selected === null || state.selected === districts.length - 1
        ? initialCity
        : { selected: state.selected + 1, expanded: false, touring: true };
    case 'expand':
      return state.selected === null
        ? state
        : { ...state, expanded: !state.expanded };
  }
}
