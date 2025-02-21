export interface DevtoolsMeta<T> {
  defaultProps?: T;
  example?: string;
  ignore?: boolean;
  ignoreProps?: Array<string>;
}

export function extendDevtoolsMeta<T>(_meta: DevtoolsMeta<T>) { }
