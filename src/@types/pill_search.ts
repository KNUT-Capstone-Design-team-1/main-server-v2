import { TDrugPermissionData } from './drug_permission';
import { TPillRecognitionData } from './pill_recognition';

export type TImageSearchParam = {
  base64: string;
};

export type TPillDetailSearchParam = Pick<TPillRecognitionData, 'ITEM_SEQ'>;

export type TPillSearchQueryWhere = Record<
  keyof TPillRecognitionData | keyof TDrugPermissionData,
  string | string[]
>;

export type TSearchQueryOption = { skip: number; limit: number };

export type TDlServerData = { recognization: TPillSearchQueryWhere[] };

export type TDlServerResponse = {
  success: boolean;
  data?: TDlServerData;
  message?: string;
};

export type TMergedPillSearchData = TPillRecognitionData & TDrugPermissionData;

export type TPillSearchQueryFilters = Array<Record<string, any>>;

export type TPillSearchInQueryFilters = Record<string, { $in: string[] }>[];
