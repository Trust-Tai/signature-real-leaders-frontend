// import React, { useState } from 'react';
// import Button from './Button';

// interface NewsletterSetupSectionProps {
//   onSubmit: (data: { provider: string; listUrl: string; apiKey?: string }) => void;
// }

// const NewsletterSetupSection: React.FC<NewsletterSetupSectionProps> = ({ onSubmit }) => {
//   const [provider, setProvider] = useState('');
//   const [listUrl, setListUrl] = useState('');
//   const [apiKey, setApiKey] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit({ provider, listUrl, apiKey: apiKey || undefined });
//   };

//   return (
//     <div className="w-full animate-fade-in-up">
//       <div className="mb-6">
//         <h2 className="section-title text-[#333333] text-center animate-fade-in-down">Setup your Newsletter</h2>
//         <p className="text-center mt-2 font-outfit text-[#333333] animate-fade-in">
//           Connect your newsletter so your audience can subscribe.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-5">
//          <div className='firstVerifyScreen group'>
//         <input
//           type="text"
//           value={provider}
//           onChange={(e) => setProvider(e.target.value)}
//           className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
//           style={{ color: '#949494' }}
//           placeholder="Email Service Provider (e.g., Mailchimp, Substack)"
//         />
// </div>
//  <div className='firstVerifyScreen group'>
//         <input
//           type="url"
//           value={listUrl}
//           onChange={(e) => setListUrl(e.target.value)}
//           className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
//           style={{ color: '#949494' }}
//           placeholder="Signup/List URL"
//         />
// </div>
//  <div className='firstVerifyScreen group'>
//         <input
//           type="password"
//           value={apiKey}
//           onChange={(e) => setApiKey(e.target.value)}
//           className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
//           style={{ color: '#949494' }}
//           placeholder="API Key (optional)"
//         />
// </div>
//         <div className="flex justify-center pt-2">
//           <Button type="submit" className="custom-btn !px-0 !py-0 bg-custom-red hover:bg-custom-red transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300">
//             Save & Continue
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default NewsletterSetupSection;

import React, { useState } from "react";
import Button from "./Button";
import { Mail, Database } from "lucide-react"; // icons for cards

interface NewsletterSetupSectionProps {
  onSubmit: (data: { provider: string; listUrl: string; apiKey?: string }) => void;
}

const NewsletterSetupSection: React.FC<NewsletterSetupSectionProps> = ({
  onSubmit,
}) => {
  const [provider, setProvider] = useState<"Mailchimp" | "HubSpot" | "">("");
  const [listUrl, setListUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return; // safety
    onSubmit({ provider, listUrl, apiKey: apiKey || undefined });
  };

  return (
    <div className="w-full animate-fade-in-up">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="section-title text-[#333333] text-center animate-fade-in-down">
          Setup your Newsletter
        </h2>
        <p className="text-center mt-2 font-outfit text-[#333333] animate-fade-in">
          Choose your provider and connect your newsletter.
        </p>
      </div>

      {/* Step 1: Select Provider */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Mailchimp Card */}
        <div
          onClick={() => setProvider("Mailchimp")}
          className={`cursor-pointer border rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
            provider === "Mailchimp"
              ? "border-custom-red shadow-2xl -translate-y-2 bg-pink-50 scale-105"
              : "border-gray-200 shadow-lg hover:border-custom-red hover:bg-pink-50 hover:scale-105"
          }`}
        >
          <Mail className="w-12 h-12 text-custom-red" />
          <h3 className="font-outfit text-xl font-bold text-[#333333]">Mailchimp</h3>
          <p className="text-sm text-gray-600 text-center">
            Connect via API Key and List URL
          </p>
        </div>

        {/* HubSpot Card */}
        <div
          onClick={() => setProvider("HubSpot")}
          className={`cursor-pointer border rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
            provider === "HubSpot"
              ? "border-custom-red shadow-2xl -translate-y-2 bg-blue-50 scale-105"
              : "border-gray-200 shadow-lg hover:border-custom-red hover:bg-blue-50 hover:scale-105"
          }`}
        >
          <Database className="w-12 h-12 text-custom-red" />
          <h3 className="font-outfit text-xl font-bold text-[#333333]">HubSpot</h3>
          <p className="text-sm text-gray-600 text-center">
            Connect via API Key and List URL
          </p>
        </div>
      </div>

      {/* Step 2: Form (visible only after provider selection) */}
      {provider && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="firstVerifyScreen group">
            <input
              type="url"
              value={listUrl}
              onChange={(e) => setListUrl(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: "#949494" }}
              placeholder={`${provider} Signup/List URL`}
              required
            />
          </div>
          <div className="firstVerifyScreen group">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: "#949494" }}
              placeholder={`${provider} API Key`}
              required
            />
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="custom-btn !px-0 !py-0 bg-custom-red hover:bg-custom-red transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              Save & Continue
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewsletterSetupSection;