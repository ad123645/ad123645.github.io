import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { R_0_RECORDS } from './r-0';
import { R_1_RECORDS } from './r-1';
import { R_3_RECORDS } from './r-3';
import { R1_RECORDS } from './r1';
import { R2_RECORDS } from './r2';
import { R3_RECORDS } from './r3';
import { R4_RECORDS } from './r4';
import { R5_RECORDS } from './r5';
import { R6_RECORDS } from './r6';
import { R71_RECORDS } from './r71';
import { R72_RECORDS } from './r72';
import { R73_RECORDS } from './r73';
import { R74_RECORDS } from './r74';
import { R75_RECORDS } from './r75';
import { R76_RECORDS } from './r76';
import { R77_RECORDS } from './r77';
import { R78_RECORDS } from './r78';
import { R79_RECORDS } from './r79';
import { R8_RECORDS } from './r8';
import { R9_RECORDS } from './r9';

const R_ROOT_RECORD: CatalogSourceRecord = ["R", "医药、卫生", null, ["R-0", "R-1", "R-3", "R1", "R2", "R3", "R4", "R5", "R6", "R71", "R72", "R73", "R74", "R75", "R76", "R77", "R78", "R79", "R8", "R9"]];

const R_RECORDS: CatalogSourceRecord[] = [
  R_ROOT_RECORD,
  ...R_0_RECORDS,
  ...R_1_RECORDS,
  ...R_3_RECORDS,
  ...R1_RECORDS,
  ...R2_RECORDS,
  ...R3_RECORDS,
  ...R4_RECORDS,
  ...R5_RECORDS,
  ...R6_RECORDS,
  ...R71_RECORDS,
  ...R72_RECORDS,
  ...R73_RECORDS,
  ...R74_RECORDS,
  ...R75_RECORDS,
  ...R76_RECORDS,
  ...R77_RECORDS,
  ...R78_RECORDS,
  ...R79_RECORDS,
  ...R8_RECORDS,
  ...R9_RECORDS,
];

export const R_BRANCH = buildCatalogRoot(R_RECORDS, "R");
