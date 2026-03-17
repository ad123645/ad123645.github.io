import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { Q_0_RECORDS } from './q-0';
import { Q_1_RECORDS } from './q-1';
import { Q_3_RECORDS } from './q-3';
import { Q_4_RECORDS } from './q-4';
import { Q_9_RECORDS } from './q-9';
import { Q1_RECORDS } from './q1';
import { Q2_RECORDS } from './q2';
import { Q3_RECORDS } from './q3';
import { Q4_RECORDS } from './q4';
import { Q5_RECORDS } from './q5';
import { Q6_RECORDS } from './q6';
import { Q7_RECORDS } from './q7';
import { Q81_RECORDS } from './q81';
import { Q89_RECORDS } from './q89';
import { Q91_RECORDS } from './q91';
import { Q93_RECORDS } from './q93';
import { Q94_RECORDS } from './q94';
import { Q95_RECORDS } from './q95';
import { Q96_RECORDS } from './q96';
import { Q98_RECORDS } from './q98';

const Q_ROOT_RECORD: CatalogSourceRecord = ["Q", "生物科学", null, ["Q-0", "Q-1", "Q-3", "Q-4", "Q-9", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q81", "[Q89]", "Q91", "Q93", "Q94", "Q95", "Q96", "Q98"]];

const Q_RECORDS: CatalogSourceRecord[] = [
  Q_ROOT_RECORD,
  ...Q_0_RECORDS,
  ...Q_1_RECORDS,
  ...Q_3_RECORDS,
  ...Q_4_RECORDS,
  ...Q_9_RECORDS,
  ...Q1_RECORDS,
  ...Q2_RECORDS,
  ...Q3_RECORDS,
  ...Q4_RECORDS,
  ...Q5_RECORDS,
  ...Q6_RECORDS,
  ...Q7_RECORDS,
  ...Q81_RECORDS,
  ...Q89_RECORDS,
  ...Q91_RECORDS,
  ...Q93_RECORDS,
  ...Q94_RECORDS,
  ...Q95_RECORDS,
  ...Q96_RECORDS,
  ...Q98_RECORDS,
];

export const Q_BRANCH = buildCatalogRoot(Q_RECORDS, "Q");
