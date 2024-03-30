export type TPillPermissionDetailData = {
  ITEM_SEQ: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  ITEM_PERMIT_DATE: string;
  CNSGN_MANUF: string;
  ETC_OTC_CODE: string;
  CHART: string;
  BAR_CODE: string;
  MATERIAL_NAME: string;
  EE_DOC_ID: string;
  UD_DOC_ID: string;
  NB_DOC_ID: string;
  INSERT_FILE: string;
  STORAGE_METHOD: string;
  VALID_TERM: string;
  REEXAM_TARGET: string;
  REEXAM_DATE: string;
  PACK_UNIT: string;
  EDI_CODE: string;
  DOC_TEXT: string;
  PERMIT_KIND_NAME: string;
  ENTP_NO: string;
  MAKE_MATERIAL_FLAG: string;
  NEWDRUG_CLASS_NAME: string;
  INDUTY_TYPE: string;
  CANCEL_DATE: string;
  CANCEL_NAME: string;
  CHANGE_DATE: string;
  NARCOTIC_KIND_CODE: string;
  GBN_NAME: string;
  TOTAL_CONTENT: string;
  EE_DOC_DATA: string;
  UD_DOC_DATA: string;
  NB_DOC_DATA: string;
  PN_DOC_DATA: string;
  MAIN_ITEM_INGR: string;
  INGR_NAME: string;
  ATC_CODE: string;
  ITEM_ENG_NAME: string;
  ENTP_ENG_NAME: string;
  MAIN_INGR_NAME: string;
  BOZRNO: string;
};

export type TPillPermissionDetailHeader = { resultCode: string; resultMsg: string };

export type TPillPermissionDetailApiRes = {
  header: TPillPermissionDetailHeader;
  body: {
    pageNo: number;
    totalCount: number;
    numOfRows: number;
    items: TPillPermissionDetailData[];
  };
};
