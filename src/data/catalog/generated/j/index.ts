import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { J0_RECORDS } from './j0';
import { J1_RECORDS } from './j1';
import { J2_RECORDS } from './j2';
import { J29_RECORDS } from './j29';
import { J3_RECORDS } from './j3';
import { J4_RECORDS } from './j4';
import { J5_RECORDS } from './j5';
import { J59_RECORDS } from './j59';
import { J6_RECORDS } from './j6';
import { J7_RECORDS } from './j7';
import { J8_RECORDS } from './j8';
import { J9_RECORDS } from './j9';

const J_ROOT_RECORD: CatalogSourceRecord = ["J", "艺术", null, ["J0", "J1", "J2", "J29", "J3", "J4", "J5", "[J59]", "J6", "J7", "J8", "J9"]];

const J_RECORDS: CatalogSourceRecord[] = [
  J_ROOT_RECORD,
  ...J0_RECORDS,
  ...J1_RECORDS,
  ...J2_RECORDS,
  ...J29_RECORDS,
  ...J3_RECORDS,
  ...J4_RECORDS,
  ...J5_RECORDS,
  ...J59_RECORDS,
  ...J6_RECORDS,
  ...J7_RECORDS,
  ...J8_RECORDS,
  ...J9_RECORDS,
];

export const J_BRANCH = buildCatalogRoot(J_RECORDS, "J");
