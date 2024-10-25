import React from 'react';
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button } from '@tremor/react';
import { TrashIcon, ArrowTopRightOnSquareIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import type { MediaFile } from '@/types';

interface MediaListProps {
  files: MediaFile[];
  onDelete: (fileId: string) => void;
}

export const MediaList: React.FC<MediaListProps> = ({ files, onDelete }) => {
  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'blue';
      case 'video':
        return 'green';
      case 'pdf':
        return 'red';
      default:
        return 'gray';
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URLをクリップボードにコピーしました');
    } catch (err) {
      alert('URLのコピーに失敗しました');
    }
  };

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>ファイル名</TableHeaderCell>
            <TableHeaderCell>タイプ</TableHeaderCell>
            <TableHeaderCell>アップロード日時</TableHeaderCell>
            <TableHeaderCell>URL</TableHeaderCell>
            <TableHeaderCell>操作</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>
                <Badge color={getFileTypeColor(file.type)}>
                  {file.type.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(file.uploadedAt).toLocaleString()}
              </TableCell>
              <TableCell className="max-w-md truncate">
                <div className="flex items-center space-x-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                    開く
                  </a>
                  <Button
                    size="xs"
                    variant="light"
                    icon={ClipboardIcon}
                    onClick={() => copyToClipboard(file.url)}
                  >
                    URLをコピー
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  size="xs"
                  variant="secondary"
                  color="red"
                  icon={TrashIcon}
                  onClick={() => onDelete(file.id)}
                >
                  削除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};