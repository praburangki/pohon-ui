import type { Direction, Locale } from '../types/type.locale';
import { defu } from 'defu';

interface DefineLocaleOptions<M> {
  name: string;
  code: string;
  dir?: Direction;
  messages: M;
}

/* @__NO_SIDE_EFFECTS__ */
export function defineLocale<M>(options: DefineLocaleOptions<M>): Locale<M> {
  return defu<DefineLocaleOptions<M>, [{ dir: Direction }]>(options, { dir: 'ltr' });
}
