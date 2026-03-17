import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { E0_RECORDS } from './e0';
import { E1_RECORDS } from './e1';
import { E2_RECORDS } from './e2';
import { E3_7_RECORDS } from './e3-7';
import { E8_RECORDS } from './e8';
import { E9_RECORDS } from './e9';
import { E99_RECORDS } from './e99';

const E_ROOT_RECORD: CatalogSourceRecord = ["E", "军事", null, ["E0", "E1", "E2", "E3/7", "E8", "E9", "E99"]];

const E_RECORDS: CatalogSourceRecord[] = [
  E_ROOT_RECORD,
  ...E0_RECORDS,
  ...E1_RECORDS,
  ...E2_RECORDS,
  ...E3_7_RECORDS,
  ...E8_RECORDS,
  ...E9_RECORDS,
  ...E99_RECORDS,
];

export const E_BRANCH = buildCatalogRoot(E_RECORDS, "E");
