import { useState } from 'react';
import { Title } from '@tremor/react';
import { MediaUploadForm } from '@/components/MediaUploadForm';
import { MediaList } from '@/components/MediaList';
import { MediaFilter } from '@/components/MediaFilter';
import type { MediaFile } from '@/types';

// モックデータ
const mockFiles: MediaFile[] = [
  {
    id: '1',
    name: '商品カタログ.pdf',
    url: 'https://example.com/media/20231120100532_a7b8c9.pdf',
    type: 'pdf',
    uploadedAt: '2023-11-20T10:00:00Z',
  },
  {
    id: '2',
    name: '店舗外観.jpg',
    url: 'https://example.com/media/20231120090012_x7y8z9.jpg',
    type: 'image',
    uploadedAt: '2023-11-20T09:00:00Z',
  },
  {
    id: '3',
    name: '商品紹介.mp4',
    url: 'https://example.com/media/20231119153022_p4q5r6.mp4',
    type: 'video',
    uploadedAt: '2023-11-19T15:30:00Z',
  },
];

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>(mockFiles);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>(mockFiles);

  const generateUniqueFileName = (file: File): string => {
    const timestamp = new Date().toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '')
      .replace(/\..+/, '');
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop();
    return `${timestamp}_${randomStr}.${ext}`;
  };

  const handleUpload = async (file: File) => {
    const uniqueFileName = generateUniqueFileName(file);
    const baseUrl = 'https://example.com/media/'; // 実際のベースURLに置き換え
    
    const newFile: MediaFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: baseUrl + uniqueFileName,
      type: file.type.split('/')[0] as 'image' | 'video' | 'pdf',
      uploadedAt: new Date().toISOString(),
    };
    
    const updatedFiles = [newFile, ...files];
    setFiles(updatedFiles);
    setFilteredFiles(updatedFiles);
  };

  const handleDelete = (fileId: string) => {
    if (confirm('このファイルを削除してもよろしいですか？')) {
      const updatedFiles = files.filter(file => file.id !== fileId);
      setFiles(updatedFiles);
      setFilteredFiles(updatedFiles);
    }
  };

  const handleFilterChange = (filters: {
    filename?: string;
    clientId?: string;
  }) => {
    let filtered = files;

    if (filters.filename) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(filters.filename!.toLowerCase())
      );
    }

    if (filters.clientId) {
      filtered = filtered.filter(file =>
        file.url.toLowerCase().includes(filters.clientId!.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
  };

  return (
    <div className="space-y-6">
      <Title>メディア管理</Title>
      
      <MediaUploadForm onUpload={handleUpload} />
      
      <MediaFilter onFilterChange={handleFilterChange} />
      
      <MediaList files={filteredFiles} onDelete={handleDelete} />
    </div>
  );
}