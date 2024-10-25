import React from 'react';
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Button } from '@tremor/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { KeywordTrigger } from '@/types';

interface TriggerListProps {
  triggers: KeywordTrigger[];
  onEdit: (trigger: KeywordTrigger) => void;
  onDelete: (triggerId: string) => void;
}

export const TriggerList: React.FC<TriggerListProps> = ({
  triggers,
  onEdit,
  onDelete,
}) => {
  const getActionDescription = (action: KeywordTrigger['action']) => {
    switch (action.type) {
      case 'message':
        return `メッセージ送信: ${action.message}`;
      case 'media':
        return `メディアURL送信: ${action.mediaUrl}`;
      case 'email':
        return `メール通知: ${action.userIds.length}名に送信`;
      case 'chatwork':
        return `Chatwork通知: ${action.userIds.length}名に送信`;
      default:
        return '不明なアクション';
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>クライアントID</TableHeaderCell>
          <TableHeaderCell>キーワード条件</TableHeaderCell>
          <TableHeaderCell>アクション内容</TableHeaderCell>
          <TableHeaderCell className="text-right">操作</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {triggers.map((trigger) => (
          <TableRow key={trigger.id}>
            <TableCell>{trigger.clientId}</TableCell>
            <TableCell>
              {trigger.conditions.map((condition, index) => (
                <div key={index} className="mb-1">
                  {index > 0 && <span className="text-gray-500 mr-2">+</span>}
                  {condition.keywords.join(
                    condition.operator === 'and' ? ' AND ' : ' OR '
                  )}
                </div>
              ))}
            </TableCell>
            <TableCell>{getActionDescription(trigger.action)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  size="xs"
                  variant="secondary"
                  icon={PencilIcon}
                  onClick={() => onEdit(trigger)}
                >
                  編集
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  color="red"
                  icon={TrashIcon}
                  onClick={() => onDelete(trigger.id)}
                >
                  削除
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};