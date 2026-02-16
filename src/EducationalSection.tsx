import { MailWarning, TrendingDown, Lock } from 'lucide-react';

export default function EducationalSection() {
  return (
    <div className="space-y-8 pt-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">How a Phishing Attack works?</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <MailWarning className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">What is Phishing?</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Phishing is a cyber attack where criminals impersonate legitimate organizations via email or text. Their goal is to trick you into revealing sensitive data, like passwords, bank details, or social security numbers.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10"></div>
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">Financial Devastation</h3>
          {/* <div className="my-3">
            <span className="text-4xl font-extrabold text-slate-900">$2.9B+</span>
          </div> */}
          <p className="text-slate-600 text-sm leading-relaxed">
            <b>$2.9B+</b> Lost annually to Business Email Compromise (BEC) and phishing attacks globally, making it one of the most financially damaging cybercrimes on the internet.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">How AI Protects You</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            In most of the phishing emails there are technical anomalies in email headers (SPF/DKIM/DMARC), an LLM can understand the context, urgency cues and can tell the probability of it being a phishing attack.          </p>
        </div>

      </div>
    </div>
  );
}