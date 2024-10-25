import React from 'react';
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Button } from '@tremor/react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { PollingFailureLog } from '@/types';

interface FailureLogListProps {
  clientId: string;
  logs: PollingFailureLog[];
  onDownloadCsv: () => void;
  onClose: () => void;
}

export const FailureLogList: React.FC<FailureLogListProps> = ({
  clientId,
  logs,
  onDownloadCsv,
  onClose,
}) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">応答失敗ログ - {clientId}</h2>
        <div className="space-x-2">
          <Button
            size="xs"
            variant="secondary"
            icon={ArrowDownTrayIcon}
            onClick={onDownloadCsv}
          >
            CSVダウンロード
          </Button>
          <Button
            size="xs"
            variant="secondary"
            icon={XMarkIcon}
            onClick={onClose}
          >
            閉じる
          </Button>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>日時</TableHeaderCell>
            <TableHeaderCell>エラーメッセージ</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {new Date(log.timestamp).toLocaleString()}
              </TableCell>
              <TableCell className="text-red-500">
                {log.errorMessage}
              </TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-gray-500">
                応答失敗ログはありません
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};