import React from 'react';
import { Card, TextInput, Button } from '@tremor/react';
import { useForm } from 'react-hook-form';
import type { Client } from '@/types';

interface ClientFormProps {
  client?: Client;
  existingIds: string[];
  onSubmit: (data: Partial<Client>) => void;
  onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  existingIds,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Partial<Client>>({
    defaultValues: client || {
      id: '',
      name: '',
      greetingMessage: '',
    },
  });

  // IDの入力を監視
  const watchedId = watch('id');

  // 3桁の数字のみを許可する関数
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 数字以外を除去
    const numericValue = value.replace(/[^0-9]/g, '');
    // 3桁に制限
    const truncatedValue = numericValue.slice(0, 3);
    e.target.value = truncatedValue;
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            クライアントID
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">aico</span>
            <input
              type="text"
              className={`mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                errors.id ? 'border-red-500' : ''
              }`}
              {...register('id', {
                required: '必須項目です',
                pattern: {
                  value: /^[0-9]{3}$/,
                  message: '3桁の数字を入力してください',
                },
                validate: (value) => {
                  const fullId = `aico${value}`;
                  return !existingIds.includes(fullId) || 'このIDは既に使用されています';
                }
              })}
              placeholder="000"
              onChange={(e) => {
                handleIdChange(e);
                register('id').onChange(e);
              }}
              maxLength={3}
            />
          </div>
          {errors.id && (
            <p className="mt-1 text-sm text-red-500">{errors.id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            名前
          </label>
          <TextInput
            {...register('name', { required: '必須項目です' })}
            placeholder="クライアント名"
            error={!!errors.name}
            errorMessage={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            挨拶メッセージ
          </label>
          <TextInput
            {...register('greetingMessage', {
              required: '必須項目です',
              maxLength: {
                value: 100,
                message: '100文字以内で入力してください',
              },
            })}
            placeholder="こんにちは、何かお手伝いできることはありますか？"
            error={!!errors.greetingMessage}
            errorMessage={errors.greetingMessage?.message}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit" variant="primary">
            {client ? '更新' : '登録'}
          </Button>
        </div>
      </form>
    </Card>
  );
};