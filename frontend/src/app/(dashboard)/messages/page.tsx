"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Contact { id:string;name:string;lastMessage:string;time:string;unread:number;online:boolean }
interface Msg { id:string;text:string;sender:string;time:string }
const contacts:Contact[]=[
  {id:"1",name:"Rafiq Hasan",lastMessage:"Yes, I'm available on Sundays at 4 PM.",time:"10:42 AM",unread:2,online:true},
  {id:"2",name:"Nusrat Jahan",lastMessage:"Can we schedule a trial class first?",time:"Yesterday",unread:0,online:false},
  {id:"3",name:"Farzana Akhter",lastMessage:"I teach both ICT and Programming.",time:"Monday",unread:0,online:true},
  {id:"4",name:"Saiful Islam",lastMessage:"My daughter is in Class 8. She needs Physics help.",time:"Jul 2",unread:1,online:false},
  {id:"5",name:"Rahim Uddin",lastMessage:"BDT 700 per hour is my final rate.",time:"Jun 30",unread:0,online:false},
];
const mockMsgs:Record<string,Msg[]>={"1":[{id:"m1",text:"Hello! Are you available for Math tutoring?",sender:"me",time:"10:30 AM"},{id:"m2",text:"Yes! Which class and syllabus?",sender:"Rafiq Hasan",time:"10:35 AM"},{id:"m3",text:"Class 8, NCTB syllabus. 3 days a week.",sender:"me",time:"10:38 AM"},{id:"m4",text:"Sounds good. I charge BDT 800 per hour.",sender:"Rafiq Hasan",time:"10:40 AM"},{id:"m5",text:"Yes, I'm available on Sundays at 4 PM.",sender:"Rafiq Hasan",time:"10:42 AM"}],"2":[{id:"m1",text:"Hi, do you teach English for Class 5?",sender:"me",time:"Yesterday"},{id:"m2",text:"Yes! I have 3 years of experience.",sender:"Nusrat Jahan",time:"Yesterday"},{id:"m3",text:"Can we schedule a trial class first?",sender:"Nusrat Jahan",time:"Yesterday"}],"4":[{id:"m1",text:"Hello, I'm looking for a Physics tutor.",sender:"Saiful Islam",time:"Jul 2"},{id:"m2",text:"My daughter is in Class 8.",sender:"Saiful Islam",time:"Jul 2"}]};

export default function MessagesPage() {
  const router = useRouter();
  const [active,setActive]=useState<string|null>(null);
  const [newMsg,setNewMsg]=useState("");
  useEffect(()=>{if(!isAuthenticated())router.push("/login");},[router]);
  const msgs = active ? (mockMsgs[active]||[]) : [];

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Messages</h1><p className="text-muted-foreground">Chat with tutors and guardians.</p></div>
      <Card className="overflow-hidden" style={{minHeight:"calc(100vh - 220px)"}}>
        <div className="flex h-full divide-x">
          <div className="w-80 shrink-0 max-sm:w-full overflow-y-auto" style={{height:"calc(100vh - 220px)"}}>
            {contacts.map(c=><button key={c.id} onClick={()=>setActive(c.id)} className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${active===c.id?"bg-muted":""}`}><Avatar><AvatarFallback>{c.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar><div className="flex-1 min-w-0"><div className="flex items-center justify-between"><span className="text-sm font-semibold truncate">{c.name}</span><span className="text-xs text-muted-foreground">{c.time}</span></div><div className="flex items-center justify-between mt-0.5"><span className="text-xs text-muted-foreground truncate">{c.lastMessage}</span>{c.unread>0&&<span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{c.unread}</span>}</div></div></button>)}
          </div>
          <div className="flex-1 flex flex-col">
            {!active ? <div className="flex-1 flex items-center justify-center text-muted-foreground"><div className="text-center"><p className="text-sm">Select a conversation</p></div></div> : (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-b"><Avatar><AvatarFallback>{contacts.find(c=>c.id===active)?.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar><p className="text-sm font-semibold">{contacts.find(c=>c.id===active)?.name}</p></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{height:"calc(100vh - 400px)"}}>
                  {msgs.map(m=><div key={m.id} className={`flex ${m.sender==="me"?"justify-end":"justify-start"}`}><div className={`max-w-[75%] rounded-lg px-4 py-2 ${m.sender==="me"?"bg-primary text-primary-foreground":"bg-muted"}`}><p className="text-sm">{m.text}</p><p className={`text-[10px] mt-1 ${m.sender==="me"?"text-primary-foreground/60":"text-muted-foreground"}`}>{m.time}</p></div></div>)}
                </div>
                <div className="flex items-center gap-2 border-t px-4 py-3"><Input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(setNewMsg(""))} placeholder="Type a message..." className="flex-1" /><Button size="icon" disabled={!newMsg.trim()}><Send className="h-4 w-4" /></Button></div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
