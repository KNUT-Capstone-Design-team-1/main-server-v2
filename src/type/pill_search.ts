import { TDrugPermissionData } from './drug_permission';
import { TPillRecognitionData } from './pill_recognition';

type TImageSearchParam = {
  base64: string;
};

type TPillDetailSearchParam = Pick<TPillRecognitionData, 'ITEM_SEQ'>;

type TSearchQueryWhere = Partial<TPillRecognitionData | TDrugPermissionData>;

type TSearchQueryOption = { skip: number; limit: number };

type TDlServerRecogData = {
  PRINT_FRONT?: string;
  PRINT_BACK?: string;
  COLOR_CLASS1?: string;
  COLOR_CLASS2?: string;
  DRUG_SHAPE?: string;
  LINE_FRONT?: string;
  LINE_BACK?: string;
};

type TDlServerResponse = {
  success: boolean;
  data?: TDlServerRecogData[];
  message?: string;
};

type TMergedPillSearchData = TPillRecognitionData & TDrugPermissionData;

export {
  TImageSearchParam,
  TPillDetailSearchParam,
  TSearchQueryWhere,
  TSearchQueryOption,
  TDlServerRecogData,
  TDlServerResponse,
  TMergedPillSearchData,
};
