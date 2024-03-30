import { TDrugPermissionData } from './drug_permission';
import { TPillRecognitionData } from './pill_recognition';

export type TImageSearchParam = {
  base64: string;
};

export type TPillDetailSearchParam = Pick<TPillRecognitionData, 'ITEM_SEQ'>;

export type TSearchQueryWhere = Partial<TPillRecognitionData | TDrugPermissionData>;

export type TSearchQueryOption = { skip: number; limit: number };

export type TDlServerRecogData = {
  PRINT_FRONT?: string;
  PRINT_BACK?: string;
  COLOR_CLASS1?: string;
  COLOR_CLASS2?: string;
  DRUG_SHAPE?: string;
  LINE_FRONT?: string;
  LINE_BACK?: string;
};

export type TDlServerData = { recognization: TDlServerRecogData[] };

export type TDlServerResponse = {
  success: boolean;
  data?: TDlServerData;
  message?: string;
};

export type TMergedPillSearchData = TPillRecognitionData & TDrugPermissionData;
