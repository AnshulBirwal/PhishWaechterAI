import { useState, useRef, useEffect } from 'react';
import { MailCheck, ShieldCheck, AlertTriangle, Loader2, Info, Sparkles, Github } from 'lucide-react';
import type { AnalysisResult, AnalyzeRequest } from './types';
import EducationalSection from './EducationalSection';

function App() {
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showHeaderInfo, setShowHeaderInfo] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHeaderInfo(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [helpRef]);

  const redactPII = (rawHeaders: string, rawBody: string) => {
    // 1. Find the user's email in the "Delivered-To:" or "To:" header
    const deliveredToMatch = rawHeaders.match(/^Delivered-To:\s*<?([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)>?/im);
    const toMatch = rawHeaders.match(/^To:\s*.*?<?([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)>?/im);

    const targetEmails = [];
    if (deliveredToMatch && deliveredToMatch[1]) targetEmails.push(deliveredToMatch[1]);
    if (toMatch && toMatch[1]) targetEmails.push(toMatch[1]);

    let safeHeaders = rawHeaders;
    let safeBody = rawBody;

    // 2. Replacing all instances of those emails with a placeholder
    targetEmails.forEach((email) => {
      const safeEmailRegex = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
      const regex = new RegExp(safeEmailRegex, 'gi');
      safeHeaders = safeHeaders.replace(regex, '[REDACTED_USER]');
      safeBody = safeBody.replace(regex, '[REDACTED_USER]');
    });

    return { safeHeaders, safeBody };
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // remvong the user's email for privacy
    const { safeHeaders, safeBody } = redactPII(headers, body);

    // sending the clean data
    const payload: AnalyzeRequest = { emailHeaders: safeHeaders, emailBody: safeBody };

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to analyze email');
      
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (err) {
      setError('An error occurred while analyzing the email.');
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Safe': return 'text-green-700 bg-green-100 border-green-200';
      case 'Suspicious': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Phishing': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 pt-8 selection:bg-blue-200">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        
        {/* Main App Container */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold flex justify-center items-center gap-3 tracking-tight text-slate-900">
              <MailCheck className="w-12 h-12 text-blue-600" />
              Phish Wächter AI
            </h1>
            
            {/* Gemini Badge */}
            <div className="flex flex-wrap justify-center gap-3">
              {/* Gemini Badge */}
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Powered by Google Gemini
              </span>
              
              {/* GitHub Source Badge */}
              <a 
                href="https://github.com/AnshulBirwal/PhishWaechterAI" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
                View Source Code
              </a>
            </div>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Paste the email headers and body below for an instant, AI-driven threat analysis.
            </p>
          </div>

          {/* Input Area */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Headers Column */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between relative" ref={helpRef}>
                <label className="font-semibold text-sm text-slate-700">Raw Email Headers (Optional)</label>
                <button 
                  onClick={() => setShowHeaderInfo(!showHeaderInfo)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium transition-colors bg-blue-50 px-2 py-1 rounded-md"
                  title="Where do I find headers?"
                >
                  <Info className="w-4 h-4" />
                  Help
                </button>

                {/* The Info Card */}
                {showHeaderInfo && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 text-slate-100 p-5 rounded-xl text-sm shadow-2xl z-10 animate-in fade-in zoom-in-95 border border-slate-700">
                    <p className="font-bold mb-3 text-blue-300">Where do I find headers?</p>
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>For Gmail, open the suspicious email.</li>
                      <li>Click the <strong>three vertical dots</strong> (More) in the top right corner.</li>
                      <li>Select <strong>"Show original"</strong>.</li>
                      <li>Copy all the text from the top down to the line that says <strong>MIME-Version</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>
              <textarea 
                className="p-4 border border-slate-200 rounded-xl h-64 font-mono text-xs md:text-sm resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50 transition-all placeholder:text-slate-400"
                placeholder="Return-Path: <scammer@fake.com>..."
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
              />
            </div>

            {/* Body Column */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-slate-700">Email Body</label>
              <textarea 
                className="p-4 border border-slate-200 rounded-xl h-64 resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50 transition-all placeholder:text-slate-400"
                placeholder="Dear customer, your account has been compromised. Please click the link below to verify your identity..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleAnalyze}
            disabled={isLoading || (!headers && !body)}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.99] text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Threat...
              </>
            ) : 'Analyze Email'}
          </button>

          {error && <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center font-medium animate-in fade-in">{error}</div>}

          {/* Results Dashboard */}
          {result && (
            <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
                  <p className="text-sm text-slate-500 mt-1 max-w-xl">{result.headerAnalysis}</p>
                </div>
                <div className={`px-6 py-2 rounded-full font-bold text-lg border shadow-sm ${getVerdictColor(result.verdict)}`}>
                  {result.verdict}
                </div>
              </div>

              {/* Threat Meter */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="flex justify-between font-bold text-sm text-slate-700">
                  <span>Threat Level</span>
                  <span className={result.confidenceScore > 70 ? 'text-red-600' : result.confidenceScore > 30 ? 'text-yellow-600' : 'text-green-600'}>
                    {result.confidenceScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${result.confidenceScore > 70 ? 'bg-red-500' : result.confidenceScore > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${result.confidenceScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Findings Grid */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4 bg-red-50/50 p-5 rounded-xl border border-red-100">
                  <h3 className="font-bold flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-5 h-5" /> Red Flags Detected
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 marker:text-red-400">
                    {result.redFlags.length > 0 ? result.redFlags.map((flag, i) => <li key={i}>{flag}</li>) : <li>No specific red flags detected.</li>}
                  </ul>
                </div>
                <div className="space-y-4 bg-green-50/50 p-5 rounded-xl border border-green-100">
                  <h3 className="font-bold flex items-center gap-2 text-green-800">
                    <ShieldCheck className="w-5 h-5" /> Safe Indicators
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 marker:text-green-400">
                    {result.safePoints.length > 0 ? result.safePoints.map((point, i) => <li key={i}>{point}</li>) : <li>No specific safe indicators detected.</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* info part */}
        <EducationalSection />
        
        {/* Footer */}
        <div className="text-center pt-10 pb-4">
          <p className="text-slate-500 text-sm">
            Developed by <a href="https://anshulbirwal.de" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-blue-600 hover:underline transition-colors">AnshulBirwal</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;