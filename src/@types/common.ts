export type TFuncReturn<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type TResourceMapperAttribute = {
  colunmOfResource: string;
  required?: boolean;
};

export type TResourceMapper = Record<string, TResourceMapperAttribute>;

export type TResourceUpdateInfo = {
  mapper: TResourceMapper;
  path: string;
  fileList: string[];
};
