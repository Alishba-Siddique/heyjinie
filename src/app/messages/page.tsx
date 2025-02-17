// src/app/messages/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/hoc/withAuth';

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

const MessagesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<
    PersonalizedMessage[]
  >([]);
  const [personalizedMessages, setPersonalizedMessages] = useState<
    PersonalizedMessage[]
  >([]);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [returnPath, setReturnPath] = useState<string>('/');

  useEffect(() => {
    const fetchPersonalizedMessages = async () => {
      setLoading(true);
      try {
        // In a real application, you'd fetch this from an API
        const messages = localStorage.getItem('personalizedMessages');
        if (messages) {
          setPersonalizedMessages(JSON.parse(messages));
        }

        // Load existing selected messages
        const storedSelectedMessages = localStorage.getItem(
          'selectedPersonalizedMessages'
        );
        if (storedSelectedMessages) {
          setSelectedMessages(JSON.parse(storedSelectedMessages));
        }

        // Get the current product ID and return path
        const productId = localStorage.getItem('currentItemId');
        const savedReturnPath = localStorage.getItem('returnPath');
        if (productId) setCurrentProductId(productId);
        if (savedReturnPath) setReturnPath(savedReturnPath);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedMessages();
  }, []);

  const handleSelectMessage = (message: PersonalizedMessage) => {
    if (!currentProductId) return;

    // Create a copy of the message with the product ID
    const messageWithProduct = {
      ...message,
      productId: currentProductId,
    };

    // Update selected messages
    const existingMessageIndex = selectedMessages.findIndex(
      (msg) => msg.productId === currentProductId
    );

    let updatedMessages;
    if (existingMessageIndex >= 0) {
      // Replace existing message for this product
      updatedMessages = [...selectedMessages];
      updatedMessages[existingMessageIndex] = messageWithProduct;
    } else {
      // Add new message
      updatedMessages = [...selectedMessages, messageWithProduct];
    }

    // Save to localStorage
    localStorage.setItem(
      'selectedPersonalizedMessages',
      JSON.stringify(updatedMessages)
    );

    // Clean up
    localStorage.removeItem('currentItemId');
    localStorage.removeItem('returnPath');

    // Navigate back
    router.push(returnPath);
  };

  const isMessageSelected = (messageId: string): boolean => {
    return selectedMessages.some(
      (msg) => msg.image_id === messageId && msg.productId === currentProductId
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="at-maincontentwrapper">
        <div className="at-pagesectiontitle">
          <h2>Select a Personalized Message</h2>
        </div>
        <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {personalizedMessages.map((message) => (
            <div
              key={message.image_id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isMessageSelected(message.image_id)
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleSelectMessage(message)}
            >
              <div className="relative">
                <img
                  src={message.image_path}
                  alt={message.name}
                  className="w-full h-48 object-cover rounded"
                />
                <input
                  type="checkbox"
                  checked={isMessageSelected(message.image_id)}
                  onChange={() => handleSelectMessage(message)}
                  className="absolute top-2 right-2 w-4 h-4"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-semibold">{message.name}</h3>
                <p className="text-sm text-gray-600">{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => router.push(returnPath)}
            className="at-btn secondary"
          >
            Cancel
          </button>
          <a href="/personalize">
            <button className="at-btn">Create New Message</button>
          </a>
        </div>
      </div>
    </>
  );
};

export default withAuth(MessagesPage);
