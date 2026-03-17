import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { S_0_RECORDS } from './s-0';
import { S_1_RECORDS } from './s-1';
import { S_3_RECORDS } from './s-3';
import { S_9_RECORDS } from './s-9';
import { S1_RECORDS } from './s1';
import { S2_RECORDS } from './s2';
import { S3_RECORDS } from './s3';
import { S4_RECORDS } from './s4';
import { S5_RECORDS } from './s5';
import { S6_RECORDS } from './s6';
import { S7_RECORDS } from './s7';
import { S8_RECORDS } from './s8';
import { S9_RECORDS } from './s9';

const S_ROOT_RECORD: CatalogSourceRecord = ["S", "农业科学", null, ["S-0", "S-1", "S-3", "[S-9]", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9"]];

const S_RECORDS: CatalogSourceRecord[] = [
  S_ROOT_RECORD,
  ...S_0_RECORDS,
  ...S_1_RECORDS,
  ...S_3_RECORDS,
  ...S_9_RECORDS,
  ...S1_RECORDS,
  ...S2_RECORDS,
  ...S3_RECORDS,
  ...S4_RECORDS,
  ...S5_RECORDS,
  ...S6_RECORDS,
  ...S7_RECORDS,
  ...S8_RECORDS,
  ...S9_RECORDS,
];

export const S_BRANCH = buildCatalogRoot(S_RECORDS, "S");
