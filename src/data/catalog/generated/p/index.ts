import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { P1_RECORDS } from './p1';
import { P2_RECORDS } from './p2';
import { P3_RECORDS } from './p3';
import { P4_RECORDS } from './p4';
import { P5_RECORDS } from './p5';
import { P7_RECORDS } from './p7';
import { P9_RECORDS } from './p9';

const P_ROOT_RECORD: CatalogSourceRecord = ["P", "天文学、地球科学", null, ["P1", "P2", "P3", "P4", "P5", "P7", "P9"]];

const P_RECORDS: CatalogSourceRecord[] = [
  P_ROOT_RECORD,
  ...P1_RECORDS,
  ...P2_RECORDS,
  ...P3_RECORDS,
  ...P4_RECORDS,
  ...P5_RECORDS,
  ...P7_RECORDS,
  ...P9_RECORDS,
];

export const P_BRANCH = buildCatalogRoot(P_RECORDS, "P");
