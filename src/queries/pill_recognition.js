const xlsx = require('read-excel-file/node');
const path = require('path');
const fs = require('fs');
const { logger } = require('../util/logger');
const { PillRecognitionModel } = require('../models/pill_recognition');

/**
 * 엑셀파일을 읽어 알약 식별 정보 업데이트
 */
async function updateRecognitionData() {
  const schema = {
    ITEM_SEQ: { prop: 'ITEM_SEQ', type: String, required: true },
    ITEM_NAME: { prop: 'ITEM_NAME', type: String, required: true },
    ENTP_SEQ: { prop: 'ENTP_SEQ', type: String, required: true },
    ENTP_NAME: { prop: 'ENTP_NAME', type: String, required: true },
    CHARTN: { prop: 'CHARTN', type: String, required: true },
    ITEM_IMAGE: { prop: 'ITEM_IMAGE', type: String, required: true },
    PRINT_FRONT: { prop: 'PRINT_FRONT', type: String },
    PRINT_BACK: { prop: 'PRINT_BACK', type: String },
    COLOR_CLASS1: { prop: 'COLOR_CLASS1', type: String, required: true },
    COLOR_CLASS2: { prop: 'COLOR_CLASS2', type: String },
    LINE_FRONT: { prop: 'LINE_FRONT', type: String },
    LINE_BACK: { prop: 'LINE_BACK', type: String },
    LENG_LONG: { prop: 'LENG_LONG', type: String },
    LENG_SHORT: { prop: 'LENG_SHORT', type: String },
    THICK: { prop: 'THICK', type: String },
    IMG_REGIST_TS: { prop: 'IMG_REGIST_TS', type: String },
    CLASS_NO: { prop: 'CLASS_NO', type: String },
    ETC_OTC_CODE: { prop: 'ETC_OTC_CODE', type: String },
    ITEM_PERMIT_DATE: { prop: 'ITEM_PERMIT_DATE', type: String },
    SHAPE_CODE: { prop: 'SHAPE_CODE', type: String },
    MARK_CODE_FRONT_ANAL: { prop: 'MARK_CODE_FRONT_ANAL', type: String },
    MARK_CODE_BACK_ANAL: { prop: 'MARK_CODE_BACK_ANAL', type: String },
    MARK_CODE_FRONT_IMG: { prop: 'MARK_CODE_FRONT_IMG', type: String },
    MARK_CODE_BACK_IMG: { prop: 'MARK_CODE_BACK_IMG', type: String },
    ITEM_ENG_NAME: { prop: 'ITEM_ENG_NAME', type: String },
    EDI_CODE: { prop: 'EDI_CODE', type: String },
  };

  // .xlsx 파일의 데이터를 DB에 저장 혹은 업데이트
  const xlsxUpserter = (filePath) => {
    xlsx(filePath, { schema }).then(({ rows }) => {
      rows.forEach(async (row) => {
        try {
          console.log(row);
          // await PillRecognitionModel.updateOne({ ITEM_SEQ: row.ITEM_SEQ }, row, {
          //   new: true,
          //   upsert: true,
          // });
        } catch (e) {
          logger.error(`[QUERY] ${e.stack}`);
        }
      });
    });
  };

  // .csv 파일의 데이터를 DB에 저장 혹은 업데이트
  const csvUpserter = (filePath) => {};

  // 디렉터리 내의 파일 확장자에 따라 분기
  const pathReader = () => {
    const dirPath = 'src/res/';

    fs.readdir(dirPath, (err, filelist) => {
      filelist.forEach((file) => {
        switch (path.extname(file)) {
          case '.xlsx':
            xlsxUpserter(`${dirPath}${file}`);
            break;
          case '.csv':
            csvUpserter(`${dirPath}${file}`);
            break;
          default:
            logger.warn(
              `[QUERY] None execute function extension: ${path.extname(file)}`
            );
        }
      });
    });
  };

  // const filePath = 'src/res/의약품 낱알식별정보 데이터(2020년).xlsx';

  pathReader();
}

function main() {
  updateRecognitionData();
}

main();

module.exports = {
  updateRecognitionData,
};
