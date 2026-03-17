import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { K0_RECORDS } from './k0';
import { K1_RECORDS } from './k1';
import { K2_RECORDS } from './k2';
import { K3_RECORDS } from './k3';
import { K4_RECORDS } from './k4';
import { K5_RECORDS } from './k5';
import { K6_RECORDS } from './k6';
import { K7_RECORDS } from './k7';
import { K81_RECORDS } from './k81';
import { K85_RECORDS } from './k85';
import { K89_RECORDS } from './k89';
import { K9_RECORDS } from './k9';

const K_ROOT_RECORD: CatalogSourceRecord = ["K", "历史、地理", null, ["K0", "K1", "K2", "K3", "K4", "K5", "K6", "K7", "K81", "K85", "K89", "K9"]];

const K_RECORDS: CatalogSourceRecord[] = [
  K_ROOT_RECORD,
  ...K0_RECORDS,
  ...K1_RECORDS,
  ...K2_RECORDS,
  ...K3_RECORDS,
  ...K4_RECORDS,
  ...K5_RECORDS,
  ...K6_RECORDS,
  ...K7_RECORDS,
  ...K81_RECORDS,
  ...K85_RECORDS,
  ...K89_RECORDS,
  ...K9_RECORDS,
];

export const K_BRANCH = buildCatalogRoot(K_RECORDS, "K");
