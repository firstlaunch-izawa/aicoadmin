import React from 'react';
import { Card, TextInput, Button } from '@tremor/react';
import { useForm } from 'react-hook-form';
import type { User } from '@/types';

interface UserFormProps {
  user?: User;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<User>>({
    defaultValues: user || {
      firstName: '',
      lastName: '',
      email: '',
      chatworkId: '',
      lineId: '',
    },
  });

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {user && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ユーザーNo.
            </label>
            <TextInput
              value={user.id}
              disabled
              className="bg-gray-50"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              姓
            </label>
            <TextInput
              {...register('lastName', { required: '姓は必須です' })}
              placeholder="山田"
              error={!!errors.lastName}
              errorMessage={errors.lastName?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              名
            </label>
            <TextInput
              {...register('firstName', { required: '名は必須です' })}
              placeholder="太郎"
              error={!!errors.firstName}
              errorMessage={errors.firstName?.message}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <TextInput
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '有効なメールアドレスを入力してください',
              },
            })}
            placeholder="taro.yamada@example.com"
            error={!!errors.email}
            errorMessage={errors.email?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chatwork ID
          </label>
          <TextInput
            {...register('chatworkId')}
            placeholder="（オプション）"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            LINE ID
          </label>
          <TextInput
            {...register('lineId')}
            placeholder="（オプション）"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit" variant="primary">
            {user ? '更新' : '登録'}
          </Button>
        </div>
      </form>
    </Card>
  );
};