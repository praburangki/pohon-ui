import { isFunction, isNullish, isString } from '@vinicunca/perkakas';
import { isEqual } from 'ohash/utils';

export function getProp(
  { object, path, defaultValue }:
  {
    object: Record<string, any> | undefined;
    path: Array<string | number> | string;
    defaultValue?: any;
  },
): any {
  if (isString(path)) {
    path = path.split('.').map((key) => {
      const numKey = Number(key);
      return Number.isNaN(numKey) ? key : numKey;
    });
  }

  let result: any = object;

  for (const key of path) {
    if (isNullish(result)) {
      return defaultValue;
    }

    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

export function compare<T>(
  { value, currentValue, comparator }:
  { value?: T; currentValue?: T; comparator?: string | ((a: T, b: T) => boolean) } = {},
) {
  if (value === undefined || currentValue === undefined) {
    return false;
  }

  if (isString(value)) {
    return value === currentValue;
  }

  if (isFunction(comparator)) {
    return comparator(value, currentValue);
  }

  if (isString(comparator)) {
    return getProp({ object: value!, path: comparator }) === getProp({ object: currentValue!, path: comparator });
  }

  return isEqual(value, currentValue);
}

export function isArrayOfArray<A>(item: Array<A> | Array<Array<A>>): item is Array<Array<A>> {
  return Array.isArray(item[0]);
}

export function looseToNumber(val: any): any {
  const num = Number.parseFloat(val);

  return Number.isNaN(num) ? val : num;
}
