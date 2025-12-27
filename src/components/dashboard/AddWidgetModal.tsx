'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { JsonFieldPicker } from '@/components/widgets/JsonFieldPicker';
import { JsonPreview } from '@/components/widgets/JsonPreview';
import { apiClient } from '@/services/apiClient';
import { JsonField } from '@/utils/jsonExplorer';
import { DISPLAY_MODES, DEFAULT_REFRESH_INTERVAL } from '@/utils/constants';
import { Loader } from '@/components/ui/Loader';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (widget: {
    title: string;
    apiUrl: string;
    refreshInterval: number;
    type: 'card' | 'table' | 'chart';
    selectedFields: string[];
    wsUrl?: string;
    useWebSocket?: boolean;
  }) => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [step, setStep] = useState<'config' | 'fields'>('config');
  const [title, setTitle] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL);
  const [displayMode, setDisplayMode] = useState<'card' | 'table' | 'chart'>('card');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [useWebSocket, setUseWebSocket] = useState(false);
  const [wsUrl, setWsUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    fields?: JsonField[];
    data?: any;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('config');
      setTitle('');
      setApiUrl('');
      setRefreshInterval(DEFAULT_REFRESH_INTERVAL);
      setDisplayMode('card');
      setSelectedFields([]);
      setUseWebSocket(false);
      setWsUrl('');
      setTestResult(null);
    }
  }, [isOpen]);

  const handleTest = async () => {
    if (!apiUrl.trim()) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await apiClient.testConnection(apiUrl);
      setTestResult(result);
      if (result.success && result.fields) {
        setStep('fields');
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleAdd = () => {
    if (!title.trim() || !apiUrl.trim() || selectedFields.length === 0) {
      return;
    }

    onAdd({
      title: title.trim(),
      apiUrl: apiUrl.trim(),
      refreshInterval,
      type: displayMode,
      selectedFields,
      wsUrl: useWebSocket ? wsUrl.trim() : undefined,
      useWebSocket: useWebSocket && wsUrl.trim() ? true : false,
    });

    onClose();
  };

  const canProceed = testResult?.success && testResult.fields && testResult.fields.length > 0;
  const canAdd = title.trim() && apiUrl.trim() && selectedFields.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Widget" size="xl">
      <div className="p-6 space-y-6">
        {step === 'config' && (
          <>
            <Input
              label="Widget Name"
              placeholder="e.g., Bitcoin Price Tracker"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex gap-2">
              <Input
                label="API URL"
                placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1"
              />
              <div className="flex items-end">
                <Button
                  onClick={handleTest}
                  isLoading={isTesting}
                  disabled={!apiUrl.trim() || isTesting}
                >
                  Test
                </Button>
              </div>
            </div>

            {testResult && (
              <div className="p-4 rounded-lg border border-dark-700">
                {testResult.success ? (
                  <div className="space-y-2">
                    <Badge variant="success" size="md">
                      API connection successful! {testResult.fields?.length || 0} fields found.
                    </Badge>
                    {testResult.data && (
                      <JsonPreview data={testResult.data} maxHeight="200px" />
                    )}
                  </div>
                ) : (
                  <Badge variant="danger" size="md">
                    {testResult.error || 'Connection failed'}
                  </Badge>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Refresh Interval (seconds)"
                type="number"
                min="5"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value) || DEFAULT_REFRESH_INTERVAL)}
              />

              <Select
                label="Display Mode"
                options={DISPLAY_MODES.map((mode) => ({
                  value: mode,
                  label: mode.charAt(0).toUpperCase() + mode.slice(1),
                }))}
                value={displayMode}
                onChange={(e) => setDisplayMode(e.target.value as 'card' | 'table' | 'chart')}
              />
            </div>

            <div className="space-y-3">
              <Toggle
                label="Enable WebSocket for real-time updates"
                checked={useWebSocket}
                onChange={setUseWebSocket}
              />
              {useWebSocket && (
                <Input
                  label="WebSocket URL (optional)"
                  placeholder="e.g., wss://stream.example.com/data"
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                />
              )}
            </div>
          </>
        )}

        {step === 'fields' && testResult?.fields && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Select Fields to Display</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep('config')}>
                ← Back
              </Button>
            </div>

            <JsonFieldPicker
              fields={testResult.fields}
              selectedFields={selectedFields}
              onFieldsChange={setSelectedFields}
            />
          </>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {step === 'config' && canProceed && (
            <Button onClick={() => setStep('fields')}>
              Next: Select Fields
            </Button>
          )}
          {step === 'fields' && (
            <Button onClick={handleAdd} disabled={!canAdd}>
              Add Widget
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
