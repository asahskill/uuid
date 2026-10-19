import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { generateUuid, generateUuids } from "../src/index.js";

const cliPath = fileURLToPath(new URL("../src/cli.js", import.meta.url));
const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("generateUuid returns a valid UUID v4", () => {
  assert.match(generateUuid(), uuidV4Pattern);
});

test("generateUuids returns the requested number of UUIDs", () => {
  const uuids = generateUuids(5);

  assert.equal(uuids.length, 5);
  assert.equal(new Set(uuids).size, 5);
  assert.ok(uuids.every((uuid) => uuidV4Pattern.test(uuid)));
});

test("generateUuids rejects invalid counts", () => {
  for (const count of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => generateUuids(count), RangeError);
  }
});

test("CLI prints the requested number of UUIDs", () => {
  const result = spawnSync(process.execPath, [cliPath, "--count", "3"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const uuids = result.stdout.trim().split("\n");
  assert.equal(uuids.length, 3);
  assert.ok(uuids.every((uuid) => uuidV4Pattern.test(uuid)));
});

test("CLI rejects invalid counts", () => {
  const result = spawnSync(process.execPath, [cliPath, "--count", "0"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /positive safe integer/);
});
