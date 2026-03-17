import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { H0_RECORDS } from './h0';
import { H1_RECORDS } from './h1';
import { H2_RECORDS } from './h2';
import { H3_RECORDS } from './h3';
import { H4_RECORDS } from './h4';
import { H5_RECORDS } from './h5';
import { H61_RECORDS } from './h61';
import { H62_RECORDS } from './h62';
import { H63_RECORDS } from './h63';
import { H64_RECORDS } from './h64';
import { H65_RECORDS } from './h65';
import { H66_RECORDS } from './h66';
import { H67_RECORDS } from './h67';
import { H7_RECORDS } from './h7';
import { H81_RECORDS } from './h81';
import { H83_RECORDS } from './h83';
import { H84_RECORDS } from './h84';
import { H9_RECORDS } from './h9';

const H_ROOT_RECORD: CatalogSourceRecord = ["H", "语言、文字", null, ["H0", "H1", "H2", "H3", "H4", "H5", "H61", "H62", "H63", "H64", "H65", "H66", "H67", "H7", "H81", "H83", "H84", "H9"]];

const H_RECORDS: CatalogSourceRecord[] = [
  H_ROOT_RECORD,
  ...H0_RECORDS,
  ...H1_RECORDS,
  ...H2_RECORDS,
  ...H3_RECORDS,
  ...H4_RECORDS,
  ...H5_RECORDS,
  ...H61_RECORDS,
  ...H62_RECORDS,
  ...H63_RECORDS,
  ...H64_RECORDS,
  ...H65_RECORDS,
  ...H66_RECORDS,
  ...H67_RECORDS,
  ...H7_RECORDS,
  ...H81_RECORDS,
  ...H83_RECORDS,
  ...H84_RECORDS,
  ...H9_RECORDS,
];

export const H_BRANCH = buildCatalogRoot(H_RECORDS, "H");
