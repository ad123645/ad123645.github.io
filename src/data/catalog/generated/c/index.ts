import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { C0_RECORDS } from './c0';
import { C1_RECORDS } from './c1';
import { C2_RECORDS } from './c2';
import { C3_RECORDS } from './c3';
import { C4_RECORDS } from './c4';
import { C5_RECORDS } from './c5';
import { C6_RECORDS } from './c6';
import { C7_RECORDS } from './c7';
import { C8_RECORDS } from './c8';
import { C91_RECORDS } from './c91';
import { C92_RECORDS } from './c92';
import { C93_RECORDS } from './c93';
import { C94_RECORDS } from './c94';
import { C95_RECORDS } from './c95';
import { C96_RECORDS } from './c96';
import { C97_RECORDS } from './c97';

const C_ROOT_RECORD: CatalogSourceRecord = ["C", "社会科学总论", null, ["C0", "C1", "C2", "C3", "C4", "C5", "C6", "[C7]", "C8", "C91", "C92", "C93", "[C94]", "C95", "C96", "C97"]];

const C_RECORDS: CatalogSourceRecord[] = [
  C_ROOT_RECORD,
  ...C0_RECORDS,
  ...C1_RECORDS,
  ...C2_RECORDS,
  ...C3_RECORDS,
  ...C4_RECORDS,
  ...C5_RECORDS,
  ...C6_RECORDS,
  ...C7_RECORDS,
  ...C8_RECORDS,
  ...C91_RECORDS,
  ...C92_RECORDS,
  ...C93_RECORDS,
  ...C94_RECORDS,
  ...C95_RECORDS,
  ...C96_RECORDS,
  ...C97_RECORDS,
];

export const C_BRANCH = buildCatalogRoot(C_RECORDS, "C");
