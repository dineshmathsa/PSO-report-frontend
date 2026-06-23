import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { Sparkles, HelpCircle, AlertCircle } from 'lucide-react';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const messagesEndRef = useRef(null);

  const downloadReportFile = async (reportDownload) => {
    const response = await apiClient.get(reportDownload.downloadUrl, {
      responseType: 'blob',
    });

    const blobUrl = window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/pdf' }),
    );
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', reportDownload.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleSendReport = async (message, file) => {
    if (!activeChatId || !file) {
      return;
    }

    const userMsg = {
      role: 'user',
      content: message || `Uploaded Excel: ${file.name}`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message', message || 'Generate PSO report');

      const response = await apiClient.post(`/chat/${activeChatId}/report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedChat = response.data?.chat;

      if (updatedChat?.messages) {
        setMessages(updatedChat.messages);
      } else {
        const reply = response.data?.reply || 'Report generated successfully.';
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      }

      if (updatedChat) {
        setChats((prev) => {
          const nextChats = prev.map((chat) =>
            chat.id === updatedChat.id
              ? { ...chat, title: updatedChat.title, updatedAt: updatedChat.updatedAt }
              : chat,
          );

          return nextChats.sort(
            (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
          );
        });
      }

      if (response.data?.reportDownload) {
        try {
          await downloadReportFile(response.data.reportDownload);
        } catch (downloadErr) {
          console.error(downloadErr);
          setErrorMsg('Report was generated but the PDF download failed. Please try again.');
        }
      }
    } catch (err) {
      console.error(err);
      const errText = err.response?.data?.message || err.message || 'Failed to generate report.';
      setErrorMsg(errText);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Error:** ${errText}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const bootstrapChats = async () => {
      setIsBootstrapping(true);
      setErrorMsg('');

      try {
        const response = await apiClient.get('/chat');
        const loadedChats = response.data || [];

        if (loadedChats.length === 0) {
          const createResponse = await apiClient.post('/chat');
          const newChat = createResponse.data;
          setChats([newChat]);
          setActiveChatId(newChat.id);
          setMessages(newChat.messages || []);
          return;
        }

        setChats(loadedChats);
        setActiveChatId(loadedChats[0].id);

        const chatResponse = await apiClient.get(`/chat/${loadedChats[0].id}`);
        setMessages(chatResponse.data.messages || []);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.response?.data?.message || 'Failed to load chat history.');
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapChats();
  }, []);

  useEffect(() => {
    if (!activeChatId || isBootstrapping) {
      return;
    }

    const loadChat = async () => {
      try {
        const response = await apiClient.get(`/chat/${activeChatId}`);
        setMessages(response.data.messages || []);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.response?.data?.message || 'Failed to load chat messages.');
      }
    };

    loadChat();
  }, [activeChatId, isBootstrapping]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    if (!activeChatId) {
      return;
    }

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await apiClient.post(`/chat/${activeChatId}/messages`, { message: text });
      const updatedChat = response.data?.chat;

      if (updatedChat?.messages) {
        setMessages(updatedChat.messages);
      } else {
        const reply = response.data?.reply || 'No response returned from the server.';
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      }

      if (updatedChat) {
        setChats((prev) => {
          const nextChats = prev.map((chat) =>
            chat.id === updatedChat.id
              ? { ...chat, title: updatedChat.title, updatedAt: updatedChat.updatedAt }
              : chat,
          );

          return nextChats.sort(
            (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
          );
        });
      }

      if (response.data?.reportDownload) {
        try {
          await downloadReportFile(response.data.reportDownload);
        } catch (downloadErr) {
          console.error(downloadErr);
          setErrorMsg('Report was generated but the PDF download failed. Please try again.');
        }
      }
    } catch (err) {
      console.error(err);
      const errText = err.response?.data?.message || err.message || 'Failed to get response from AI assistant.';
      setErrorMsg(errText);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Error:** ${errText}. Please ensure the backend is running at \`http://localhost:5000\`.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setErrorMsg('');
  };

  const handleNewChat = async () => {
    setErrorMsg('');

    try {
      const response = await apiClient.post('/chat');
      const newChat = response.data;

      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setMessages(newChat.messages || []);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to create a new chat.');
    }
  };

  const starterPrompts = [
    { label: 'Q2 Performance Summary', prompt: 'Please write a concise Q2 performance summary report for our project portfolio.' },
    { label: 'Resource Utilization Audit', prompt: 'Analyze our current team utilization and outline recommendations for optimizing bench resources.' },
    { label: 'Forecast Next Quarter Revenue', prompt: 'Based on a 15% growth rate and our pipeline of $4M, forecast our service revenue for next quarter.' },
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0b0f19]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 overflow-y-auto bg-slate-950/20">
          <div className="h-full flex flex-col justify-between">
            {errorMsg && (
              <div className="mx-4 mt-4 md:mx-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isBootstrapping ? (
              <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                Loading your report chats...
              </div>
            ) : (
              <div className="w-full">
                {messages.map((msg, index) => (
                  <ChatMessage key={index} message={msg} />
                ))}

                {isLoading && (
                  <div className="flex w-full gap-4 py-6 px-4 md:px-6 bg-slate-900/30 border-y border-slate-900/40 justify-start">
                    <div className="flex max-w-3xl gap-4 items-start">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-slate-300">Reporting Assistant</span>
                          <span className="text-[10px] text-slate-500">Typing...</span>
                        </div>
                        <div className="flex items-center gap-1 py-2 px-1">
                          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {!isBootstrapping && messages.length <= 1 && !isLoading && (
              <div className="max-w-3xl mx-auto px-4 py-8 w-full">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Suggested Starting Points
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {starterPrompts.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(starter.prompt)}
                      className="text-left p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 group hover:scale-[1.01]"
                    >
                      <span className="text-xs font-semibold text-slate-300 group-hover:text-emerald-400 block mb-1">
                        {starter.label}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                        {starter.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          onSendReport={handleSendReport}
          isLoading={isLoading || isBootstrapping || !activeChatId}
        />
      </div>
    </div>
  );
};

export default Chat;
