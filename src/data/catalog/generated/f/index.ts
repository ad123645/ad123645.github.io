import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { F0_RECORDS } from './f0';
import { F1_RECORDS } from './f1';
import { F2_RECORDS } from './f2';
import { F3_RECORDS } from './f3';
import { F4_RECORDS } from './f4';
import { F49_RECORDS } from './f49';
import { F5_RECORDS } from './f5';
import { F59_RECORDS } from './f59';
import { F6_RECORDS } from './f6';
import { F7_RECORDS } from './f7';
import { F8_RECORDS } from './f8';

const F_ROOT_RECORD: CatalogSourceRecord = ["F", "经济", null, ["F0", "F1", "F2", "F3", "F4", "F49", "F5", "F59", "F6", "F7", "F8"]];

const F_RECORDS: CatalogSourceRecord[] = [
  F_ROOT_RECORD,
  ...F0_RECORDS,
  ...F1_RECORDS,
  ...F2_RECORDS,
  ...F3_RECORDS,
  ...F4_RECORDS,
  ...F49_RECORDS,
  ...F5_RECORDS,
  ...F59_RECORDS,
  ...F6_RECORDS,
  ...F7_RECORDS,
  ...F8_RECORDS,
];

export const F_BRANCH = buildCatalogRoot(F_RECORDS, "F");
