import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { V1_RECORDS } from './v1';
import { V2_RECORDS } from './v2';
import { V4_RECORDS } from './v4';
import { V7_RECORDS } from './v7';

const V_ROOT_RECORD: CatalogSourceRecord = ["V", "航空、航天", null, ["V1", "V2", "V4", "[V7]"]];

const V_RECORDS: CatalogSourceRecord[] = [
  V_ROOT_RECORD,
  ...V1_RECORDS,
  ...V2_RECORDS,
  ...V4_RECORDS,
  ...V7_RECORDS,
];

export const V_BRANCH = buildCatalogRoot(V_RECORDS, "V");
