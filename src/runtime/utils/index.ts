import { isNullish, isString } from '@vinicunca/perkakas';

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
