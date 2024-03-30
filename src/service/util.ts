import { TSearchQueryWhere } from '../@types/pill_search';

/**
 * 알약 검색을 위한 쿼리 필터 생성
 * @param where 검색할 데이터
 * @returns 
 */
export async function generateQueryFilterForPillSearch(where: TSearchQueryWhere) {
  const andTargetKeys = ['ITEM_NAME'];
  const orTargetKeys = [
    'COLOR_CLASS_1',
    'COLOR_CLASS_2',
    'DRUG_SHAPE',
    'PRINT_FRONT',
    'PRINT_BACK',
    'LINE_FRONT',
    'LINE_BACK',
    'CHARTIN',
  ];

  const andCondition = [] as Record<string, RegExp>[];
  const orCondition = [] as Record<string, RegExp>[];

  const queryFilter = {};

  const generateQueryFilterPromises = Object.entries(where).map(
    async ([key, value]) => {
      const condition = { [key]: new RegExp(value, 'g') };
      if (andTargetKeys.includes(key)) {
        andCondition.push(condition);
      }

      if (orTargetKeys.includes(key)) {
        orCondition.push(condition);
      }
    }
  );

  await Promise.all(generateQueryFilterPromises);

  if (andCondition.length > 0) {
    Object.assign(queryFilter, {
      $and: [...andCondition, { $or: orCondition }],
    });

    return queryFilter;
  }

  Object.assign(queryFilter, { $or: orCondition });

  return queryFilter;
}
