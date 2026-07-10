"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Client } from '@stomp/stompjs';
import { Play, Send, Code, Terminal, CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface ChatMessage {
  sender: string;
  content: string;
  type?: 'CHAT' | 'TYPING' | 'EVALUATION';
}

export default function MockPage() {
  const { user, loading: authLoading } = useAuth();
  
  // Interview Setup States
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewId, setInterviewId] = useState<string>("");
  const [title, setTitle] = useState("Java Backend Developer Mock");
  const [jobDescription, setJobDescription] = useState("Spring Boot / Postgres / Kafka System Architect");
  const [interviewType, setInterviewType] = useState("TECHNICAL");
  const [startingSession, setStartingSession] = useState(false);

  // Live Interview States
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatCompleted, setChatCompleted] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<any>(null);

  // Coding States
  const [code, setCode] = useState(`public class Solution {
    public static void main(String[] args) {
        // Explain your locking logic here
        System.out.println("Hello, World!");
    }
}`);
  const [runLogs, setRunLogs] = useState<string[]>([]);
  const [compiling, setCompiling] = useState(false);
  const [testStatus, setTestStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  // WebSocket Connection Hook (Removed for Local Showcase Mode)
  useEffect(() => {
    // In Local Showcase Mode, we bypass WebSockets and handle logic locally
    if (!interviewStarted || !user) return;
    
    // Simulate AI joining the room
    setTimeout(() => {
      console.log("Simulated WebSocket connection established.");
    }, 500);
  }, [interviewStarted, user]);
  // Handle Starting the session
  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setStartingSession(true);

    const isFrontend = title.toLowerCase().includes('front') || jobDescription.toLowerCase().includes('front') || title.toLowerCase().includes('react');

    if (isFrontend) {
      setCode(`function solution() {\n  // Explain your rendering optimization logic here\n  console.log("Hello, Frontend!");\n}`);
    } else {
      setCode(`public class Solution {\n    public static void main(String[] args) {\n        // Explain your locking logic here\n        System.out.println("Hello, World!");\n    }\n}`);
    }

    // LOCAL SHOWCASE MODE: Simulate API backend response
    setTimeout(() => {
      setInterviewId("mock-interview-123");
      
      if (isFrontend) {
        setQuestions([
          { id: 1, questionText: "Can you explain how React's Virtual DOM works and how reconciliation improves rendering performance?" },
          { id: 2, questionText: "How would you optimize a massive data table component in React to maintain 60FPS while scrolling?" }
        ]);
        setMessages([
          {
            sender: "AI Interviewer",
            content: `Welcome to your Succession.AI mock session. Today, we'll cover key frontend architectural elements for ${title}.\n\nLet's begin:\nCan you explain how React's Virtual DOM works and how reconciliation improves rendering performance?`,
            type: 'CHAT'
          }
        ]);
      } else {
        setQuestions([
          { id: 1, questionText: "Can you explain the difference between pessimistic and optimistic locking in a distributed system?" },
          { id: 2, questionText: "How would you design a stateless microservice to handle high-throughput event processing?" }
        ]);
        setMessages([
          {
            sender: "AI Interviewer",
            content: `Welcome to your Succession.AI mock session. Today, we'll cover key backend architectural elements for ${title}.\n\nLet's begin:\nCan you explain the difference between pessimistic and optimistic locking in a distributed system?`,
            type: 'CHAT'
          }
        ]);
      }
      
      setInterviewStarted(true);
      setStartingSession(false);
    }, 1500);
  };

  // Handle Sending a Message / Submitting an Answer
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || chatCompleted || !user) return;

    const userMsg = inputVal.trim();
    setInputVal("");

    setMessages(prev => [...prev, { sender: user.fullName, content: userMsg, type: 'CHAT' }]);
    setIsTyping(true);

    // LOCAL SHOWCASE MODE: Simulate Smart AI Processing
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerMsg = userMsg.toLowerCase();
      
      // Heuristic 1: Conversational or too short
      if (lowerMsg.length < 15 || lowerMsg.includes("how are you") || lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
        setMessages(prev => [...prev, {
          sender: "AI Interviewer",
          content: `I'm an AI mock interviewer, so I don't have feelings! Let's stay focused. Could you please provide a more detailed technical explanation to the question?`,
          type: 'CHAT'
        }]);
        return; // Don't advance
      }

      const isFrontend = questions[0].questionText.includes("React");
      
      // Heuristic 2: Missing key technical terms for Question 1
      if (currentQuestionIndex === 0) {
        if (isFrontend && !lowerMsg.includes("dom") && !lowerMsg.includes("state") && !lowerMsg.includes("render")) {
          setMessages(prev => [...prev, {
            sender: "AI Interviewer",
            content: `Your answer is a bit vague. Can you specifically discuss how React diffs the DOM nodes and minimizes browser reflows?`,
            type: 'CHAT'
          }]);
          return; // Don't advance
        } else if (!isFrontend && !lowerMsg.includes("lock") && !lowerMsg.includes("version") && !lowerMsg.includes("database")) {
          setMessages(prev => [...prev, {
            sender: "AI Interviewer",
            content: `Your answer is a bit vague. Can you specifically discuss how database row-level locks or version numbers apply in this scenario?`,
            type: 'CHAT'
          }]);
          return; // Don't advance
        }
      }
      
      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex < 2) {
        setCurrentQuestionIndex(nextIndex);
        setMessages(prev => [...prev, {
          sender: "AI Interviewer",
          content: `Excellent explanation. You clearly understand the core concepts. \n\nNow for the next question:\n${questions[nextIndex].questionText}`,
          type: 'CHAT'
        }]);
      } else {
        setChatCompleted(true);
        if (isFrontend) {
          setEvaluationReport({
            score: 96,
            summary: "Outstanding technical depth in frontend rendering optimizations.",
            strengths: [
              "Deep understanding of React's reconciliation engine.",
              "Excellent strategies for handling large DOM trees."
            ],
            gaps: [
              "Consider mentioning specific hooks like useMemo or useCallback.",
              "Discussing Web Workers for offloading heavy tasks would be a plus."
            ]
          });
        } else {
          setEvaluationReport({
            score: 94,
            summary: "Outstanding technical depth. System design principles are highly accurate for Senior/Staff roles.",
            strengths: [
              "Excellent grasp of database isolation levels and locking mechanisms.",
              "Clearly articulated event-driven architecture."
            ],
            gaps: [
              "Could mention specific message brokers (like Kafka or RabbitMQ) by name.",
              "Consider addressing idempotency in stateless services."
            ]
          });
        }
      }
    }, 2500);
  };

  // Safe Code Sandbox Compiler API integration
  const handleRunCode = async () => {
    setCompiling(true);
    setRunLogs(["Compiling code structure...", "Parsing syntax tree..."]);

    // LOCAL SHOWCASE MODE: Simulate Java Compilation
    setTimeout(() => {
      setTestStatus('SUCCESS');
      setRunLogs([
        "Compiling code structure...",
        "Parsing syntax tree...",
        "Running Unit Tests [1/1]...",
        "✅ TEST PASSED",
        "Stdout Output: Hello, World!",
        "\nBuild Success. Status: 0"
      ]);
      setCompiling(false);
    }, 2000);
  };

  // Auth Loading
  if (authLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-purple border-t-transparent animate-spin mb-4"></div>
        <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Initializing Room...</span>
      </main>
    );
  }

  // Guest Redirect Shield
  if (!user) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-16 px-6">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-brand-purpleGlow blur-[120px] pointer-events-none animate-pulse-slow"></div>
        <div className="relative z-10 text-center max-w-md p-8 rounded-2xl border border-charcoal-light bg-charcoal/30 backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white font-display mb-3">Access Denied</h1>
          <p className="text-xs text-gray-400 leading-relaxed font-light mb-8">
            Mock interview rooms require active database contexts. Please sign in or register to initiate an AI interview.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-gray-200 transition-colors shadow-glowing"
          >
            Authenticate Session
          </Link>
        </div>
      </main>
    );
  }

  // Interview Startup Screen
  if (!interviewStarted) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-16 px-6">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-purpleGlow blur-[140px] pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-lg glass-panel p-8 rounded-2xl border border-charcoal-light shadow-glass">
          <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-charcoal-light bg-charcoal/50 backdrop-blur-md text-[10px] font-semibold text-brand-purple tracking-widest uppercase mb-6 w-fit mx-auto">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Room Setup</span>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-6 font-display">Configure AI Mock Session</h2>

          <form onSubmit={handleStartSession} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Session Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Target Job Description</label>
              <textarea
                required
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple resize-none scrollbar"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Interview Scope</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple"
              >
                <option value="TECHNICAL">TECHNICAL (JPA, React, Docker, Kafka)</option>
                <option value="BEHAVIORAL">BEHAVIORAL (Leadership, Conflict)</option>
                <option value="SYSTEM_DESIGN">SYSTEM DESIGN (Scaling, Sharding)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={startingSession}
              className="w-full py-3 rounded-lg bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors shadow-glowing mt-6"
            >
              {startingSession ? "Generating AI Room..." : "Launch Mock Console"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Active Live Interview Console
  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-8 px-6">
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[350px] rounded-full bg-brand-purpleGlow/80 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[450px] h-[350px] rounded-full bg-brand-blueGlow/80 blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Column: Live Audio / Chat Workspace */}
        <div className="glass-panel p-6 rounded-2xl border border-charcoal-light flex flex-col h-[650px] justify-between">
          
          {/* Workspace Title */}
          <div className="flex items-center justify-between border-b border-charcoal-light/40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-purple" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">WebSocket Interview Console</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${chatCompleted ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></span>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                {chatCompleted ? 'COMPLETED' : 'LIVE CONVERSATION'}
              </span>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-4 rounded-xl text-xs leading-relaxed ${
                  m.sender === user.fullName
                    ? 'ml-auto bg-brand-purple bg-opacity-20 text-gray-200 border border-brand-purple/20'
                    : 'bg-charcoal/50 text-gray-300 border border-charcoal-light'
                }`}
              >
                <span className="block font-bold text-[9px] uppercase tracking-wider text-gray-500 mb-1.5">{m.sender}</span>
                <p className="whitespace-pre-line">{m.content}</p>
              </div>
            ))}

            {isTyping && (
              <div className="bg-charcoal/30 text-gray-400 border border-charcoal-light p-4 rounded-xl text-xs max-w-[85%] animate-pulse">
                <span className="block font-bold text-[9px] uppercase tracking-wider text-gray-500 mb-1">AI Interviewer</span>
                AI Interviewer is formulating a follow-up...
              </div>
            )}

            {chatCompleted && evaluationReport && (
              <div className="border border-brand-purple/30 bg-brand-purpleGlow p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Evaluation Scorecard</h4>
                  <span className="text-2xl font-black text-brand-purple font-display">{evaluationReport.score}%</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed italic">"{evaluationReport.summary}"</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <span className="block text-[9px] font-bold text-green-500 uppercase tracking-widest">Key Strengths</span>
                    <ul className="text-[10px] text-gray-400 list-disc list-inside space-y-1">
                      {evaluationReport.strengths.map((s: string) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <span className="block text-[9px] font-bold text-yellow-500 uppercase tracking-widest">Growth Gaps</span>
                    <ul className="text-[10px] text-gray-400 list-disc list-inside space-y-1">
                      {evaluationReport.gaps.map((g: string) => <li key={g}>{g}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder={chatCompleted ? "Session complete. Review your scorecard." : "Type your response here..."}
              disabled={chatCompleted}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
            />
            <button
              type="submit"
              disabled={chatCompleted || !inputVal.trim()}
              className="px-4 py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Code Editor Workspace */}
        <div className="glass-panel p-6 rounded-2xl border border-charcoal-light flex flex-col h-[650px] justify-between">
          
          <div className="flex items-center justify-between border-b border-charcoal-light/40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand-cyan" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Sandbox Coding Editor</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleRunCode}
                disabled={compiling}
                className="px-4 py-1.5 rounded bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {compiling ? 'Compiling...' : 'Run Code'}
              </button>
            </div>
          </div>

          {/* Textarea Code Workspace */}
          <div className="flex-1 mb-4 relative rounded-lg border border-charcoal-light/60 overflow-hidden font-mono bg-charcoal-dark bg-opacity-70 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-xs text-brand-cyan resize-none focus:outline-none scrollbar"
              spellCheck={false}
            />
          </div>

          {/* Compiler Terminal Outputs */}
          <div className="h-[200px] bg-black/50 border border-charcoal-light/50 rounded-lg p-4 font-mono text-[10px] overflow-y-auto scrollbar">
            <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-charcoal-light/20 pb-1">
              Terminal stdout logs
            </span>
            {runLogs.length === 0 ? (
              <span className="text-gray-500">No logs. Click 'Run Code' to execute test cases.</span>
            ) : (
              <div className="space-y-1">
                {runLogs.map((log, i) => (
                  <p key={i} className={log.includes("Error") ? "text-red-400" : log.includes("PASSED") ? "text-green-400" : "text-gray-300"}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none"></div>
    </main>
  );
}
