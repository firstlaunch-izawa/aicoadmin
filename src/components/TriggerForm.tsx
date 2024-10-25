import React, { useState } from 'react';
import { Card, TextInput, Select, SelectItem, Button, Badge } from '@tremor/react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import type { KeywordTrigger, MediaFile, User, Client } from '@/types';

interface TriggerFormProps {
  trigger?: KeywordTrigger;
  clients: Client[];
  mediaFiles: MediaFile[];
  users: User[];
  onSubmit: (data: Partial<KeywordTrigger>) => void;
  onCancel: () => void;
}

interface KeywordCondition {
  keywords: string[];
  operator: 'and' | 'or';
}

type TriggerAction = {
  type: 'message';
  message: string;
} | {
  type: 'media';
  mediaUrl: string;
} | {
  type: 'email' | 'chatwork';
  userIds: string[];
};

export const TriggerForm: React.FC<TriggerFormProps> = ({
  trigger,
  clients,
  mediaFiles,
  users,
  onSubmit,
  onCancel,
}) => {
  const [selectedClientId, setSelectedClientId] = useState(trigger?.clientId || '');
  const [conditions, setConditions] = useState<KeywordCondition[]>(
    trigger?.conditions || [{ keywords: [''], operator: 'and' }]
  );
  const [actionType, setActionType] = useState<TriggerAction['type']>(
    trigger?.action?.type || 'message'
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    trigger?.action.type === 'email' || trigger?.action.type === 'chatwork'
      ? trigger.action.userIds
      : []
  );
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [errors, setErrors] = useState<{
    clientId?: string;
    keywords?: string;
    action?: string;
  }>({});

  const { register, handleSubmit, watch, setValue } = useForm<{
    message?: string;
    mediaUrl?: string;
  }>({
    defaultValues: {
      message: trigger?.action.type === 'message' ? trigger.action.message : '',
      mediaUrl: trigger?.action.type === 'media' ? trigger.action.mediaUrl : '',
    },
  });

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // クライアントIDのバリデーション
    if (!selectedClientId) {
      newErrors.clientId = 'クライアントを選択してください';
    }

    // キーワード条件のバリデーション
    const hasEmptyKeywords = conditions.some(condition => 
      condition.keywords.some(keyword => !keyword.trim())
    );
    if (hasEmptyKeywords) {
      newErrors.keywords = 'キーワードを入力してください';
    }
    if (conditions.some(condition => condition.keywords.length === 0)) {
      newErrors.keywords = '各条件に少なくとも1つのキーワードが必要です';
    }

    // アクションのバリデーション
    const formValues = watch();
    switch (actionType) {
      case 'message':
        if (!formValues.message?.trim()) {
          newErrors.action = 'メッセージを入力してください';
        }
        break;
      case 'media':
        if (!formValues.mediaUrl) {
          newErrors.action = 'メディアを選択してください';
        }
        break;
      case 'email':
      case 'chatwork':
        if (selectedUsers.length === 0) {
          newErrors.action = 'ユーザーを選択してください';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCondition = () => {
    setConditions([...conditions, { keywords: [''], operator: 'and' }]);
  };

  const handleRemoveCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const handleAddKeyword = (conditionIndex: number) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].keywords.push('');
    setConditions(newConditions);
  };

  const handleRemoveKeyword = (conditionIndex: number, keywordIndex: number) => {
    const newConditions = [...conditions];
    if (newConditions[conditionIndex].keywords.length > 1) {
      newConditions[conditionIndex].keywords.splice(keywordIndex, 1);
      setConditions(newConditions);
    }
  };

  const handleKeywordChange = (
    conditionIndex: number,
    keywordIndex: number,
    value: string
  ) => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].keywords[keywordIndex] = value;
    setConditions(newConditions);
    if (errors.keywords) {
      setErrors(prev => ({ ...prev, keywords: undefined }));
    }
  };

  const handleOperatorChange = (conditionIndex: number, value: 'and' | 'or') => {
    const newConditions = [...conditions];
    newConditions[conditionIndex].operator = value;
    setConditions(newConditions);
  };

  const onFormSubmit = (formData: { message?: string; mediaUrl?: string }) => {
    if (!validateForm()) {
      return;
    }

    const data: Partial<KeywordTrigger> = {
      clientId: selectedClientId,
      conditions,
      action: {
        type: actionType,
        ...(actionType === 'message' && { message: formData.message }),
        ...(actionType === 'media' && { mediaUrl: formData.mediaUrl }),
        ...(actionType === 'email' && { userIds: selectedUsers }),
        ...(actionType === 'chatwork' && { userIds: selectedUsers }),
      } as TriggerAction,
    };
    onSubmit(data);
  };

  return (
    <div className="relative">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* クライアント選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              クライアント
            </label>
            <Select
              value={selectedClientId}
              onValueChange={(value) => {
                setSelectedClientId(value);
                if (errors.clientId) {
                  setErrors(prev => ({ ...prev, clientId: undefined }));
                }
              }}
              placeholder="クライアントを選択"
              error={!!errors.clientId}
              errorMessage={errors.clientId}
            >
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.id} - {client.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* キーワード条件 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                キーワード条件
              </label>
              <Button
                size="xs"
                variant="secondary"
                icon={PlusIcon}
                onClick={handleAddCondition}
              >
                条件を追加
              </Button>
            </div>

            {errors.keywords && (
              <p className="text-sm text-red-500">{errors.keywords}</p>
            )}

            {conditions.map((condition, conditionIndex) => (
              <Card key={conditionIndex} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Select
                      value={condition.operator}
                      onValueChange={(value) => 
                        handleOperatorChange(conditionIndex, value as 'and' | 'or')
                      }
                      className="w-32"
                    >
                      <SelectItem value="and">AND</SelectItem>
                      <SelectItem value="or">OR</SelectItem>
                    </Select>
                    <Button
                      size="xs"
                      variant="secondary"
                      color="red"
                      icon={XMarkIcon}
                      onClick={() => handleRemoveCondition(conditionIndex)}
                      disabled={conditions.length === 1}
                    >
                      削除
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {condition.keywords.map((keyword, keywordIndex) => (
                      <div key={keywordIndex} className="flex space-x-2">
                        <TextInput
                          value={keyword}
                          onChange={(e) => 
                            handleKeywordChange(conditionIndex, keywordIndex, e.target.value)
                          }
                          placeholder="キーワードを入力"
                          error={!!errors.keywords}
                        />
                        <Button
                          size="xs"
                          variant="secondary"
                          color="red"
                          icon={XMarkIcon}
                          onClick={() => handleRemoveKeyword(conditionIndex, keywordIndex)}
                          disabled={condition.keywords.length === 1}
                        >
                          削除
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="xs"
                      variant="secondary"
                      icon={PlusIcon}
                      onClick={() => handleAddKeyword(conditionIndex)}
                    >
                      キーワードを追加
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* アクション設定 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              アクション
            </label>
            <Select
              value={actionType}
              onValueChange={(value) => {
                setActionType(value as TriggerAction['type']);
                if (errors.action) {
                  setErrors(prev => ({ ...prev, action: undefined }));
                }
              }}
            >
              <SelectItem value="message">メッセージ送信</SelectItem>
              <SelectItem value="media">メディアURL送信</SelectItem>
              <SelectItem value="email">メール通知</SelectItem>
              <SelectItem value="chatwork">Chatwork通知</SelectItem>
            </Select>

            {errors.action && (
              <p className="text-sm text-red-500">{errors.action}</p>
            )}

            {actionType === 'message' && (
              <TextInput
                {...register('message')}
                placeholder="送信するメッセージを入力"
                error={!!errors.action}
              />
            )}

            {actionType === 'media' && (
              <div>
                <TextInput
                  {...register('mediaUrl')}
                  placeholder="メディアURLを選択"
                  readOnly
                  error={!!errors.action}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setShowMediaSelector(true)}
                >
                  メディアを選択
                </Button>
              </div>
            )}

            {(actionType === 'email' || actionType === 'chatwork') && (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedUsers.map((userId) => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <Badge
                        key={userId}
                        color="blue"
                        icon={XMarkIcon}
                        onClick={() => 
                          setSelectedUsers(selectedUsers.filter(id => id !== userId))
                        }
                      >
                        {user ? `${user.lastName} ${user.firstName}` : userId}
                      </Badge>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowUserSelector(true)}
                >
                  ユーザーを選択
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit" variant="primary">
              {trigger ? '更新' : '作成'}
            </Button>
          </div>
        </form>
      </Card>

      {/* メディアセレクターモーダル */}
      {showMediaSelector && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">メディアを選択</h3>
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={XMarkIcon}
                    onClick={() => setShowMediaSelector(false)}
                  >
                    閉じる
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {mediaFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.type}</p>
                      </div>
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => {
                          setValue('mediaUrl', file.url);
                          setShowMediaSelector(false);
                          if (errors.action) {
                            setErrors(prev => ({ ...prev, action: undefined }));
                          }
                        }}
                      >
                        選択
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ユーザーセレクターモーダル */}
      {showUserSelector && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">ユーザーを選択</h3>
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={XMarkIcon}
                    onClick={() => setShowUserSelector(false)}
                  >
                    閉じる
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">
                          {user.lastName} {user.firstName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                          if (errors.action) {
                            setErrors(prev => ({ ...prev, action: undefined }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => setShowUserSelector(false)}
                  >
                    選択完了
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};