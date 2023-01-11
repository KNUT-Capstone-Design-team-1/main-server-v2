/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const Models = require('../models');
const { essentialModels } = require('../../res/config.json');

/**
 * DB의 필수적인 collection의 documents 갯수를 조회
 * @returns {{model: string, documets: number}[]}
 */
async function countDocuments() {
  const result = [];
  for (const model of Object.keys(Models)) {
    if (essentialModels.includes(model)) {
      result.push({ model, documets: await Models[model].countDocuments({}) });
    }
  }
  return result;
}

module.exports = {
  countDocuments,
};
