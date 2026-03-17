import type { CatalogSourceRecord } from '../../core';
import { buildCatalogRoot } from '../../core';
import { T_0_RECORDS } from './t-0';
import { T_1_RECORDS } from './t-1';
import { T_2_RECORDS } from './t-2';
import { T_6_RECORDS } from './t-6';
import { T_9_RECORDS } from './t-9';
import { TB_RECORDS } from './tb';
import { TD_RECORDS } from './td';
import { TE_RECORDS } from './te';
import { TF_RECORDS } from './tf';
import { TG_RECORDS } from './tg';
import { TH_RECORDS } from './th';
import { TJ_RECORDS } from './tj';
import { TK_RECORDS } from './tk';
import { TL_RECORDS } from './tl';
import { TM_RECORDS } from './tm';
import { TN_RECORDS } from './tn';
import { TP_RECORDS } from './tp';
import { TQ_RECORDS } from './tq';
import { TS_RECORDS } from './ts';
import { TU_RECORDS } from './tu';
import { TV_RECORDS } from './tv';

const T_ROOT_RECORD: CatalogSourceRecord = ["T", "工业技术", null, ["T-0", "T-1", "T-2", "T-6", "[T-9]", "TB", "TD", "TE", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TP", "TQ", "TS", "TU", "TV"]];

const T_RECORDS: CatalogSourceRecord[] = [
  T_ROOT_RECORD,
  ...T_0_RECORDS,
  ...T_1_RECORDS,
  ...T_2_RECORDS,
  ...T_6_RECORDS,
  ...T_9_RECORDS,
  ...TB_RECORDS,
  ...TD_RECORDS,
  ...TE_RECORDS,
  ...TF_RECORDS,
  ...TG_RECORDS,
  ...TH_RECORDS,
  ...TJ_RECORDS,
  ...TK_RECORDS,
  ...TL_RECORDS,
  ...TM_RECORDS,
  ...TN_RECORDS,
  ...TP_RECORDS,
  ...TQ_RECORDS,
  ...TS_RECORDS,
  ...TU_RECORDS,
  ...TV_RECORDS,
];

export const T_BRANCH = buildCatalogRoot(T_RECORDS, "T");
