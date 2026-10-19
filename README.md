# @asahskill/uuid

Generator UUID v4 dan v7 tanpa dependensi runtime untuk Bun, Node.js, dan Cloudflare Workers. Branch `v4` menggunakan v4 sebagai default. `main` serta `v7` menggunakan v7 sebagai default. Kedua versi tetap tersedia sebagai named exports di semua branch.

UUID v7 menyimpan waktu Unix dalam milidetik pada 48 bit pertama; untuk panggilan di proses yang sama, nilainya terurut secara leksikografis, termasuk ketika jam mundur. UUID v4 mengambil 122 bit acak. Keduanya memakai `crypto.getRandomValues` yang aman; tidak ada fallback ke `Math.random`.

## Instalasi

Gunakan branch dari GitHub sebelum paket diterbitkan ke npm:

```sh
pnpm add git+https://github.com/asahskill/uuid.git#v4
bun add git+https://github.com/asahskill/uuid.git#v4
npm install git+https://github.com/asahskill/uuid.git#v4
```

Ganti `#v4` dengan `#v7` atau `#main` untuk default v7. Untuk build yang dapat diulang, kunci ke commit SHA. Setelah rilis npm tersedia, gunakan `pnpm add @asahskill/uuid` (atau `bun add`/`npm install`).

## Library

```js
import generate, { v4, v7 } from '@asahskill/uuid';

const id = generate(); // v4 pada v4, v7 pada main/v7
const randomId = v4();
const orderedId = v7();
```

CommonJS pada Node.js:

```js
const { generate, v4, v7 } = require('@asahskill/uuid');
```

ESM menggunakan Web Crypto dan tidak mengimpor modul bawaan Node.js, sehingga bisa dibundel ke Cloudflare Workers. API sinkron; tidak memerlukan proses server atau penyimpanan. Contoh Worker:

```js
import { v7 } from '@asahskill/uuid';

export default {
  fetch() {
    return Response.json({ id: v7() });
  },
};
```

Di Docker, gunakan image Node.js 20+ atau Bun dan instal dependensi seperti biasa. State v7 berlaku per proses/isolate; urutan global antar instance tidak dijamin, meskipun timestamp tetap berada di bagian depan. Jika jam proses mundur, timestamp logis dapat sementara lebih maju dari jam sebenarnya.

## CLI

```sh
pnpm exec uuid-gen             # satu v4 pada v4
pnpm exec uuid-gen --v4 -n 5   # lima v4
bunx uuid-gen --v7 --count 3
```

`--count` dibatasi 1 sampai 100000. Perintah mencetak satu UUID per baris.

## Pengembangan dan rilis

```sh
pnpm install
pnpm check
pnpm pack
```

CI menguji Node.js 20, 22, 24, dan Bun pada push ke `main`, `v4`, `v7`, serta pull request. Tag semver `v0.1.0` pada commit yang ada di `main` membuat GitHub Release setelah verifikasi. Jika secret `NPM_TOKEN` tersedia dan versi di `package.json` sesuai tag, workflow juga menerbitkan paket publik ke npm. Siapkan akses publish `@asahskill/uuid` pada npm terlebih dahulu; tanpa token, rilis GitHub tetap berjalan. Jangan gunakan nama tag versi UUID sebagai versi paket.

## Lisensi

MIT.
