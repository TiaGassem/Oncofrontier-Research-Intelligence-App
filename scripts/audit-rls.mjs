// Static audit of the Supabase migrations: every table must have RLS enabled
// and every policy must be anchored to auth.uid() = user_id.
//
// This checks the schema that ships with the repository. It cannot verify the
// live project's policy state — that needs database access (see DEPLOYMENT.md).

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../supabase/migrations/', import.meta.url));
const files = (await readdir(dir)).filter((name) => name.endsWith('.sql')).sort();

if (files.length === 0) {
  console.error(`No migrations found in ${resolve(dir)}`);
  process.exit(1);
}

const sql = (await Promise.all(files.map((name) => readFile(join(dir, name), 'utf8')))).join('\n');

const tables = [
  ...new Set(
    [...sql.matchAll(/create table (?:if not exists )?"?([a-z_][a-z0-9_]*)"?/gi)]
      .map((match) => match[1].toLowerCase())
  ),
];

const rlsEnabled = new Set(
  [...sql.matchAll(/alter table "?([a-z_][a-z0-9_]*)"?\s+enable row level security/gi)]
    .map((match) => match[1].toLowerCase())
);

const policies = [...sql.matchAll(/create policy\s+"([^"]+)"\s+on\s+"?([a-z_][a-z0-9_]*)"?([\s\S]*?);/gi)]
  .map((match) => ({ name: match[1], table: match[2].toLowerCase(), body: match[3] }));

let failures = 0;

for (const table of tables) {
  const own = policies.filter((policy) => policy.table === table);
  // Ownership is proven either directly (auth.uid() = user_id) or through the
  // owning parent row — child tables such as project_items have no user_id and
  // instead check that the parent project belongs to the caller.
  const DIRECT = /auth\.uid\(\)\s*=\s*user_id/i;
  const VIA_PARENT = /exists\s*\(\s*select[\s\S]*?auth\.uid\(\)/i;
  const anchored = own.filter((policy) => DIRECT.test(policy.body) || VIA_PARENT.test(policy.body));
  const ok = rlsEnabled.has(table) && own.length > 0 && anchored.length === own.length;
  if (!ok) failures += 1;
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${table.padEnd(26)} rls=${rlsEnabled.has(table) ? 'on ' : 'OFF'} policies=${own.length} anchored=${anchored.length}`
  );
}

console.log(
  `\n${tables.length} table(s) across ${files.length} migration(s): ${
    failures === 0 ? 'all owner-scoped via auth.uid()' : `${failures} need review`
  }`
);

process.exitCode = failures === 0 ? 0 : 1;
