import React from 'react';
import { Card } from '@tremor/react';
import { Message } from '@/types';

interface ConversationListProps {
  messages: Message[];
}

export const ConversationList: React.FC<ConversationListProps> = ({ messages }) => {
  // メッセージを日付でグループ化
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex items-center space-x-4 mb-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-gray-500 font-medium">{date}</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="space-y-4">
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.speaker === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.mediaUrl && (
                    <div className="mt-2">
                      <img
                        src={message.mediaUrl}
                        alt="Media content"
                        className="max-w-full rounded"
                      />
                    </div>
                  )}
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};