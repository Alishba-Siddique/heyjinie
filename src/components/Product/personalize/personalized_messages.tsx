// src/components/personalized_messages/personalized_messages.tsx
'use client';
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
}

interface PersonalizedMessagesProps {
  personalizedList: PersonalizedMessage[];
  loading: boolean;
  error: string | null;
  selectedMessages: PersonalizedMessage[];
  onSelectMessage: (messages: PersonalizedMessage[]) => void;
}

const PersonalizedMessages: React.FC<PersonalizedMessagesProps> = ({
  personalizedList,
  loading,
  error,
  selectedMessages,
  onSelectMessage,
}) => {
  const [checkedMessages, setCheckedMessages] = useState<Set<string>>(new Set(selectedMessages.map(msg => msg.image_id)));

  const handleSelectMessage = (message: PersonalizedMessage) => {
    const updatedCheckedMessages = new Set(checkedMessages);
    if (updatedCheckedMessages.has(message.image_id)) {
      updatedCheckedMessages.delete(message.image_id);
    } else {
      updatedCheckedMessages.add(message.image_id);
    }
    setCheckedMessages(updatedCheckedMessages);
    const updatedMessages = personalizedList.filter(msg => updatedCheckedMessages.has(msg.image_id));
    onSelectMessage(updatedMessages);
  };

  return (
    <div className="p-4">
      <div className="at-pagesectiontitle">
        <h2>Your Personalized Messages</h2>
      </div>
      <div className="at-shopcategoriesgrid">
        {loading && (
          <>
            {[...Array(5)].map((_, index) => (
              <div className="at-shopcategorieitems" key={index}>
                <Skeleton className="h-40 w-full" />
              </div>
            ))}
          </>
        )}
        {error && <p className="error-message">{error}</p>}
        {!loading && personalizedList?.length === 0 && !error ? (
          <p>No personalized messages yet.</p>
        ) : null}

        {!loading &&
          personalizedList?.length > 0 &&
          personalizedList.map((item, index) => (
            <div
              key={`${item.image_id}-${index}`}
              className="at-shopcategorieitems cursor-pointer relative"
              onClick={() => handleSelectMessage(item)}
            >
              <img src={item.image_path} alt={item.name} className="w-full h-40 object-cover" />
              <div className="at-message-details">
                <h3>{item.name}</h3>
                <p>{item.message}</p>
                <input
                  type="checkbox"
                  checked={checkedMessages.has(item.image_id)}
                  onChange={() => handleSelectMessage(item)}
                  className="absolute top -2 right-2"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PersonalizedMessages;