// import React, { useState } from "react";

// const ChatPage = () => {
//   const [activeChat, setActiveChat] = useState(0); // Track the active chat index

//   const contacts = [
//     {
//       name: "Jacward Wilson",
//       lastMessage: "Hi how are you?",
//       time: "Dec 07",
//       avatar: "https://stagingbackend.heyjinie.com/public/user_profile_images/user_1737049857869.png",
//       messages: [
//         { text: "Hi, how are you?", isSender: false },
//         {
//           text: "Nostrud aliquip mollit magna ipsum est sit ad est deserunt fugiat nulla quis quis.",
//           isSender: true,
//         },
//       ],
//     },
//     {
//       name: "Willson",
//       lastMessage: "fine",
//       time: "Dec 07",
//       avatar: "https://stagingbackend.heyjinie.com/public/user_profile_images/user_1737049857869.png",
//       messages: [
//         { text: "Hello, how's it going?", isSender: false },
//         { text: "All good! What about you?", isSender: true },
//       ],
//     },
//     {
//       name: "Arshad Khan",
//       lastMessage: "fine",
//       time: "Dec 07",
//       avatar: "https://stagingbackend.heyjinie.com/public/user_profile_images/user_1737049857869.png",
//       messages: [
//         { text: "Can you share the file?", isSender: false },
//         { text: "Sure, sending it over.", isSender: true },
//       ],
//     },
//   ];

//   return (
//     <div className="w-full float-left">
//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <div className="w-1/4 bg-white py-4">
//           <h2 className="text-xl font-semibold px-3 mb-4">All Messages (187)</h2>
//           <ul className="">
//             {contacts.map((contact, index) => (
//               <li
//                 key={index}
//                 className={`flex items-center border-b border-solid border-[#D6DADA] p-3 cursor-pointer ${
//                   activeChat === index ? "bg-[#F3F9FF]" : "bg-white"
//                 } hover:bg-[#F3F9FF]`}
//                 onClick={() => setActiveChat(index)} // Set the active chat on click
//               >
//                 <img
//                   src={contact.avatar}
//                   alt={contact.name}
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//                 <div className="flex-1">
//                   <h3 className="font-medium">{contact.name}</h3>
//                   <p className="text-sm text-gray-500 truncate">
//                     {contact.lastMessage}
//                   </p>
//                 </div>
//                 <span className="text-xs text-gray-400">{contact.time}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Chat Window */}
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//             {contacts[activeChat].messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   message.isSender ? "justify-end" : "justify-start"
//                 } items-start`}
//               >
//                 {!message.isSender && (
//                   <img
//                     src={contacts[activeChat].avatar}
//                     alt={contacts[activeChat].name}
//                     className="w-10 h-10 rounded-full mr-3"
//                   />
//                 )}
//                 <div
//                   className={`p-4 rounded-lg max-w-xs ${
//                     message.isSender
//                       ? "bg-[#40A574] text-white"
//                       : "bg-[#88C1FD] text-white"
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* Input Box */}
//           <div className="m-4 flex items-center rounded-2xl py-3 space-x-2 bg-[#F0F1F2]">
//             <input
//               type="text"
//               placeholder="Write Message"
//               className="flex-1 p-3 border rounded-lg bg-[#F0F1F2] focus:outline-none"
//               style={{'background' : '#F0F1F2'}}
//             />
//             <button className="p-2">
//               <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M22.6665 9.33339C22.6665 8.60006 22.0665 8.00006 21.3332 8.00006H5.33321C4.59988 8.00006 3.99988 8.60006 3.99988 9.33339V22.6667C3.99988 23.4001 4.59988 24.0001 5.33321 24.0001H21.3332C22.0665 24.0001 22.6665 23.4001 22.6665 22.6667V18.0001L25.7237 21.0573C26.2444 21.578 27.0887 21.578 27.6094 21.0573C27.8594 20.8072 27.9999 20.4681 27.9999 20.1144V11.8857C27.9999 11.1493 27.4029 10.5523 26.6665 10.5523C26.3129 10.5523 25.9738 10.6928 25.7237 10.9429L22.6665 14.0001V9.33339ZM19.9999 10.6667V21.3334H6.66659V10.6667H19.9999Z" fill="#434343" fillOpacity="0.6"/>
//               </svg>
//             </button>
//             <button className="p-2">
//               <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M25.3333 3.99994H6.66667C5.2 3.99994 4 5.19994 4 6.66661V25.3333C4 26.7999 5.2 27.9999 6.66667 27.9999H25.3333C26.8 27.9999 28 26.7999 28 25.3333V6.66661C28 5.19994 26.8 3.99994 25.3333 3.99994ZM25.3334 25.333H6.6667V6.66631H25.3334V25.333ZM12.7126 18.3821L14.8534 20.9731L18.1335 16.7418C18.4959 16.2742 19.2038 16.2797 19.559 16.7527L22.9224 21.2315C23.3662 21.8225 22.9446 22.6664 22.2055 22.6664H9.83234C9.08642 22.6664 8.6667 21.8086 9.12444 21.2197L11.3135 18.403C11.6657 17.9499 12.347 17.9397 12.7126 18.3821Z" fill="#434343" fillOpacity="0.6"/>
//               </svg>
//             </button>
//             <button className="p-2 ">
//               <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M4.22507 13.5411C3.33328 13.4222 2.66766 12.6608 2.66895 11.7611L2.67616 6.71557C2.67799 5.42924 3.99365 4.56321 5.17588 5.07012L26.8232 14.352C28.2718 14.9731 28.2718 17.0268 26.8232 17.648L5.17589 26.9298C3.99365 27.4367 2.67799 26.5707 2.67616 25.2844L2.66895 20.2388C2.66766 19.3391 3.33328 18.5778 4.22507 18.4588L22.6667 16L4.22507 13.5411ZM15.36 12.3335L5.33338 11.0002L5.34671 8.04015L15.36 12.3335ZM5.33338 23.9598V20.9998L15.3467 19.6665L5.33338 23.9598Z" fill="#434343" fillOpacity="0.6"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect, useRef } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isSender: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessages = [
        ...messages, 
        { text: inputMessage, isSender: true }
      ];
      setMessages(newMessages);
      setInputMessage("");

      // Simulate support response
      setTimeout(() => {
        const supportResponses = [
          "Thank you for your message. How can I help you?",
          "I'm here to assist you with any questions.",
          "Could you provide more details about your issue?"
        ];
        const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)];
        
        setMessages(prevMessages => [
          ...prevMessages, 
          { text: randomResponse, isSender: false }
        ]);
      }, 1000);
    }
  };

  return (
    <div className="w-full float-left">
      <div className="flex h-screen">
        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Support Header */}
          <div className="bg-[#40A574] text-white p-4 flex items-center">
            <img
              src="https://stagingbackend.heyjinie.com/public/user_profile_images/user_1737049857869.png"
              alt="Support"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-medium">Support</h3>
              <p className="text-xs">Online</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isSender ? "justify-end" : "justify-start"
                } items-start`}
              >
                {!message.isSender && (
                  <img
                    src="https://stagingbackend.heyjinie.com/public/user_profile_images/user_1737049857869.png"
                    alt="Support Agent"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div
                  className={`p-4 rounded-lg max-w-xs ${
                    message.isSender
                      ? "bg-[#40A574] text-white"
                      : "bg-[#88C1FD] text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Box */}
          <div className="m-4 flex items-center rounded-2xl py-3 space-x-2 bg-[#F0F1F2]">
            <input
              type="text"
              placeholder="Write your message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-3 border rounded-lg bg-[#F0F1F2] focus:outline-none"
            />
            <button 
              onClick={handleSendMessage} 
              className="p-2"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.22507 13.5411C3.33328 13.4222 2.66766 12.6608 2.66895 11.7611L2.67616 6.71557C2.67799 5.42924 3.99365 4.56321 5.17588 5.07012L26.8232 14.352C28.2718 14.9731 28.2718 17.0268 26.8232 17.648L5.17589 26.9298C3.99365 27.4367 2.67799 26.5707 2.67616 25.2844L2.66895 20.2388C2.66766 19.3391 3.33328 18.5778 4.22507 18.4588L22.6667 16L4.22507 13.5411Z" fill="#434343" fillOpacity="0.6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;