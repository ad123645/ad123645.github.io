import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { N0_RECORDS } from './n0';
import { N1_RECORDS } from './n1';
import { N2_RECORDS } from './n2';
import { N3_RECORDS } from './n3';
import { N4_RECORDS } from './n4';
import { N5_RECORDS } from './n5';
import { N6_RECORDS } from './n6';
import { N7_RECORDS } from './n7';
import { N8_RECORDS } from './n8';
import { N91_RECORDS } from './n91';
import { N93_RECORDS } from './n93';
import { N94_RECORDS } from './n94';
import { N99_RECORDS } from './n99';

const N_ROOT_RECORD: CatalogSourceRecord = ["N", "自然科学总论", null, ["N0", "N1", "N2", "N3", "N4", "N5", "N6", "[N7]", "N8", "N91", "N93", "N94", "[N99]"]];

const N_RECORDS: CatalogSourceRecord[] = [
  N_ROOT_RECORD,
  ...N0_RECORDS,
  ...N1_RECORDS,
  ...N2_RECORDS,
  ...N3_RECORDS,
  ...N4_RECORDS,
  ...N5_RECORDS,
  ...N6_RECORDS,
  ...N7_RECORDS,
  ...N8_RECORDS,
  ...N91_RECORDS,
  ...N93_RECORDS,
  ...N94_RECORDS,
  ...N99_RECORDS,
];

export const N_BRANCH = buildCatalogRoot(N_RECORDS, "N");
