import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Schema as JoiSchema } from 'joi';
import type { Struct as SuperstructSchema } from 'superstruct';
import type { ComputedRef, DeepReadonly, Ref } from 'vue';
import type { ObjectSchema as YupObjectSchema } from 'yup';
import type { GetObjectField } from './type.utils';

export interface Form<T extends object> {
  validate: (opts?: {
    name?: keyof T | Array<keyof T>;
    silent?: boolean;
    nested?: boolean;
    transform?: boolean;
  }) => Promise<T | false>;
  clear: (path?: string) => void;
  errors: Ref<Array<FormError>>;
  setErrors: (errs: Array<FormError>, name?: keyof T) => void;
  getErrors: (name?: keyof T) => Array<FormError>;
  submit: () => Promise<void>;
  disabled: ComputedRef<boolean>;
  dirty: ComputedRef<boolean>;

  dirtyFields: DeepReadonly<Set<keyof T>>;
  touchedFields: DeepReadonly<Set<keyof T>>;
  blurredFields: DeepReadonly<Set<keyof T>>;
}

export type FormSchema<T extends object> =
  | YupObjectSchema<T>
  | JoiSchema<T>
  | SuperstructSchema<any, any>
  | StandardSchemaV1;

export type FormInputEvents = 'input' | 'blur' | 'change' | 'focus';

export interface FormError<P extends string = string> {
  name?: P;
  message: string;
}

export interface FormErrorWithId extends FormError {
  id?: string;
}

export type FormSubmitEvent<T> = SubmitEvent & { data: T };

export interface FormValidationError {
  errors: Array<FormErrorWithId>;
  children?: Array<FormValidationError>;
}

export type FormErrorEvent = SubmitEvent & FormValidationError;

export interface FormChildAttachEvent {
  type: 'attach';
  formId: string | number;
  validate: Form<any>['validate'];
}

export interface FormChildDetachEvent {
  type: 'detach';
  formId: string | number;
}

export interface FormInputEvent<T extends object> {
  type: FormInputEvents;
  name: keyof T;
  eager?: boolean;
}

export type FormEvent<T extends object> =
  | FormInputEvent<T>
  | FormChildAttachEvent
  | FormChildDetachEvent;

export interface FormInjectedOptions {
  disabled?: boolean;
  validateOnInputDelay?: number;
}

export interface FormFieldInjectedOptions<T> {
  name?: string;
  size?: GetObjectField<T, 'size'>;
  error?: string | boolean;
  eagerValidation?: boolean;
  validateOnInputDelay?: number;
  errorPattern?: RegExp;
  hint?: string;
  description?: string;
  help?: string;
  ariaId: string;
}

export interface ValidateReturnSchema<T> {
  result: T;
  errors: Array<FormError> | null;
}

export class FormValidationException extends Error {
  formId: string | number;
  errors: Array<FormErrorWithId>;
  children?: Array<FormValidationException>;

  constructor(formId: string | number, errors: Array<FormErrorWithId>, childErrors?: Array<FormValidationException>) {
    super('Form validation exception');
    this.formId = formId;
    this.errors = errors;
    this.children = childErrors;
    Object.setPrototypeOf(this, FormValidationException.prototype);
  }
}
