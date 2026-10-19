# UUID Generator

CLI sederhana untuk membuat UUID v4. Project ini tidak memakai dependency tambahan dan bisa dijalankan dengan Bun atau Node.js, termasuk melalui pnpm.

## Persyaratan

- Node.js 18 atau lebih baru, atau Bun versi terbaru.
- pnpm jika ingin menjalankan melalui pnpm.

## Menjalankan

```sh
# Bun
bun run src/cli.js
bun run src/cli.js --count 5

# Node.js
node src/cli.js
node src/cli.js -n 5

# pnpm
pnpm install
pnpm start
pnpm start --count 5
```

Setiap UUID dicetak pada baris tersendiri. Opsi `-n` atau `--count` menerima bilangan bulat positif; jika tidak diberikan, program menghasilkan satu UUID.

## Menjalankan tes

```sh
node --test
```

## Menggunakan sebagai modul

```js
import { generateUuid, generateUuids } from "./src/index.js";

console.log(generateUuid());
console.log(generateUuids(3));
```
