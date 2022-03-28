import { describe, it, expect } from 'vitest'
import { deepConvertKeys, snakeCase, camelCase } from '../src'

function numberCase (val: string) {
  return snakeCase(val).replace(/_([0-9]+?)_/g, '$1_')
}

const camelCaseObject = {
  collectionCount: 3,
  collectionItems: [
    { itemName: 'First', itemChildren: [{ childName: 'First Child' }] },
    { itemName: 'Second', itemChildren: [{ childName: 'Second Child' }] },
    { itemName: 'Third', itemChildren: [{ childName: 'Third Child' }] },
  ],
}

const snakeCaseObject = {
  collection_count: 3,
  collection_items: [
    { item_name: 'First', item_children: [{ child_name: 'First Child' }] },
    { item_name: 'Second', item_children: [{ child_name: 'Second Child' }] },
    { item_name: 'Third', item_children: [{ child_name: 'Third Child' }] },
  ],
}

describe('deepConvertKeys', () => {
  it('converts nested objects', () => {
    expect(deepConvertKeys(snakeCaseObject, camelCase)).toEqual(camelCaseObject)
    expect(deepConvertKeys(camelCaseObject, snakeCase)).toEqual(snakeCaseObject)
  })

  it('can be safely applied twice', () => {
    expect(deepConvertKeys(camelCaseObject, camelCase)).toEqual(camelCaseObject)
    expect(deepConvertKeys(snakeCaseObject, snakeCase)).toEqual(snakeCaseObject)
  })

  it('accepts custom functions', () => {
    Object.assign(camelCaseObject, { three3ItemsCollection: true })
    Object.assign(snakeCaseObject, { three3_items_collection: true })
    expect(deepConvertKeys(camelCaseObject, numberCase)).toEqual(snakeCaseObject)
  })
})
