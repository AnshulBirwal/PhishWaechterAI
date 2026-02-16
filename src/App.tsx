import { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import type { AnalysisResult, AnalyzeRequest } from './types';

function App() {
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const payload: AnalyzeRequest = { emailHeaders: headers, emailBody: body };

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
      case 'Safe': return 'text-green-600 bg-green-100';
      case 'Suspicious': return 'text-yellow-600 bg-yellow-100';
      case 'Phishing': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen p-8 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-3">
            <ShieldAlert className="w-10 h-10 text-blue-600" />
            AI Phishing Detector
          </h1>
          <p className="text-gray-500">Paste email headers and body below for instant threat analysis.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Raw Email Headers (Optional)</label>
            <textarea 
              className="p-3 border rounded-lg h-64 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              placeholder="Return-Path: <scammer@fake.com>..."
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Email Body</label>
            <textarea 
              className="p-3 border rounded-lg h-64 resize-none focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              placeholder="Dear customer, your account has been compromised..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={isLoading || (!headers && !body)}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze Email'}
        </button>

        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-medium">{error}</div>}

        {result && (
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold">Analysis Complete</h2>
                <p className="text-sm text-gray-500 mt-1">{result.headerAnalysis}</p>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold text-lg ${getVerdictColor(result.verdict)}`}>
                {result.verdict}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-sm">
                <span>Threat Level</span>
                <span>{result.confidenceScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${result.confidenceScore > 70 ? 'bg-red-500' : result.confidenceScore > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                  style={{ width: `${result.confidenceScore}%` }}
                ></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" /> Red Flags
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {result.redFlags.length > 0 ? result.redFlags.map((flag, i) => <li key={i}>{flag}</li>) : <li>None detected.</li>}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-green-700">
                  <ShieldCheck className="w-5 h-5" /> Safe Indicators
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {result.safePoints.length > 0 ? result.safePoints.map((point, i) => <li key={i}>{point}</li>) : <li>None detected.</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;