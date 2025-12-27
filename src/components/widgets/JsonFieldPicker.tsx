'use client';

import React, { useState, useMemo } from 'react';
import { JsonField, filterFields } from '@/utils/jsonExplorer';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface JsonFieldPickerProps {
  fields: JsonField[];
  selectedFields: string[];
  onFieldsChange: (fields: string[]) => void;
}

export const JsonFieldPicker: React.FC<JsonFieldPickerProps> = ({
  fields,
  selectedFields,
  onFieldsChange,
}) => {
  const [search, setSearch] = useState('');
  const [arraysOnly, setArraysOnly] = useState(false);

  const filteredFields = useMemo(
    () => filterFields(fields, search, arraysOnly),
    [fields, search, arraysOnly]
  );

  const handleToggleField = (fieldPath: string) => {
    if (selectedFields.includes(fieldPath)) {
      onFieldsChange(selectedFields.filter((f) => f !== fieldPath));
    } else {
      onFieldsChange([...selectedFields, fieldPath]);
    }
  };

  const handleRemoveField = (fieldPath: string) => {
    onFieldsChange(selectedFields.filter((f) => f !== fieldPath));
  };

  const getFieldDisplayName = (field: JsonField): string => {
    const parts = field.path.split('.');
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search for fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Toggle
          label="Show arrays only (for table view)"
          checked={arraysOnly}
          onChange={setArraysOnly}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-dark-300 dark:text-dark-300 text-gray-700 transition-colors">
            Available Fields ({filteredFields.length})
          </h4>
          <div className="bg-dark-900 dark:bg-dark-900 bg-gray-50 rounded-lg border border-dark-700 dark:border-dark-700 border-gray-200 p-3 max-h-96 overflow-y-auto space-y-2 transition-colors">
            {filteredFields.length === 0 ? (
              <p className="text-sm text-dark-500 dark:text-dark-500 text-gray-500 text-center py-4 transition-colors">
                No fields found
              </p>
            ) : (
              filteredFields.map((field) => (
                <div
                  key={field.path}
                  className="flex items-center justify-between p-2 hover:bg-dark-800 dark:hover:bg-dark-800 hover:bg-gray-100 rounded transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate transition-colors">{field.path}</p>
                    <p className="text-xs text-dark-500 dark:text-dark-500 text-gray-500 transition-colors">
                      {field.type} {field.isArray && '| array'}
                      {typeof field.value === 'number' &&
                        ` | ${field.value}`}
                    </p>
                  </div>
                  {!selectedFields.includes(field.path) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleField(field.path)}
                    >
                      +
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-dark-300 dark:text-dark-300 text-gray-700 transition-colors">
            Selected Fields ({selectedFields.length})
          </h4>
          <div className="bg-dark-900 dark:bg-dark-900 bg-gray-50 rounded-lg border border-dark-700 dark:border-dark-700 border-gray-200 p-3 max-h-96 overflow-y-auto space-y-2 transition-colors">
            {selectedFields.length === 0 ? (
              <p className="text-sm text-dark-500 dark:text-dark-500 text-gray-500 text-center py-4 transition-colors">
                No fields selected
              </p>
            ) : (
              selectedFields.map((fieldPath) => {
                const field = fields.find((f) => f.path === fieldPath);
                return (
                  <div
                    key={fieldPath}
                    className="flex items-center justify-between p-2 hover:bg-dark-800 dark:hover:bg-dark-800 hover:bg-gray-100 rounded transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate transition-colors">{fieldPath}</p>
                      {field && (
                        <p className="text-xs text-dark-500 dark:text-dark-500 text-gray-500 transition-colors">
                          {getFieldDisplayName(field)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveField(fieldPath)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
