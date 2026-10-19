const hex = Array.from({ length: 256 }, (_, n) => n.toString(16).padStart(2, '0'));
const MAX_TIME = 0xffffffffffff;
const MAX_SEQUENCE = (1n << 74n) - 1n;
let lastTime = -1;
let sequence = 0n;

function randomBytes(size) {
  const bytes = new Uint8Array(size);
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure crypto.getRandomValues is required to generate UUIDs');
  }
  return globalThis.crypto.getRandomValues(bytes);
}

function format(bytes) {
  return `${hex[bytes[0]]}${hex[bytes[1]]}${hex[bytes[2]]}${hex[bytes[3]]}-${hex[bytes[4]]}${hex[bytes[5]]}-${hex[bytes[6]]}${hex[bytes[7]]}-${hex[bytes[8]]}${hex[bytes[9]]}-${hex[bytes[10]]}${hex[bytes[11]]}${hex[bytes[12]]}${hex[bytes[13]]}${hex[bytes[14]]}${hex[bytes[15]]}`;
}

export function v4() {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return format(bytes);
}

export function v7() {
  let time = Date.now();
  if (!Number.isSafeInteger(time) || time < 0 || time > MAX_TIME) {
    throw new RangeError('Current time is outside the UUID v7 timestamp range');
  }

  if (time > lastTime) {
    const random = randomBytes(10);
    sequence = 0n;
    for (const byte of random) sequence = (sequence << 8n) | BigInt(byte);
    sequence &= MAX_SEQUENCE;
  } else {
    time = lastTime;
    if (sequence === MAX_SEQUENCE) {
      if (time === MAX_TIME) throw new RangeError('UUID v7 timestamp exhausted');
      time += 1;
      const random = randomBytes(10);
      sequence = 0n;
      for (const byte of random) sequence = (sequence << 8n) | BigInt(byte);
      sequence &= MAX_SEQUENCE;
    } else {
      sequence += 1n;
    }
  }
  lastTime = time;

  const bytes = new Uint8Array(16);
  for (let i = 5; i >= 0; i--) {
    bytes[i] = time & 0xff;
    time = Math.floor(time / 256);
  }
  let value = sequence;
  for (let i = 15; i >= 9; i--) {
    bytes[i] = Number(value & 0xffn);
    value >>= 8n;
  }
  bytes[8] = 0x80 | Number(value & 0x3fn);
  value >>= 6n;
  bytes[7] = Number(value & 0xffn);
  value >>= 8n;
  bytes[6] = 0x70 | Number(value & 0x0fn);
  return format(bytes);
}

export const generate = v7;
export default generate;
