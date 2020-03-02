import {
  FAVORITED_STATUSES_FETCH_REQUEST,
  FAVORITED_STATUSES_FETCH_SUCCESS,
  FAVORITED_STATUSES_FETCH_FAIL,
  FAVORITED_STATUSES_EXPAND_REQUEST,
  FAVORITED_STATUSES_EXPAND_SUCCESS,
  FAVORITED_STATUSES_EXPAND_FAIL,
} from '../actions/favorites';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import {
  FAVORITE_SUCCESS,
  UNFAVORITE_SUCCESS,
  PIN_SUCCESS,
  UNPIN_SUCCESS,
} from '../actions/interactions';

const initialState = ImmutableMap({
  favorites: ImmutableMap({
    next: null,
    loaded: false,
    items: ImmutableList(),
  }),
  pins: ImmutableMap({
    next: null,
    loaded: false,
    items: ImmutableList(),
  }),
});

const normalizeList = (state, listType, statuses, next) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('loaded', true);
    map.set('isLoading', false);
    map.set('items', ImmutableList(statuses.map(item => item.id)));
  }));
};

const appendToList = (state, listType, statuses, next) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('isLoading', false);
    map.set('items', map.get('items').concat(statuses.map(item => item.id)));
  }));
};

const prependOneToList = (state, listType, status) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('items', map.get('items').unshift(status.get('id')));
  }));
};

const removeOneFromList = (state, listType, status) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('items', map.get('items').filter(item => item !== status.get('id')));
  }));
};

export default function statusLists(state = initialState, action) {
  switch(action.type) {
  case FAVORITED_STATUSES_FETCH_REQUEST:
  case FAVORITED_STATUSES_EXPAND_REQUEST:
    return state.setIn(['favorites', 'isLoading'], true);
  case FAVORITED_STATUSES_FETCH_FAIL:
  case FAVORITED_STATUSES_EXPAND_FAIL:
    return state.setIn(['favorites', 'isLoading'], false);
  case FAVORITED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, 'favorites', action.statuses, action.next);
  case FAVORITED_STATUSES_EXPAND_SUCCESS:
    return appendToList(state, 'favorites', action.statuses, action.next);
  case FAVORITE_SUCCESS:
    return prependOneToList(state, 'favorites', action.status);
  case UNFAVORITE_SUCCESS:
    return removeOneFromList(state, 'favorites', action.status);
  case PIN_SUCCESS:
    return prependOneToList(state, 'pins', action.status);
  case UNPIN_SUCCESS:
    return removeOneFromList(state, 'pins', action.status);
  default:
    return state;
  }
};
