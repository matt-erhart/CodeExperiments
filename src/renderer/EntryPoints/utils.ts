/**
 * from https://github.com/datorama/ts-safe-access/blob/master/src/ts-safe-access.ts
 * @param {T} obj
 * @param {(obj: T) => R} fn
 * @param {R} defaultValue
 * @param {boolean} excludeNull
 * @returns {R}
 *
const data = {its: {really: {really: {really: {nested : undefined}}}}, nested: {value: null}};
const result = get(data, data => data.its.really.really.really.nested, 'defaultValue');
 */
export function get<T, R>(
  obj: T,
  fn: (obj: T) => R,
  defaultValue?: R,
  excludeNull = false
) {
  try {
    let result = fn(obj);
    result = excludeNull ? (result === null ? defaultValue : result) : result;
    return result === undefined ? defaultValue : result;
  } catch (err) {
    return defaultValue;
  }
}

export const updateArrayIndex = (arr, index, newValue) => {
  return [
    ...arr.slice(0, index), // all the items before the update item
    newValue, // add the newName in place of the old name
    ...arr.slice(index + 1) // all the items after the update item
  ];
};
