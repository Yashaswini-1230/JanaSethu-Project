// src/pages/Chatbot.tsx
import React, { useState } from "react";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-janasethu.site", // Optional
          "X-Title": "Jana Sethu",                        // Optional
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // ✅ Switch to a known working free model
          messages: newMessages,
        }),
      });

      const data = await response.json();

      console.log("✅ Response from OpenRouter:", data); // Debugging log

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from model.");
      }

      const reply = data.choices[0].message;
      setMessages([...newMessages, reply]);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't respond. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Ask Jana AI 🤖</h1>

      <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
              <strong>{msg.role === "user" ? "You" : "JanaBot"}:</strong> {msg.content}
            </span>
          </div>
        ))}
        {loading && <p className="text-muted-foreground">JanaBot is typing...</p>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
// ------------------------------------------------------------------------------------------
// src/pages/Chatbot.tsx
// import React, { useState } from "react";
// import { AppSidebar } from "@/components/AppSidebar"; // Import the sidebar component

// const Chatbot: React.FC = () => {
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { role: "user", content: input }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: "Bearer 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",
//           "Content-Type": "application/json",
//           "HTTP-Referer": "https://your-janasethu.site",
//           "X-Title": "Jana Sethu",
//         },
//         body: JSON.stringify({
//           model: "openai/gpt-3.5-turbo",
//           messages: newMessages,
//         }),
//       });

//       const data = await response.json();

//       console.log("✅ Response from OpenRouter:", data);

//       if (!data.choices || data.choices.length === 0) {
//         throw new Error("No response from model.");
//       }

//       const reply = data.choices[0].message;
//       setMessages([...newMessages, reply]);
//     } catch (error) {
//       console.error("❌ Error sending message:", error);
//       setMessages([
//         ...newMessages,
//         { role: "assistant", content: "Sorry, I couldn't respond. Please try again later." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <AppSidebar />

//       {/* Main Chat Area */}
//       <div className="flex-1 max-w-4xl mx-auto p-6 space-y-4">
//         <h1 className="text-2xl font-bold text-center">Ask Jana AI 🤖</h1>

//         <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-white">
//           {messages.map((msg, idx) => (
//             <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
//               <span
//                 className={`inline-block p-2 rounded-lg text-sm ${
//                   msg.role === "user" ? "bg-blue-100" : "bg-green-100"
//                 }`}
//               >
//                 <strong>{msg.role === "user" ? "You" : "JanaBot"}:</strong> {msg.content}
//               </span>
//             </div>
//           ))}
//           {loading && <p className="text-muted-foreground">JanaBot is typing...</p>}
//         </div>

//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="flex-1 border rounded p-2"
//             placeholder="Type your question..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button
//             className="bg-primary text-white px-4 py-2 rounded"
//             onClick={sendMessage}
//             disabled={loading}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
// -------------------------------------------------------------------------------------------
// src/pages/Chatbot.tsx
// src/pages/Chatbot.tsx
//-------------------------------------------------
// import React, { useState } from "react";
// import { AppSidebar } from "@/components/AppSidebar"; // ✅ Import your sidebar

// const Chatbot: React.FC = () => {
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { role: "user", content: input }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: "Bearer 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",
//           "Content-Type": "application/json",
//           "HTTP-Referer": "https://your-janasethu.site", // Optional
//           "X-Title": "Jana Sethu",                        // Optional
//         },
//         body: JSON.stringify({
//           model: "openai/gpt-3.5-turbo",
//           messages: newMessages,
//         }),
//       });

//       const data = await response.json();

//       if (!data.choices || data.choices.length === 0) {
//         throw new Error("No response from model.");
//       }

//       const reply = data.choices[0].message;
//       setMessages([...newMessages, reply]);
//     } catch (error) {
//       console.error("❌ Error sending message:", error);
//       setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't respond. Please try again later." }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* ✅ Sidebar */}
//       <AppSidebar />

//       {/* ✅ Chat UI next to sidebar */}
//       <div className="flex-1 p-4 space-y-4 bg-gray-50">
//         <h1 className="text-2xl font-bold text-center">Ask Jana AI 🤖</h1>

//         <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-white shadow">
//           {messages.map((msg, idx) => (
//             <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
//               <span className={`inline-block p-2 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
//                 <strong>{msg.role === "user" ? "You" : "JanaBot"}:</strong> {msg.content}
//               </span>
//             </div>
//           ))}
//           {loading && <p className="text-muted-foreground">JanaBot is typing...</p>}
//         </div>

//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="flex-1 border rounded p-2"
//             placeholder="Type your question..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button className="bg-primary text-white px-4 py-2 rounded" onClick={sendMessage} disabled={loading}>
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
