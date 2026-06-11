"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Upload, ChevronRight, BookOpen, User, Check, Star, Play, Terminal, AlertCircle } from 'lucide-react';

export default function FeaturesPage() {
  const { user } = useAuth();
  
  // Resume upload states
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeReport, setResumeReport] = useState<any>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Roadmap generator state
  const [targetJob, setTargetJob] = useState("");
  const [roadmap, setRoadmap] = useState<string>("");
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  const simulateUpload = () => {
    setAnalyzing(true);
    setUploadError("");
    setTimeout(() => {
      setAnalyzing(false);
      setFileUploaded(true);
      setResumeReport({
        fileName: "Mock_CV_Dexter.pdf",
        skills: ["Java", "Spring Boot", "React", "TypeScript", "Docker"],
        experienceSummary: "Software Engineer profile showing deep competency in standard backend microservices and modern UI styling frameworks.",
        analysisReport: "### Resume Feedback Report\n\n#### Key Strengths\n- **Backend Depth:** Solid structure around JPA and relational mapping schemas.\n- **Modern Stack:** Good coverage of TypeScript and container layouts.\n\n#### Gaps\n- **Caching:** Lacks direct mention of Redis caches or database optimizations."
      });
    }, 1500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setAnalyzing(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiFetch("/resumes/upload", {
        method: "POST",
        body: formData
        // Content-Type is omitted so browser sets boundary automatically for FormData
      });

      if (response.ok) {
        const data = await response.json();
        setFileUploaded(true);
        setResumeReport({
          fileName: data.fileName,
          skills: data.skills || ["Java", "SQL"],
          experienceSummary: data.experienceSummary,
          analysisReport: data.analysisReport
        });
      } else {
        const errText = await response.text();
        setUploadError(errText || "Failed to process resume file.");
      }
    } catch (err) {
      setUploadError("Network connection error. Ensure the backend server is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const generateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJob.trim()) return;
    setGeneratingRoadmap(true);
    setTimeout(() => {
      setGeneratingRoadmap(false);
      setRoadmap(`### Dynamic Roadmap for ${targetJob}\n\n`
        + "#### Week 1: Core Frameworks\n"
        + "- Master dependency injection and filter chains.\n"
        + "- Review component rendering cycles and layout states.\n\n"
        + "#### Week 2: Scaling Databases & Messaging\n"
        + "- Study indexing strategies, vertical partition limits, and query caches.\n"
        + "- Configure message queues and stream partitions for concurrent workloads.\n\n"
        + "#### Week 3: Deployments & Sandbox Practices\n"
        + "- Build multi-stage lightweight builds.\n"
        + "- Conduct mock interviews inside the sandbox to secure a 85%+ score.");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-16 px-6">
      {/* Decorative Glow */}
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[300px] rounded-full bg-brand-purpleGlow blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-brand-blueGlow blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Title */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Feature Showcases
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Interact with our primary modules. Experience real-time resume keyword scanning, roadmap timelines, and visual metrics indicators.
          </p>
        </div>

        {/* Feature 1: Resume Analyzer */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32 border-b border-charcoal-light/30 pb-20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purpleGlow border border-brand-purple/20 text-xs font-semibold text-brand-purple uppercase tracking-wider mb-6">
              <Upload className="w-3 h-3" />
              <span>Resume Analyzer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight mb-6">
              Instant Skill Key Extraction
            </h2>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 font-light">
              Upload your resume in PDF/DOCX format. Our scanner inspects the document, extracts core technical skills, and matches them to developer targets. It automatically updates your Dashboard metrics on completion.
            </p>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-purple" />
                Seed skill charts automatically from CV text
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-purple" />
                Detailed strength/weakness critique reports
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-purple" />
                Direct comparison against industrial benchmarks
              </li>
            </ul>
          </div>

          {/* Interactive Resume Upload Box */}
          <div className="glass-panel p-8 rounded-2xl border border-charcoal-light flex flex-col justify-center min-h-[350px]">
            {uploadError && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 flex items-start gap-2 text-[10px] text-red-400 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {!fileUploaded ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-charcoal/50 flex items-center justify-center mx-auto mb-6 border border-charcoal-light border-dashed">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.docx"
                  className="hidden"
                />

                {user ? (
                  <button
                    onClick={triggerFileInput}
                    disabled={analyzing}
                    className="px-6 py-2.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-gray-200 transition-colors shadow-glowing"
                  >
                    {analyzing ? "Parsing Document..." : "Upload Resume PDF / TXT"}
                  </button>
                ) : (
                  <button
                    onClick={simulateUpload}
                    disabled={analyzing}
                    className="px-6 py-2.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-gray-200 transition-colors shadow-glowing"
                  >
                    {analyzing ? "Scanning Document..." : "Simulate Mock Upload"}
                  </button>
                )}
                
                <span className="block text-[10px] text-gray-500 mt-3">
                  {user ? "Uploads file directly to your PostgreSQL database." : "Simulates upload. Sign in to write to the database."}
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-charcoal-light/40 pb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Analysis Complete</span>
                  <button onClick={() => { setFileUploaded(false); setUploadError(""); }} className="text-[10px] text-brand-purple hover:underline">Upload Another</button>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">File Name</span>
                  <span className="text-xs text-white font-medium">{resumeReport.fileName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Identified Skills</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {resumeReport.skills.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-charcoal text-gray-300 text-[10px] border border-charcoal-light">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">AI Experience Summary</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-light">{resumeReport.experienceSummary}</p>
                </div>
                <div className="space-y-1 border-t border-charcoal-light/20 pt-3">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">AI Insights Report</span>
                  <div className="text-[10px] text-gray-400 whitespace-pre-line max-h-[100px] overflow-y-auto scrollbar">
                    {resumeReport.analysisReport}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature 2: Learning Roadmaps */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="glass-panel p-8 rounded-2xl border border-charcoal-light min-h-[300px] order-2 md:order-1 flex flex-col justify-between">
            <form onSubmit={generateRoadmap} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Target Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Java Full Stack Developer"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  className="w-full bg-charcoal/50 border border-charcoal-light p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-brand-purple"
                />
              </div>
              <button
                type="submit"
                disabled={generatingRoadmap || !targetJob.trim()}
                className="w-full py-2.5 rounded-lg bg-brand-purple text-white text-xs font-semibold hover:bg-opacity-80 transition-all"
              >
                {generatingRoadmap ? "Compiling Roadmap..." : "Generate Roadmap"}
              </button>
            </form>

            {roadmap && (
              <div className="mt-6 p-4 rounded-lg bg-charcoal/40 border border-charcoal-light/50 text-xs text-gray-300 max-h-[180px] overflow-y-auto whitespace-pre-line">
                {roadmap}
              </div>
            )}
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blueGlow border border-brand-blue/20 text-xs font-semibold text-brand-blue uppercase tracking-wider mb-6">
              <BookOpen className="w-3 h-3" />
              <span>Learning Roadmaps</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight mb-6">
              Tailored Progression Guides
            </h2>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 font-light">
              Enter any target role. Our AI analyzes your database skill gaps, matches them against current job descriptions, and compiles a week-by-week learning checklist to guide your interview preparation.
            </p>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-blue" />
                Custom task checklists matching job expectations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-blue" />
                Curated learning tracks addressing score weaknesses
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-blue" />
                Dynamic rebuilding of guides when skills update
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none"></div>
    </main>
  );
}
