import { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, User, Heart, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Mock data - will be replaced with API calls
  const chats = [
    { id: '1', name: 'Dr. Smith', role: 'Endocrinologist', lastMessage: 'Your glucose levels look good', time: '2 hours ago', unread: 2 },
    { id: '2', name: 'Dr. Johnson', role: 'Nutritionist', lastMessage: 'Let\'s review your meal plan', time: '1 day ago', unread: 0 },
  ];

  const messages = selectedChat ? [
    { id: '1', sender: 'Dr. Smith', text: 'Hello! How are you feeling today?', time: '10:30 AM', isDoctor: true },
    { id: '2', sender: user?.name, text: 'Hi Doctor, I\'m doing well. My glucose has been stable.', time: '10:35 AM', isDoctor: false },
    { id: '3', sender: 'Dr. Smith', text: 'That\'s great to hear! Keep monitoring and let me know if anything changes.', time: '10:40 AM', isDoctor: true },
  ] : [];

  const handleSendMessage = () => {
    if (message.trim()) {
      // API call to send message would go here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '280px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Messages / Chat</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <div className="grid grid-cols-[350px_1fr] h-full">
            {/* Chat List */}
            <div className="border-r border-border overflow-y-auto" style={{ padding: '24px' }}>
              <h3 className="text-lg font-semibold mb-4">Healthcare Providers</h3>
              <div className="space-y-2">
                {chats.map((chat) => (
                  <Card 
                    key={chat.id}
                    className={`cursor-pointer hover:bg-secondary/50 transition-all ${selectedChat === chat.id ? 'bg-primary/10 border-primary' : ''}`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm">{chat.name}</p>
                            {chat.unread > 0 && (
                              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{chat.unread}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{chat.role}</p>
                          <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {chat.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{chats.find(c => c.id === selectedChat)?.name}</p>
                        <p className="text-xs text-muted-foreground">{chats.find(c => c.id === selectedChat)?.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isDoctor ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[70%] rounded-lg p-3 ${msg.isDoctor ? 'bg-secondary' : 'bg-primary text-white'}`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.isDoctor ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[60px]"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} className="self-end">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
