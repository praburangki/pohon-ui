import type { ModuleOptions } from '../module';
import { defu } from 'defu';
import select from './select';

export default (options: Required<ModuleOptions>) => {
  return defu(
    {
      slots: {
        input: '',
        focusScope: '',
      },
    },
    select(options),
  );
};
