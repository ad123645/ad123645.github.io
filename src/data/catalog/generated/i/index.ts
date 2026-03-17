import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { I0_RECORDS } from './i0';
import { I1_RECORDS } from './i1';
import { I2_RECORDS } from './i2';
import { I3_7_RECORDS } from './i3-7';

const I_ROOT_RECORD: CatalogSourceRecord = ["I", "文学", null, ["I0", "I1", "I2", "I3/7"]];

const I_RECORDS: CatalogSourceRecord[] = [
  I_ROOT_RECORD,
  ...I0_RECORDS,
  ...I1_RECORDS,
  ...I2_RECORDS,
  ...I3_7_RECORDS,
];

export const I_BRANCH = buildCatalogRoot(I_RECORDS, "I");
