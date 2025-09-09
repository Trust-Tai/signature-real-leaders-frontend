import React, { useState } from 'react';
import Button from './Button';

interface NewsletterSetupSectionProps {
  onSubmit: (data: { provider: string; listUrl: string; apiKey?: string }) => void;
}

const NewsletterSetupSection: React.FC<NewsletterSetupSectionProps> = ({ onSubmit }) => {
  const [provider, setProvider] = useState('');
  const [listUrl, setListUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ provider, listUrl, apiKey: apiKey || undefined });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="section-title text-[#333333] text-center">Setup your Newsletter</h2>
        <p className="text-center mt-2 font-outfit text-[#333333]">
          Connect your newsletter so your audience can subscribe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
         <div className='firstVerifyScreen'>
        <input
          type="text"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
          style={{ color: '#949494' }}
          placeholder="Email Service Provider (e.g., Mailchimp, Substack)"
        />
</div>
 <div className='firstVerifyScreen'>
        <input
          type="url"
          value={listUrl}
          onChange={(e) => setListUrl(e.target.value)}
          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
          style={{ color: '#949494' }}
          placeholder="Signup/List URL"
        />
</div>
 <div className='firstVerifyScreen'>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
          style={{ color: '#949494' }}
          placeholder="API Key (optional)"
        />
</div>
        <div className="flex justify-center pt-2">
          <Button type="submit" className="custom-btn !px-0 !py-0 bg-custom-red hover:bg-custom-red">
            Save & Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterSetupSection;


