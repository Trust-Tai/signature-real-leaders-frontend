"use client"

import React, {useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useOnboarding } from '@/components/OnboardingContext';



interface ProfileTemplateSectionProps {
  onSubmit: (selectedTemplate: string) => void;
}

const ProfileTemplateSection: React.FC<ProfileTemplateSectionProps> = ({ onSubmit }) => {
  const [remoteTemplates, setRemoteTemplates] = useState<Array<{ id: number; title: string; slug: string; image_url: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const { setState } = useOnboarding();
console.log("remoteTemplates",remoteTemplates)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getProfileTemplates();
        if (mounted) {
          const list = res?.templates ?? [];
          setRemoteTemplates(list);
          // Preselect first if you want auto-preview; comment out to require explicit pick
          if (list.length) setSelectedTemplateId(list[0].id);
        }
      } catch {
        if (mounted) setError('Failed to load templates.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) return;
    setState(prev => ({ ...prev, profile_template_id: selectedTemplateId }));
    onSubmit(String(selectedTemplateId));
  };


  return (
    <div className="w-full animate-fade-in-up relative">
      {/* Full-screen loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  to-zinc-950">

          <div className="relative px-8 py-7 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_0_60px_rgba(255,255,255,0.06)]">
            {/* Dual ring spinner */}
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-white/15" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/80 animate-spin" />
            </div>
            <p className="mt-3 text-white/90 text-sm text-center">Loading templates</p>
            {/* Animated dots */}
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:240ms]" />
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="section-title text-white text-center animate-fade-in-down">Choose your profile template</h2>
        <p className="text-center mt-2 font-outfit" style={{ color: '#333333' }}>Pick a style. You can change this later.</p>
      </div>

      {!loading && error && (
        <div className="w-full flex items-center justify-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {remoteTemplates.map((t, index) => {
              const isActive = selectedTemplateId === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplateId(t.id);
                    setState(prev => ({ ...prev, profile_template_id: t.id }));
                  }}
                  className={`w-full relative rounded-xl border ${isActive ? 'border-green-500' : 'border-white/10'} p-5 bg-black/40 hover:border-white/30 transition-all duration-300 flex flex-col items-center text-center transform hover:scale-105 hover:-translate-y-2 active:scale-95 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Radio on top-right */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-6 h-6 rounded-full border ${isActive ? 'bg-green-500 border-green-500' : 'bg-transparent border-white/30'} flex items-center justify-center`}>
                      {isActive && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  <Image src={t?.image_url} alt={t?.title} width={200} height={160} className="w-full h-40 object-cover rounded-md" style={{height:'100%'}}/>
                  <p className="text-white mt-2 text-sm">{t?.title}</p>
                </button>
              );
            })}
          </div>

          {/* Large preview below */}
          {/* {selectedTemplate && (
            <div className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/90 text-sm">Preview: {selectedTemplate.title}</p>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className="w-full rounded-lg overflow-hidden border border-white/10 bg-black">
                <img
                  src={selectedTemplate.image_url}
                  alt={selectedTemplate.title}
                  className="w-full h-[360px] md:h-[420px] object-contain bg-black"
                />
              </div>
            </div>
          )} */}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
              disabled={!selectedTemplateId}
            >
              NEXT
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileTemplateSection;

