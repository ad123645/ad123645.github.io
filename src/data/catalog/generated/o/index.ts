import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { O1_RECORDS } from './o1';
import { O3_RECORDS } from './o3';
import { O4_RECORDS } from './o4';
import { O6_RECORDS } from './o6';
import { O7_RECORDS } from './o7';

const O_ROOT_RECORD: CatalogSourceRecord = ["O", "数理科学和化学", null, ["O1", "O3", "O4", "O6", "O7"]];

const O_RECORDS: CatalogSourceRecord[] = [
  O_ROOT_RECORD,
  ...O1_RECORDS,
  ...O3_RECORDS,
  ...O4_RECORDS,
  ...O6_RECORDS,
  ...O7_RECORDS,
];

export const O_BRANCH = buildCatalogRoot(O_RECORDS, "O");
