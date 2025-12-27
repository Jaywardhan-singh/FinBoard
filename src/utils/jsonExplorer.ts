export interface JsonField {
  path: string;
  value: any;
  type: string;
  isArray: boolean;
  displayName: string;
}

export const flattenJson = (obj: any, prefix: string = '', fields: JsonField[] = []): JsonField[] => {
  if (obj === null || obj === undefined) {
    fields.push({
      path: prefix || 'root',
      value: obj,
      type: 'null',
      isArray: false,
      displayName: prefix || 'root',
    });
    return fields;
  }

  if (Array.isArray(obj)) {
    fields.push({
      path: prefix || 'root',
      value: obj,
      type: 'array',
      isArray: true,
      displayName: prefix || 'root',
    });
    
    if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
      obj.forEach((item, index) => {
        flattenJson(item, `${prefix}[${index}]`, fields);
      });
      if (obj.length > 0) {
        flattenJson(obj[0], prefix, fields);
      }
    }
    return fields;
  }

  if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      const newPath = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (value === null || value === undefined) {
        fields.push({
          path: newPath,
          value: value,
          type: typeof value === 'object' ? 'null' : typeof value,
          isArray: false,
          displayName: key,
        });
      } else if (Array.isArray(value)) {
        fields.push({
          path: newPath,
          value: value,
          type: 'array',
          isArray: true,
          displayName: key,
        });
        
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          flattenJson(value[0], newPath, fields);
        }
      } else if (typeof value === 'object') {
        flattenJson(value, newPath, fields);
      } else {
        fields.push({
          path: newPath,
          value: value,
          type: typeof value,
          isArray: false,
          displayName: key,
        });
      }
    });
    return fields;
  }

  fields.push({
    path: prefix || 'root',
    value: obj,
    type: typeof obj,
    isArray: false,
    displayName: prefix || 'root',
  });

  return fields;
};

export const getValueByPath = (obj: any, path: string): any => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    if (Array.isArray(current)) {
      const match = key.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const [, arrayKey, index] = match;
        current = current[parseInt(index)]?.[arrayKey];
      } else {
        return undefined;
      }
    } else {
      current = current[key];
    }
  }
  
  return current;
};

export const filterFields = (fields: JsonField[], search: string, arraysOnly: boolean): JsonField[] => {
  let filtered = fields;
  
  if (arraysOnly) {
    filtered = filtered.filter((field) => field.isArray);
  }
  
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (field) =>
        field.path.toLowerCase().includes(searchLower) ||
        field.displayName.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};
