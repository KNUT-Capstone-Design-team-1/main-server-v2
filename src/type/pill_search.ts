import { TDrugPermissionData } from './drug_permission';
import { TPillRecognitionData } from './pill_recognition';

type TImageSearchParam = {
  base64Url: string;
};

type TPillDetailSearchParam = Pick<TPillRecognitionData, 'ITEM_SEQ'>;

type TSearchQueryWhere = Partial<TPillRecognitionData | TDrugPermissionData>;

type TSearchQueryOption = { skip: number; limit: number };

type TDlServerRecogData = {
  print: string;
  chartin: string;
  drug_shape: string;
  color_class: string;
  line_front: string;
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
