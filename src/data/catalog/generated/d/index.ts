import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { D0_RECORDS } from './d0';
import { D1_RECORDS } from './d1';
import { D2_RECORDS } from './d2';
import { D33_37_RECORDS } from './d33-37';
import { D4_RECORDS } from './d4';
import { D5_RECORDS } from './d5';
import { D6_RECORDS } from './d6';
import { D73_77_RECORDS } from './d73-77';
import { D8_RECORDS } from './d8';
import { D9_RECORDS } from './d9';
import { DF_RECORDS } from './df';

const D_ROOT_RECORD: CatalogSourceRecord = ["D", "政治、法律", null, ["D0", "D1", "D2", "D33/37", "D4", "D5", "D6", "D73/77", "D8", "D9", "DF"]];

const D_RECORDS: CatalogSourceRecord[] = [
  D_ROOT_RECORD,
  ...D0_RECORDS,
  ...D1_RECORDS,
  ...D2_RECORDS,
  ...D33_37_RECORDS,
  ...D4_RECORDS,
  ...D5_RECORDS,
  ...D6_RECORDS,
  ...D73_77_RECORDS,
  ...D8_RECORDS,
  ...D9_RECORDS,
  ...DF_RECORDS,
];

export const D_BRANCH = buildCatalogRoot(D_RECORDS, "D");
