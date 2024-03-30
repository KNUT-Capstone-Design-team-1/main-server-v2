import { BasicType, SchemaEntryRequired } from "read-excel-file/types";

export type TFuncReturn<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type TResourceSchemaAttribute = {
  prop: string;
  type: BasicType;
  required?: SchemaEntryRequired
};

export type TResourceSchema = Record<string, TResourceSchemaAttribute>;
