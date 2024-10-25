import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Badge, Button } from '@tremor/react';
import { PencilIcon, TrashIcon, ExclamationCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { Client } from '@/types';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onViewFailureLogs: (clientId: string) => void;
  onSendForceMessage: (client: Client) => void;
}

export function ClientList({ 
  clients, 
  onEdit, 
  onDelete, 
  onViewFailureLogs,
  onSendForceMessage 
}: ClientListProps) {
  return (
    <div className="mt-6">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>名称</TableHeaderCell>
            <TableHeaderCell>ステータス</TableHeaderCell>
            <TableHeaderCell>最終応答</TableHeaderCell>
            <TableHeaderCell>挨拶メッセージ</TableHeaderCell>
            <TableHeaderCell>アクション</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={`client-${client.id}`}>
              <TableCell>{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>
                <Badge color={client.status === 'online' ? 'green' : 'red'}>
                  {client.status === 'online' ? 'オンライン' : 'オフライン'}
                </Badge>
              </TableCell>
              <TableCell>{new Date(client.lastPing).toLocaleString()}</TableCell>
              <TableCell>{client.greetingMessage}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={ChatBubbleLeftRightIcon}
                    onClick={() => onSendForceMessage(client)}
                  >
                    強制発話
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={PencilIcon}
                    onClick={() => onEdit(client)}
                  >
                    編集
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={TrashIcon}
                    color="red"
                    onClick={() => onDelete(client.id)}
                  >
                    削除
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={ExclamationCircleIcon}
                    onClick={() => onViewFailureLogs(client.id)}
                  >
                    応答失敗ログ
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}