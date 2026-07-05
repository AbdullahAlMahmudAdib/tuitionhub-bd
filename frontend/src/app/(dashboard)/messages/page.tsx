"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  role: "tutor" | "guardian";
}

interface Message {
  id: string;
  text: string;
  sender: "me" | string;
  time: string;
}

const contacts: Contact[] = [
  { id: "1", name: "Rafiq Hasan", lastMessage: "Yes, I'm available on Sundays at 4 PM.", time: "10:42 AM", unread: 2, online: true, role: "tutor" },
  { id: "2", name: "Nusrat Jahan", lastMessage: "Can we schedule a trial class first?", time: "Yesterday", unread: 0, online: false, role: "tutor" },
  { id: "3", name: "Farzana Akhter", lastMessage: "I teach both ICT and Programming.", time: "Monday", unread: 0, online: true, role: "tutor" },
  { id: "4", name: "Saiful Islam (Guardian)", lastMessage: "My daughter is in Class 8. She needs Physics help.", time: "Jul 2", unread: 1, online: false, role: "guardian" },
  { id: "5", name: "Rahim Uddin", lastMessage: "BDT 700 per hour is my final rate.", time: "Jun 30", unread: 0, online: false, role: "tutor" },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", text: "Hello! I saw your profile. Are you available for Math tutoring?", sender: "me", time: "10:30 AM" },
    { id: "m2", text: "Yes, I am! Which class and syllabus?", sender: "Rafiq Hasan", time: "10:35 AM" },
    { id: "m3", text: "Class 8, NCTB syllabus. 3 days a week.", sender: "me", time: "10:38 AM" },
    { id: "m4", text: "Sounds good. I charge BDT 800 per hour. Is that okay?", sender: "Rafiq Hasan", time: "10:40 AM" },
    { id: "m5", text: "Yes, I'm available on Sundays at 4 PM.", sender: "Rafiq Hasan", time: "10:42 AM" },
  ],
  "2": [
    { id: "m1", text: "Hi Nusrat, do you teach English for Class 5?", sender: "me", time: "Yesterday" },
    { id: "m2", text: "Yes, I do! I have 3 years of experience with primary students.", sender: "Nusrat Jahan", time: "Yesterday" },
    { id: "m3", text: "Can we schedule a trial class first?", sender: "Nusrat Jahan", time: "Yesterday" },
  ],
  "4": [
    { id: "m1", text: "Hello, I'm looking for a Physics tutor for my daughter.", sender: "Saiful Islam (Guardian)", time: "Jul 2" },
    { id: "m2", text: "My daughter is in Class 8. She needs Physics help.", sender: "Saiful Islam (Guardian)", time: "Jul 2" },
  ],
};

export default function MessagesPage() {
  const router = useRouter();
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  const messages = activeContact ? (mockMessages[activeContact] || []) : [];

  function handleSend() {
    if (!newMessage.trim()) return;
    // In a real app, this would call the API
    setNewMessage("");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
        <p className="text-neutral-500">Chat with tutors and guardians.</p>
      </div>

      <Card padding="sm" className="overflow-hidden min-h-[500px]">
        <div className="flex h-full divide-x divide-neutral-100">
          {/* Contact list */}
          <div className="w-80 shrink-0 max-sm:w-full overflow-y-auto" style={{ height: "calc(100vh - 260px)" }}>
            <div className="p-3">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveContact(c.id)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-primary-light/50 ${activeContact === c.id ? "bg-primary-light/80" : ""}`}
              >
                <Avatar name={c.name} size="md" online={c.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900 truncate">{c.name}</span>
                    <span className="shrink-0 text-xs text-neutral-400">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-neutral-500 truncate">{c.lastMessage}</span>
                    {c.unread > 0 && (
                      <span className="shrink-0 ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-cta text-[10px] font-bold text-white">{c.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {!activeContact ? (
              <div className="flex-1 flex items-center justify-center text-neutral-400">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="mt-2 text-sm">Select a conversation to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
                  <Avatar name={contacts.find((c) => c.id === activeContact)?.name || ""} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{contacts.find((c) => c.id === activeContact)?.name}</p>
                    <p className="text-xs text-neutral-500">{contacts.find((c) => c.id === activeContact)?.online ? "Online" : "Offline"}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: "calc(100vh - 380px)" }}>
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-lg px-4 py-2 ${m.sender === "me" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-900"}`}>
                        <p className="text-sm">{m.text}</p>
                        <p className={`text-[10px] mt-1 ${m.sender === "me" ? "text-white/60" : "text-neutral-400"}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 border-t border-neutral-100 px-4 py-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                  <Button size="sm" onClick={handleSend} disabled={!newMessage.trim()}>Send</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
