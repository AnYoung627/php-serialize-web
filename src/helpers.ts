// eslint-disable-next-line camelcase,@typescript-eslint/class-name-casing
export class __PHP_Incomplete_Class {
  __PHP_Incomplete_Class_Name: string

  constructor(name: string) {
    this.__PHP_Incomplete_Class_Name = name
  }
}

import { getByteLength as bufferGetByteLength } from './bufferUtils';

export function getByteLength(contents: string, options: { encoding: BufferEncoding }): number {
  return bufferGetByteLength(contents, options.encoding as any);
}

// isInteger = is NOT a float but still a number
export function isInteger(value: any): boolean {
  return typeof value === 'number' && Number.parseInt(value.toString(), 10) === value
}

export function getIncompleteClass(name: string) {
  return new __PHP_Incomplete_Class(name)
}

export function getClass(prototype: Record<string, any>) {
  function PhpClass() {
    // No Op
  }
  PhpClass.prototype = prototype
  return PhpClass
}

/**
 * Ensures that the given {@link value} is truthy, throws an {@link Error} otherwise.
 * @param value the value to check to be truthy.
 * @param message the message of the {@link Error} if the value is falsy.
 */
export function invariant(value: any, message?: string) {
  if (!value) {
    throw new Error(message)
  }
}
