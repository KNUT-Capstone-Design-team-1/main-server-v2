import {
  TPillSearchQueryFilters,
  TPillSearchInQueryFilters,
  TPillSearchParam,
} from '../@types/pill_search';

/**
 * 알약 검색을 위한 쿼리 필터 생성
 * @param param 검색 속성
 * @returns
 */
async function generateQueryFilterByType(param: TPillSearchParam) {
  const escapingQueryValue = (value: string) => value.replace(/[\\(\\)\\|\\^\\$]|\\[|\\]/g, (s) => `\\${s}`);

  const andTargetKeys = ['ITEM_SEQ', 'ITEM_NAME', 'ENTP_NAME'];
  const orTargetKeys = [
    'COLOR_CLASS1',
    'COLOR_CLASS2',
    'PRINT_FRONT',
    'PRINT_BACK',
    'LINE_FRONT',
    'LINE_BACK',
    'CHARTIN',
  ];
  const inTargetKeys = ['DRUG_SHAPE'];

  const andFilter: TPillSearchQueryFilters = [];
  const orFilter: TPillSearchQueryFilters = [];
  const inFilter: TPillSearchInQueryFilters = [];

  const generateQueryFilterPromises = Object.entries(param).map(async ([key, value]) => {
    if (andTargetKeys.includes(key)) {
      andFilter.push({ [key]: new RegExp(escapingQueryValue(value as string), 'g') });
      return;
    }

    if (orTargetKeys.includes(key)) {
      orFilter.push({ [key]: new RegExp(escapingQueryValue(value as string), 'g') });
      return;
    }

    if (inTargetKeys.includes(key)) {
      inFilter.push({ [key]: { $in: value as string[] } });
      return;
    }
  });

  await Promise.all(generateQueryFilterPromises);

  return { andFilter, orFilter, inFilter };
}

/**
 * AND 쿼리 필터 생성
 * @param andFilter AND 쿼리 필터
 * @param orFilter OR 쿼리 필터
 * @param inFilter IN 쿼리 필터
 * @returns
 */
function generateANDFilter(
  andFilter: TPillSearchQueryFilters,
  orFilter: TPillSearchQueryFilters,
  inFilter: TPillSearchInQueryFilters
) {
  const filter = { $and: andFilter };

  if (orFilter.length > 0) {
    filter.$and.push({ $or: orFilter });
  }

  if (inFilter.length > 0) {
    Object.assign(filter, ...inFilter); // $and 배열 내 $or이 있는 경우를 고려하여 spread 처리
  }

  return filter;
}

/**
 * OR 쿼리 필터 생성
 * @param orFilter OR 쿼리 필터
 * @param inFilter IN 쿼리 필터
 * @returns
 */
function generateORFilter(orFilter: TPillSearchQueryFilters, inFilter: TPillSearchInQueryFilters) {
  const filter = { $or: orFilter };

  if (inFilter.length > 0) {
    Object.assign(filter, { $and: inFilter }); // and 검색
  }

  return filter;
}

/**
 * IN 쿼리 필터 생성
 * @param inFilter IN 쿼리 필터
 * @returns
 */
function generateINFilter(inFilter: TPillSearchInQueryFilters) {
  return { $or: inFilter };
}

/**
 * 알약 검색을 위한 쿼리 필터 생성
 * @param param 검색 속성
 * @returns
 */
export async function generateQueryFilter(param: TPillSearchParam) {
  const { andFilter, orFilter, inFilter } = await generateQueryFilterByType(param);

  if (andFilter.length > 0) {
    return generateANDFilter(andFilter, orFilter, inFilter);
  }

  if (orFilter.length > 0) {
    return generateORFilter(orFilter, inFilter);
  }

  if (inFilter.length > 0) {
    return generateINFilter(inFilter);
  }

  return {};
}
