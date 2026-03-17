import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { A1_RECORDS } from './a1';
import { A2_RECORDS } from './a2';
import { A3_RECORDS } from './a3';
import { A4_RECORDS } from './a4';
import { A49_RECORDS } from './a49';
import { A5_RECORDS } from './a5';
import { A7_RECORDS } from './a7';
import { A8_RECORDS } from './a8';

const A_ROOT_RECORD: CatalogSourceRecord = ["A", "马克思主义、列宁主义、毛泽东思想、邓小平理论", null, ["A1", "A2", "A3", "A4", "A49", "A5", "A7", "A8"]];

const A_RECORDS: CatalogSourceRecord[] = [
  A_ROOT_RECORD,
  ...A1_RECORDS,
  ...A2_RECORDS,
  ...A3_RECORDS,
  ...A4_RECORDS,
  ...A49_RECORDS,
  ...A5_RECORDS,
  ...A7_RECORDS,
  ...A8_RECORDS,
];

export const A_BRANCH = buildCatalogRoot(A_RECORDS, "A");
