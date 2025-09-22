import React, {useState } from 'react';

import { Crown, Zap, Sparkles, ChevronRight, Check, User } from 'lucide-react';


interface ProfileTemplateSectionProps {
  onSubmit: (selectedTemplate: string) => void;
}

const ProfileTemplateSection: React.FC<ProfileTemplateSectionProps> = ({ onSubmit }) => {
  type TemplateId = 'executive' | 'neon' | 'glass';
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('executive');
  const [expandedTemplate, setExpandedTemplate] = useState<TemplateId | null>(null);

 

  const templates = [
    {
      id: 'executive',
      name: 'Executive Elite',
      description: 'Luxury dark theme for CEOs, Founders & Business Moguls',
      preview: {
        container: 'from-gray-900 via-black to-gray-800',
        accent: 'bg-red-600',
        border: 'border-white/20',
      },
      icon: Crown,
      badge: 'PREMIUM',
      followCta: 'FOLLOW',
      followHelper: 'Follow to get leadership insights and updates',
    },
    {
      id: 'neon',
      name: 'Neon Futuristic',
      description: 'Cyberpunk-inspired design for Tech Leaders & Innovators',
      preview: {
        container: 'from-slate-900 via-purple-900 to-cyan-900',
        accent: 'bg-cyan-500',
        border: 'border-cyan-400/30',
      },
      icon: Zap,
      badge: 'TRENDING',
      followCta: 'SUBSCRIBE',
      followHelper: 'Subscribe for tech breakthroughs and future trends',
    },
    {
      id: 'glass',
      name: 'Glassmorphism Pro',
      description: 'Ultra-modern glass effect for Creative Leaders & Artists',
      preview: {
        container: 'from-amber-950 via-orange-900 to-rose-900',
        accent: 'bg-amber-400',
        border: 'border-amber-300/30',
      },
      icon: Sparkles,
      badge: 'POPULAR',
      followCta: 'CONNECT',
      followHelper: 'Connect for creative drops and exclusive content',
    },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = selectedTemplate ?? templates[0].id;
    onSubmit(chosen);
  };

  const renderMiniPreview = (
    templateId: TemplateId,
    expanded: boolean = false
  ) => {
    const template = templates.find((t) => t.id === templateId) ?? templates[0];

    // COMPACT PREVIEW (always small thumbnail-like)
    if (!expanded) {
      return (
        <div className={`mt-3 rounded-lg overflow-hidden border ${template.preview.border} bg-gradient-to-br ${template.preview.container} w-full`}>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${template.preview.accent}`}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="h-2 w-24 bg-white/30 rounded" />
                <div className="h-2 w-16 bg-white/20 rounded mt-2" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className={`h-8 rounded-md bg-white/10 border ${template.preview.border}`} />
              <div className={`h-8 rounded-md bg-white/10 border ${template.preview.border}`} />
            </div>
          </div>
        </div>
      );
    }

    // EXPANDED PREVIEW (still simplified, but larger)
    if (templateId === 'executive') {
      return (
        <div className="mt-3 rounded-lg overflow-hidden border border-white/10 bg-black w-full h-[100%]">
          <div className="relative mx-auto flex items-start justify-center" style={{ width: '100%', height: '320px' }}>
            <div className="relative w-full max-w-md p-4">
              <div
                className={`relative mx-auto bg-gradient-to-br ${template.preview.container} flex items-center justify-center border ${template.preview.border} overflow-hidden mb-3`}
                style={{ width: '100px', height: '100px', borderRadius: '100px', borderWidth: '1px' }}
              >
                <User className="w-10 h-10 text-white" />
              </div>
              <div className={`w-full backdrop-blur-[8px] bg-white/10 rounded-md flex items-center justify-between px-3 border ${template.preview.border}`} style={{ height: '44px' }}>
                <span className="text-white text-sm">Primary CTA</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className={`w-full backdrop-blur-[8px] bg-white/10 mt-2 rounded-md flex items-center justify-between px-3 border ${template.preview.border}`} style={{ height: '44px' }}>
                <span className="text-white text-sm">Secondary CTA</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className={`w-full backdrop-blur-[8px] bg-white/10 rounded-md flex items-center justify-center mt-3 border ${template.preview.border}`} style={{ height: '56px' }}>
                <div className="h-4 w-32 rounded bg-white/40" />
              </div>
              <p className="text-center text-white/80 mt-2 text-[11px]">{template.followHelper}</p>
              <div className={`w-full ${template.preview.accent} text-white rounded-md mt-2 flex items-center justify-center`} style={{ height: '42px' }}>
                <span className="text-white text-sm">{template.followCta}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (templateId === 'neon') {
      return (
        <div className="mt-3 rounded-lg overflow-hidden border border-cyan-400/20 bg-gradient-to-br from-slate-950 via-purple-950 to-cyan-950 w-full">
          <div className="relative mx-auto flex items-start justify-center" style={{ width: '100%', height: '320px' }}>
            <div className="relative w-full max-w-md px-4 py-4">
              <div className="w-full h-1.5 rounded-full bg-cyan-500/60 blur-[1px]" />
              <div className="mt-3 flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl border border-cyan-400/40 flex items-center justify-center bg-white/5">
                  <User className="w-8 h-8 text-cyan-200" />
                </div>
                <div className="flex-1">
                  <div className="h-3 w-28 bg-white/30 rounded" />
                  <div className="h-2 w-20 bg-white/20 rounded mt-2" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-cyan-400/30 bg-white/5 backdrop-blur-md h-9" />
                <div className="rounded-md border border-cyan-400/30 bg-white/5 backdrop-blur-md h-9" />
                <div className="rounded-md border border-cyan-400/30 bg-white/5 backdrop-blur-md h-9" />
                <div className="rounded-md border border-cyan-400/30 bg-white/5 backdrop-blur-md h-9" />
              </div>
              <div className="mt-3 text-center text-cyan-100/80 text-[11px]">{template.followHelper}</div>
              <div className="mt-2 w-full rounded-md border border-cyan-400/40 bg-cyan-500 text-white flex items-center justify-center h-10">
                <span className="text-white text-sm">{template.followCta}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // glass
    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-amber-300/20 bg-gradient-to-br from-amber-950 via-orange-950 to-rose-950 w-full h-[100%]">
        <div className="relative mx-auto flex items-start justify-center" style={{ width: '100%', height: '320px' }}>
          <div className="relative w-full max-w-md px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-full ring-2 ring-amber-300/40 flex items-center justify-center bg-white/10">
                <User className="w-8 h-8 text-amber-200" />
              </div>
              <div className="flex-1">
                <div className="h-3 w-28 bg-white/30 rounded" />
                <div className="h-2 w-20 bg-white/20 rounded mt-2" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-full rounded-md bg-white/15 backdrop-blur-xl border border-amber-300/30 h-10" />
              <div className="w-full rounded-md bg-white/10 backdrop-blur-xl border border-amber-300/20 h-10" />
              <div className="w-full rounded-md bg-white/10 backdrop-blur-xl border border-amber-300/20 h-10" />
            </div>
            <div className="w-full rounded-md bg-white/15 backdrop-blur-xl border border-amber-300/30 mt-3 flex items-center justify-center h-12">
              <div className="h-4 w-28 rounded bg-white/50" />
            </div>
            <div className="mt-2 text-center text-amber-100/90 text-[11px]">{templates.find(t=>t.id==='glass')?.followHelper}</div>
            <div className="mt-2 w-full rounded-md bg-amber-400 text-black flex items-center justify-center h-10">
              <span className="text-black text-sm">{templates.find(t=>t.id==='glass')?.followCta}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full animate-fade-in-up">
      <div className="mb-6">
        <h2 className="section-title text-white text-center animate-fade-in-down">Choose your profile template</h2>
        <p className="text-center mt-2 font-outfit animate-fade-in" style={{ color: '#333333' }}>Pick a style. You can change this later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {templates.map((t, index) => {
            const Icon = t.icon;
            const isActive = selectedTemplate === t.id;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => {
                  setSelectedTemplate(t.id);
                  setExpandedTemplate(prev => (prev === t.id ? null : t.id));
                }}
                className={`w-full relative rounded-xl border ${isActive ? 'border-green-500' : 'border-white/10'} p-5 bg-gradient-to-br ${t.preview.container} hover:border-white/30 transition-all duration-300 flex flex-col items-center text-center transform hover:scale-105 hover:-translate-y-2 active:scale-95 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Selection tick on right side */}
                <div className="absolute top-3 right-3">
                  <div className={`w-6 h-6 rounded-full border ${isActive ? 'bg-green-500 border-green-500' : 'bg-transparent border-white/30'} flex items-center justify-center`}>
                    {isActive && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">{t.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded bg-white/10 text-white/90">{t.badge}</span>
                </div>
                <p className="text-xs text-gray-200/90 mt-2">{t.description}</p>
                {renderMiniPreview(t.id, false)}
              </button>
            );
          })}
        </div>

        {expandedTemplate && (
          <div className="mt-4">
            {renderMiniPreview(expandedTemplate, true)}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            disabled={!selectedTemplate}
          >
            NEXT
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTemplateSection;

