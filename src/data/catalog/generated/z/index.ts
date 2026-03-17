import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { Z1_RECORDS } from './z1';
import { Z2_RECORDS } from './z2';
import { Z3_RECORDS } from './z3';
import { Z4_RECORDS } from './z4';
import { Z5_RECORDS } from './z5';
import { Z6_RECORDS } from './z6';
import { Z8_RECORDS } from './z8';

const Z_ROOT_RECORD: CatalogSourceRecord = ["Z", "综合性图书", null, ["Z1", "Z2", "Z3", "Z4", "Z5", "Z6", "Z8"]];

const Z_RECORDS: CatalogSourceRecord[] = [
  Z_ROOT_RECORD,
  ...Z1_RECORDS,
  ...Z2_RECORDS,
  ...Z3_RECORDS,
  ...Z4_RECORDS,
  ...Z5_RECORDS,
  ...Z6_RECORDS,
  ...Z8_RECORDS,
];

export const Z_BRANCH = buildCatalogRoot(Z_RECORDS, "Z");
