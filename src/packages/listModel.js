// @flow
import * as types from "./types"

type Id = number | string;
type ItemIds = Array<Id>;
type Item = {
  id: Id,
  _meta: {}
};
type Items = Array<Item> | Item;

type BaseState = {
  _items: ItemIds,
  _itemsById: {},
  _meta: {}
};


// get the base state of the list model
export const getBaseState = (baseObj: {} = {}): BaseState => ({
  _items: [],
  _itemsById: {},
  _meta: {},
  ...baseObj
})

// get the base state of the list model item
export const getBaseItemState = (id: Id): Item => ({
  id,
  _meta: {}
})

export const itemsCount = (baseState: BaseState): number => baseState._items.length

// get meta for the list
export const getMeta = (baseState: BaseState): {} => baseState._meta

// get item from the list
export const getItem = (baseState: BaseState, id: Id): ?Item => baseState._itemsById[id]

// get an item's meta from the list
export const getItemMeta = (item: { _meta?: {} }): ?{} => item._meta

// map list items with a cb
export const map = (
  baseState: BaseState,
  map: (item: ?Item, i: number, arr: ItemIds) => Array<mixed>
  ):Array<mixed> =>
    baseState._items.map((id: Id, i: number, arr: ItemIds): Array<mixed> => map(getItem(baseState, id), i, arr))

// filter list items with a cb
export const filter = (
  baseState: BaseState,
  filter: (item: ?Item, i: number, arr: ItemIds) => ItemIds
  ):ItemIds =>
    baseState._items.filter((id: Id, i: number, arr: ItemIds): ItemIds => filter(getItem(baseState, id), i, arr))


// update the meta for the list
export const updateMeta = (baseState: BaseState, meta: {}): BaseState => {
  return {
    ...baseState,
    _meta: {
      ...baseState._meta,
      ...meta
    }
  }
}

// insert an item in the list
export const insert = (baseState: BaseState, __items: any): BaseState => {
  const { _items, _itemsById } = baseState

  // we can add multiple items in one call
  let items: Items = []
  if (!types.isArray(__items)) {
    // make it an array
    items = [__items]
  } else {
    items = __items
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    // TODO: check if item is already present, throw exception if true
    // create item
    _itemsById[item.id] = { ...item }
    _items.push(item.id)
  }

  return {
    ...baseState,
    _items: [..._items],
    _itemsById: { ..._itemsById }
  }
}

export const destroy = (baseState: BaseState, __items: any): BaseState => {
  const { _items, _itemsById } = baseState
  let items: Items = []
  if (!types.isArray(__items)) {
    // make it an array
    items = [__items]
  } else {
    items = __items
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    // TODO: check if item is already present, throw exception if true
    // create item
    delete _itemsById[item.id]
  }

  // only the items that have an object associate with them
  const newItemIds = _items.filter(id => _itemsById[id])

  return {
    ...baseState,
    _items: [...newItemIds],
    _itemsById: { ..._itemsById }
  }
}


// update an list item with the new item
export const update = (baseState: BaseState, _items: any): BaseState => {
  const { _itemsById } = baseState

  // we can update multiple items in one call
  let items: Items = []
  if (!types.isArray(_items)) {
    // make it an array
    items = [_items]
  } else {
    items = _items
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    // TODO: check if item is present, throw exception if false
    _itemsById[item.id] = { ..._itemsById[item.id], ...item }
  }
  return {
    ...baseState,
    _itemsById
  }
}

// update or create an item in the list
export const updateOrCreate = (baseState: BaseState, _items: any): BaseState => {
  const { _itemsById } = baseState
  let items: Items = []
  if (!types.isArray(_items)) {
    items = [_items]
  } else {
    items = _items
  }
  for (let i: number = 0; i < items.length; i++) {
    const item: Item = items[i]
    if (_itemsById[item.id]) {
      // item already present
      baseState = update(baseState, item)
    } else {
      // create item
      baseState = insert(baseState, item)
    }
  }
  return baseState
}

// find or create an item in the list
export const findOrCreate = (baseState: BaseState, id: Id): Item => {
  const { _itemsById } = baseState
  if (_itemsById[id]) return _itemsById[id]

  // CATUTION: WE ARE MUTATING THE BASE-STATE HERE, be sure to update the state
  const item = getBaseItemState(id)

  return item
}

// update item meta in the list
export const updateItemMeta = (baseState: BaseState, id: Id, meta?: { valid?: boolean } = { }): BaseState => {
  const item = findOrCreate(baseState, id)
  item._meta = { ...item._meta, ...meta }
  if (meta.valid === false) {
    // this item is not valie
    // remove it from the list of items so that it will not come into list of items
    baseState._items = baseState._items.filter(itemId => itemId !== id)
  }
  return updateOrCreate(baseState, item)
}
