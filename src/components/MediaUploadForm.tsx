import React, { useState } from 'react';
import { Card, Text, Button } from '@tremor/react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { ErrorAlert } from './ErrorAlert';

interface MediaUploadFormProps {
  onUpload: (file: File) => void;
}

export const MediaUploadForm: React.FC<MediaUploadFormProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const { loading, execute } = useApi({
    onError: (error) => setError(error.message),
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルタイプの検証
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
    if (!validTypes.includes(file.type)) {
      setError('JPG、PNG、PDF、MP4ファイルのみアップロード可能です');
      return;
    }

    // ファイルサイズの検証 (30MB)
    if (file.size > 30 * 1024 * 1024) {
      setError('ファイルサイズは30MB以下にしてください');
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    try {
      await execute(() => api.uploadMedia(selectedFile));
      onUpload(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      // エラーは useApi フックで処理されます
    }
  };

  return (
    <Card className="p-6">
      {error && (
        <ErrorAlert
          message={error}
          onClose={() => setError('')}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
              <Text>クリックまたはドラッグ＆ドロップでファイルをアップロード</Text>
              <Text className="text-xs text-gray-500">
                JPG、PNG、PDF、MP4（最大30MB）
              </Text>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.mp4"
              onChange={handleFileSelect}
              disabled={loading}
            />
          </label>
        </div>

        {selectedFile && (
          <div className="text-center">
            <Text>選択されたファイル: {selectedFile.name}</Text>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              icon={CloudArrowUpIcon}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'アップロード中...' : 'アップロード'}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};