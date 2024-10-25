import { useState } from 'react';
import { Title, Button } from '@tremor/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { UserList } from '@/components/UserList';
import { UserForm } from '@/components/UserForm';
import type { User } from '@/types';

// モックデータ
const mockUsers: User[] = [
  {
    id: '1',
    firstName: '太郎',
    lastName: '山田',
    email: 'taro.yamada@example.com',
    chatworkId: 'taro123',
  },
  {
    id: '2',
    firstName: '花子',
    lastName: '鈴木',
    email: 'hanako.suzuki@example.com',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (data: Partial<User>) => {
    if (selectedUser) {
      // 編集
      setUsers(users.map(user =>
        user.id === selectedUser.id
          ? { ...user, ...data }
          : user
      ));
    } else {
      // 新規作成
      const newUser: User = {
        ...data as User,
        id: Math.random().toString(36).substr(2, 9),
      };
      setUsers([...users, newUser]);
    }
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (userId: string) => {
    if (confirm('このユーザーを削除してもよろしいですか？')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>ユーザー管理</Title>
        <Button
          variant="primary"
          icon={PlusIcon}
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
        >
          新規作成
        </Button>
      </div>

      {isFormOpen ? (
        <UserForm
          user={selectedUser || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedUser(null);
          }}
        />
      ) : (
        <UserList
          users={users}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}