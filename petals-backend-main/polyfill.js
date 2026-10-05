import buffer from 'node:buffer';

// Polyfill for SlowBuffer which is removed in Node.js >= 26
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
