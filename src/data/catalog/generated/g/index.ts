import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { G0_RECORDS } from './g0';
import { G1_RECORDS } from './g1';
import { G2_RECORDS } from './g2';
import { G3_RECORDS } from './g3';
import { G4_RECORDS } from './g4';
import { G8_RECORDS } from './g8';

const G_ROOT_RECORD: CatalogSourceRecord = ["G", "文化、科学、教育、体育", null, ["G0", "G1", "G2", "G3", "G4", "G8"]];

const G_RECORDS: CatalogSourceRecord[] = [
  G_ROOT_RECORD,
  ...G0_RECORDS,
  ...G1_RECORDS,
  ...G2_RECORDS,
  ...G3_RECORDS,
  ...G4_RECORDS,
  ...G8_RECORDS,
];

export const G_BRANCH = buildCatalogRoot(G_RECORDS, "G");
