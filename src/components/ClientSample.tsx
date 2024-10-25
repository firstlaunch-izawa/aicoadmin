import React, { useState, useEffect } from 'react';
import { setupSSEClient, setupPolling } from '@/lib/clientUtils';

interface Props {
  clientId: string;
}

export function ClientSample({ clientId }: Props) {
  const [messages, setMessages] = useState<string[]>([]);
  const [greetingMessage, setGreetingMessage] = useState<string>('');

  // メッセージ送信
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      // メディアURLがある場合は表示
      if (result.mediaUrl) {
        setMessages(prev => [...prev, `Media received: ${result.mediaUrl}`]);
      }

      // フォームをリセット
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // SSEとポーリングのセットアップ
  useEffect(() => {
    // SSEのセットアップ
    const cleanupSSE = setupSSEClient(clientId, (data) => {
      if (data.type === 'force_message') {
        setMessages(prev => [...prev, `Forced message: ${data.message}`]);
      }
    });

    // ポーリングのセットアップ
    const cleanupPolling = setupPolling(clientId, (data) => {
      setGreetingMessage(data.greeting);
    });

    // クリーンアップ
    return () => {
      cleanupSSE();
      cleanupPolling();
    };
  }, [clientId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Client Sample: {clientId}</h2>

      {/* メッセージ送信フォーム */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="message_id" value={Date.now().toString()} />
        
        <div>
          <label className="block text-sm font-medium mb-1">Message:</label>
          <input
            type="text"
            name="message"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Speaker:</label>
          <select name="speaker" className="w-full p-2 border rounded">
            <option value="user">User</option>
            <option value="ai">AI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photo (optional):</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      {/* 挨拶メッセージの表示 */}
      {greetingMessage && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-medium mb-2">Greeting Message:</h3>
          <p>{greetingMessage}</p>
        </div>
      )}

      {/* メッセージログの表示 */}
      <div className="border rounded p-4">
        <h3 className="font-medium mb-2">Message Log:</h3>
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}