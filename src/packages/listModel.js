import * as types from "types"

// get the base state of the list model
export const getBaseState = (baseObj = {}) => ({
  _items: [],
  _itemsById: {},
  _meta: {},
  ...baseObj
})

// get the base state of the list model item
export const getBaseItemState = (id) => ({
  id,
  _meta: {}
})

export const itemsCount = (baseState) => baseState._items.length

// get meta for the list
export const getMeta = (baseState) => baseState._meta

// get item from the list
export const getItem = (baseState, id) => baseState._itemsById[id]

// get an item's meta from the list
export const getItemMeta = item => item._meta

// map list items with a cb
export const map = (baseState, map = () => {}) => baseState._items.map((id, ...args) => map(getItem(baseState, id), ...args))

// filter list items with a cb
export const filter = (baseState, filter = () => {}) => baseState._items.filter((id, ...args)=> filter(getItem(baseState, id), ...args))


// update the meta for the list
export const updateMeta = (baseState, meta) => {
  return {
    ...baseState,
    _meta: {
      ...baseState.meta,
      ...meta
    }
  }
}

// insert an item in the list
export const insert = (baseState, items) => {
  const { _items, _itemsById } = baseState

  // we can add multiple items in one call

  if (!types.isArray(items)) {
    // make it an array
    items = [items]
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

export const destroy = (baseState, items) => {
  const { _items, _itemsById } = baseState
  if (!types.isArray(items)) {
    // make it an array
    items = [items]
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    // TODO: check if item is already present, throw exception if true
    // create item
    delete _itemsById[item.id]
  }

  // only the items that have an object associate with them
  const newItems = _items.filter(item => _itemsById[item.id])

  return {
    ...baseState,
    _items: [...newItems],
    _itemsById: { ..._itemsById }
  }
}


// update an list item with the new item
export const update = (baseState, items) => {
  const { _itemsById } = baseState

  // we can update multiple items in one call

  if (!types.isArray(items)) {
    // make it an array
    items = [items]
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
export const updateOrCreate = (baseState, items) => {
  const { _itemsById } = baseState
  if (!types.isArray(items)) {
    items = [items]
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
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
export const findOrCreate = (baseState, id) => {
  const { _itemsById } = baseState
  if (_itemsById[id]) return _itemsById[id]

  // CATUTION: WE ARE MUTATING THE BASE-STATE HERE, be sure to update the state
  const item = getBaseItemState(id)

  return item
}

// update item meta in the list
export const updateItemMeta = (baseState, id, meta = {}) => {
  const item = findOrCreate(baseState, id)
  item._meta = { ...item._meta, ...meta }
  if (meta.valid === false) {
    // this item is not valie
    // remove it from the list of items so that it will not come into list of items
    baseState._items = baseState._items.filter(itemId => itemId !== id)
  }
  return updateOrCreate(baseState, item)
}
