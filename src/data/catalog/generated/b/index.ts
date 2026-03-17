import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { B_4_RECORDS } from './b-4';
import { B0_RECORDS } from './b0';
import { B1_RECORDS } from './b1';
import { B2_RECORDS } from './b2';
import { B3_RECORDS } from './b3';
import { B4_RECORDS } from './b4';
import { B5_RECORDS } from './b5';
import { B6_RECORDS } from './b6';
import { B7_RECORDS } from './b7';
import { B80_RECORDS } from './b80';
import { B81_RECORDS } from './b81';
import { B82_RECORDS } from './b82';
import { B83_RECORDS } from './b83';
import { B84_RECORDS } from './b84';
import { B9_RECORDS } from './b9';

const B_ROOT_RECORD: CatalogSourceRecord = ["B", "哲学、宗教", null, ["B-4", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B80", "B81", "B82", "B83", "B84", "B9"]];

const B_RECORDS: CatalogSourceRecord[] = [
  B_ROOT_RECORD,
  ...B_4_RECORDS,
  ...B0_RECORDS,
  ...B1_RECORDS,
  ...B2_RECORDS,
  ...B3_RECORDS,
  ...B4_RECORDS,
  ...B5_RECORDS,
  ...B6_RECORDS,
  ...B7_RECORDS,
  ...B80_RECORDS,
  ...B81_RECORDS,
  ...B82_RECORDS,
  ...B83_RECORDS,
  ...B84_RECORDS,
  ...B9_RECORDS,
];

export const B_BRANCH = buildCatalogRoot(B_RECORDS, "B");
