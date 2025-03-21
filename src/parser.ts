// eslint-disable-next-line import/no-cycle
import type { Options } from './unserialize'
import { arrayBufferToString, BufferEncoding } from './bufferUtils';

export type ParserType =
  | 'null'
  | 'int'
  | 'float'
  | 'boolean'
  | 'string'
  | 'array-object'
  | 'serializable-class'
  | 'notserializable-class'

const PARSER_TYPES: Record<string, ParserType> = {
  N: 'null',
  i: 'int',
  d: 'float',
  b: 'boolean',
  s: 'string',
  a: 'array-object',
  C: 'serializable-class',
  O: 'notserializable-class',
}

export default class Parser {
  index: number
  contents: ArrayBuffer
  view: DataView
  options: Options
  constructor(contents: ArrayBuffer, index: number, options: Options) {
    this.contents = contents
    this.index = index
    this.options = options
    this.view = new DataView(contents)
  }
  error(message = 'Syntax Error') {
    return new Error(`${message} at index ${this.index} while unserializing payload`)
  }
  advance(index: number) {
    this.index += index
  }
  readAhead(index: number): string {
    const slice = new Uint8Array(this.contents.slice(this.index, this.index + index));
    const result = arrayBufferToString(slice, this.options.encoding);
    this.index += index;
    return result;
  }
  readUntil(expected: string): string {
    const array = new Uint8Array(this.contents);
    let foundIndex = -1;

    // Search for the expected string's first byte
    for (let i = this.index; i < array.length; i++) {
      if (array[i] === expected.charCodeAt(0)) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex === -1) {
      throw this.error(`Expected '${expected}'`);
    }

    const result = this.readAhead(foundIndex - this.index);
    return result;
  }
  peekAhead(index: number): string {
    const slice = new Uint8Array(this.contents.slice(this.index, this.index + index));
    return arrayBufferToString(slice, this.options.encoding);
  }
  seekExpected(contents: string) {
    const slice = this.readAhead(contents.length)
    if (slice !== contents) {
      this.index -= contents.length
      throw this.error(`Expected '${contents}'`)
    }
  }
  getType(): ParserType {
    const [type, ps] = this.readAhead(2)
    const parserType = PARSER_TYPES[type]

    if (!parserType) {
      throw this.error('Unknown type')
    }
    if (parserType === 'null' ? ps !== ';' : ps !== ':') {
      throw this.error()
    }
    return parserType
  }
  getLength(): number {
    const length = Number.parseInt(this.readUntil(':'), 10)
    if (Number.isNaN(length)) {
      throw this.error()
    }
    return length
  }
  getByLength<T>(startSequence: string, endSequence: string, callback: (length: number) => T): T {
    const length = this.getLength()
    this.seekExpected(`:${startSequence}`)
    const result = callback(length)
    this.seekExpected(endSequence)

    return result
  }
}
