import React from 'react';

interface JsonPreviewProps {
  data: any;
  maxHeight?: string;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({
  data,
  maxHeight = '300px',
}) => {
  return (
    <div
      className="bg-dark-900 dark:bg-dark-900 bg-gray-50 rounded-lg p-4 overflow-auto border border-dark-700 dark:border-dark-700 border-gray-200 transition-colors"
      style={{ maxHeight }}
    >
      <pre className="text-sm text-gray-900 dark:text-dark-300 font-mono transition-colors">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
