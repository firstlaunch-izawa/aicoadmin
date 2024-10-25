import React from 'react';
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Button } from '@tremor/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { User } from '@/types';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>名前</TableHeaderCell>
            <TableHeaderCell>メールアドレス</TableHeaderCell>
            <TableHeaderCell>Chatwork ID</TableHeaderCell>
            <TableHeaderCell>操作</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.lastName} {user.firstName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.chatworkId || '-'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={PencilIcon}
                    onClick={() => onEdit(user)}
                  >
                    編集
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    color="red"
                    icon={TrashIcon}
                    onClick={() => onDelete(user.id)}
                  >
                    削除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};