const RESOURCE_PATH = {
  PILL_RECOGNITION: './res/pill_recognition',
  DRUG_PERMISSION: './res/drug_permission',
} as const;

type TFuncReturn<T> = {
  success: boolean;
  data: T;
  message: string;
};

type TResourceMapperAttribute = {
  colunmOfResource: string;
  required?: boolean;
};

type TResourceMapper = Record<string, TResourceMapperAttribute>;

type TResourceUpdateInfo = {
  mapper: TResourceMapper;
  path: keyof typeof RESOURCE_PATH;
  fileList: string[];
};

export { RESOURCE_PATH, TFuncReturn, TResourceMapperAttribute, TResourceMapper, TResourceUpdateInfo };
