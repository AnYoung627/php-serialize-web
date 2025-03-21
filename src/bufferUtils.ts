export type BufferEncoding = 'utf8' | 'ascii' | 'utf-16' | 'ucs2' | 'base64' | 'latin1' | 'binary' | 'hex';

export function stringToArrayBuffer(str: string, encoding: BufferEncoding = 'utf8'): ArrayBuffer {
    // For now we'll focus on UTF-8 as the main encoding
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
}

export function arrayBufferToString(buffer: ArrayBuffer, encoding: BufferEncoding = 'utf8'): string {
    // For now we'll focus on UTF-8 as the main encoding
    const decoder = new TextDecoder(encoding);
    return decoder.decode(new Uint8Array(buffer));
}

export function getByteLength(str: string, encoding: BufferEncoding = 'utf8'): number {
    const encoder = new TextEncoder();
    return encoder.encode(str).length;
} 