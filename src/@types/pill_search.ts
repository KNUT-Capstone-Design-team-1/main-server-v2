import { TDrugPermissionData } from './drug_permission';
import { TPillRecognitionData } from './pill_recognition';

export type TImageSearchParam = {
  base64: string;
};

export type TPillDetailSearchParam = Pick<TPillRecognitionData, 'ITEM_SEQ'>;

export type TPillSearchParam = {
  ITEM_SEQ: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  COLOR_CLASS1: string;
  COLOR_CLASS2: string;
  PRINT_FRONT: string;
  PRINT_BACK: string;
  LINE_FRONT: string;
  LINE_BACK: string;
  CHARTIN: string;
  DRUG_SHAPE: string[];
};

export type TSearchQueryOption = { skip: number; limit: number };

export type TDlServerData = Array<TPillSearchParam>;

export type TDlServerResponse = {
  success: boolean;
  data?: TDlServerData;
  message?: string;
};

export type TMergedPillSearchData = TPillRecognitionData & TDrugPermissionData;

export type TPillSearchQueryFilters = Array<Record<string, any>>;

export type TPillSearchInQueryFilters = Record<string, { $in: string[] }>[];
