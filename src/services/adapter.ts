import { flattenJson, getValueByPath, JsonField } from '@/utils/jsonExplorer';

export interface AdapterResult {
  success: boolean;
  data?: any;
  fields?: JsonField[];
  error?: string;
}

export const adaptApiResponse = (response: any): AdapterResult => {
  try {
    if (!response || typeof response !== 'object') {
      return {
        success: false,
        error: 'Invalid response format',
      };
    }

    const fields = flattenJson(response);
    const topLevelFields = fields.filter((field) => !field.path.includes('.'));

    return {
      success: true,
      data: response,
      fields,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const extractFieldValues = (data: any, fields: string[]): Record<string, any> => {
  const result: Record<string, any> = {};
  
  fields.forEach((field) => {
    const value = getValueByPath(data, field);
    result[field] = value;
  });
  
  return result;
};
