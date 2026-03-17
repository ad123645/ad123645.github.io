import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { U_9_RECORDS } from './u-9';
import { U1_RECORDS } from './u1';
import { U2_RECORDS } from './u2';
import { U4_RECORDS } from './u4';
import { U6_RECORDS } from './u6';
import { U8_RECORDS } from './u8';

const U_ROOT_RECORD: CatalogSourceRecord = ["U", "交通运输", null, ["[U-9]", "U1", "U2", "U4", "U6", "[U8]"]];

const U_RECORDS: CatalogSourceRecord[] = [
  U_ROOT_RECORD,
  ...U_9_RECORDS,
  ...U1_RECORDS,
  ...U2_RECORDS,
  ...U4_RECORDS,
  ...U6_RECORDS,
  ...U8_RECORDS,
];

export const U_BRANCH = buildCatalogRoot(U_RECORDS, "U");
