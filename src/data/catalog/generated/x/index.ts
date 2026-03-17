import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { X_0_RECORDS } from './x-0';
import { X_1_RECORDS } from './x-1';
import { X_4_RECORDS } from './x-4';
import { X_6_RECORDS } from './x-6';
import { X1_RECORDS } from './x1';
import { X2_RECORDS } from './x2';
import { X3_RECORDS } from './x3';
import { X4_RECORDS } from './x4';
import { X5_RECORDS } from './x5';
import { X7_RECORDS } from './x7';
import { X8_RECORDS } from './x8';
import { X9_RECORDS } from './x9';

const X_ROOT_RECORD: CatalogSourceRecord = ["X", "环境科学、安全科学", null, ["X-0", "X-1", "X-4", "X-6", "X1", "X2", "X3", "X4", "X5", "X7", "X8", "X9"]];

const X_RECORDS: CatalogSourceRecord[] = [
  X_ROOT_RECORD,
  ...X_0_RECORDS,
  ...X_1_RECORDS,
  ...X_4_RECORDS,
  ...X_6_RECORDS,
  ...X1_RECORDS,
  ...X2_RECORDS,
  ...X3_RECORDS,
  ...X4_RECORDS,
  ...X5_RECORDS,
  ...X7_RECORDS,
  ...X8_RECORDS,
  ...X9_RECORDS,
];

export const X_BRANCH = buildCatalogRoot(X_RECORDS, "X");
