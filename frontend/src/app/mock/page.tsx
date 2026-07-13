"use client";

import 'regenerator-runtime/runtime';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Play, Send, Code, Terminal, CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles, HelpCircle, Mic, MicOff, Volume2 } from 'lucide-react';

interface ChatMessage {
  sender: string;
  content: string;
  type?: 'CHAT' | 'TYPING' | 'EVALUATION' | 'JOIN';
}

export default function MockPage() {
  const { user, loading: authLoading } = useAuth();
  
  // Interview Setup States
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [title, setTitle] = useState("Java Backend Developer Mock");
  
  // Live Interview States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatCompleted, setChatCompleted] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  // Speech Recognition
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInputVal(transcript);
    }
  }, [transcript]);

  // WebSocket Connection
  useEffect(() => {
    if (!interviewStarted || !user) return;
    
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/public', (msg) => {
          const body = JSON.parse(msg.body);
          if (body.type === 'CHAT') {
            setIsTyping(false);
            setMessages(prev => [...prev, body]);
            speak(body.content);
          } else if (body.type === 'TYPING') {
            setIsTyping(true);
          }
        });
        
        stompClient.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({ sender: user.fullName, type: 'JOIN', content: 'Joined' })
        });

        // Initial Greeting
        setTimeout(() => {
            const greeting = "Welcome to your Mock Session. I am your AI Interviewer. Tell me a bit about your experience related to this role.";
            setMessages(prev => [...prev, { sender: "AI Interviewer", content: greeting, type: 'CHAT' }]);
            speak(greeting);
        }, 1000);
      }
    });
    
    stompClient.activate();
    stompClientRef.current = stompClient;
    
    return () => {
      stompClient.deactivate();
    };
  }, [interviewStarted, user]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition. Please type your answers.");
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setInterviewStarted(true);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || chatCompleted || !user || !stompClientRef.current) return;

    const userMsg = inputVal.trim();
    setInputVal("");
    resetTranscript();
    if (listening) SpeechRecognition.stopListening();

    const msgObj: ChatMessage = { sender: user.fullName, content: userMsg, type: 'CHAT' };
    setMessages(prev => [...prev, msgObj]);
    
    stompClientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(msgObj)
    });
  };

  // Auth Loading
  if (authLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-purple border-t-transparent animate-spin mb-4"></div>
      </main>
    );
  }

  // Guest Redirect Shield
  if (!user) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-16 px-6">
        <div className="relative z-10 text-center max-w-md p-8 rounded-2xl border border-charcoal-light bg-charcoal/30 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white font-display mb-3">Access Denied</h1>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-gray-200 shadow-glowing">
            Authenticate Session
          </Link>
        </div>
      </main>
    );
  }

  if (!interviewStarted) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-16 px-6">
        <div className="relative z-10 w-full max-w-lg glass-panel p-8 rounded-2xl border border-charcoal-light shadow-glass">
          <h2 className="text-2xl font-bold text-center text-white mb-6 font-display">Configure AI Mock Session</h2>
          <form onSubmit={handleStartSession} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Session Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white" />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-white text-black font-bold text-xs hover:bg-gray-200 mt-6 shadow-glowing">
              Launch Voice Interview
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-8 px-6 flex justify-center">
      <div className="w-full max-w-3xl glass-panel p-6 rounded-2xl border border-charcoal-light flex flex-col h-[750px] justify-between z-10">
        
        <div className="flex items-center justify-between border-b border-charcoal-light/40 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-brand-purple animate-pulse" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Live Audio Interview Room</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar">
          {messages.map((m, index) => (
            <div key={index} className={`max-w-[85%] p-4 rounded-xl text-xs leading-relaxed ${m.sender === user.fullName ? 'ml-auto bg-brand-purple bg-opacity-20 text-gray-200 border border-brand-purple/20' : 'bg-charcoal/50 text-gray-300 border border-charcoal-light'}`}>
              <span className="block font-bold text-[9px] uppercase tracking-wider text-gray-500 mb-1.5">{m.sender}</span>
              <p className="whitespace-pre-line">{m.content}</p>
            </div>
          ))}
          {isTyping && (
            <div className="bg-charcoal/30 text-gray-400 border border-charcoal-light p-4 rounded-xl text-xs max-w-[85%] animate-pulse">
              AI Interviewer is listening and formulating a response...
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <button 
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-lg transition-colors ${listening ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-charcoal border border-charcoal-light text-gray-400 hover:text-white'}`}
          >
            {listening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Speak or type your answer..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-purple"
            />
            <button type="submit" disabled={!inputVal.trim()} className="px-4 py-3 rounded-lg bg-white text-black hover:bg-gray-200 disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
