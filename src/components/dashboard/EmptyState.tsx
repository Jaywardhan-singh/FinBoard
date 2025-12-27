import React from 'react';

interface EmptyStateProps {
  onAddWidget: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddWidget }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="border-2 border-dashed border-primary-400/50 rounded-xl p-12 text-center max-w-md">
        <button
          onClick={onAddWidget}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-600/20 hover:bg-primary-600/30 flex items-center justify-center transition-colors group"
        >
          <svg
            className="w-10 h-10 text-primary-600 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors"> Add Widget</h3>
        <p className="text-dark-400 dark:text-dark-400 text-gray-600 text-sm transition-colors">
          Connect to a Finance API and Create a custom widget
        </p>
      </div>
    </div>
  );
};
