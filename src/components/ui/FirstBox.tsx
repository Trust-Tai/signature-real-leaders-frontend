'use client';
import React, { JSX, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const BRAND_RED = '#ef4444';

interface Goal {
  id: string;
  title: string;
  subtitle: string;
}

export default function OnboardingStep1(): JSX.Element {
  const [selectedGoal, setSelectedGoal] = useState<string>('amplify');

  const goals: Goal[] = [
    { id: "amplify", title: "Amplify your voice", subtitle: "Build thought leadership" },
    { id: "connect", title: "Connect with leaders", subtitle: "Grow your network" },
    { id: "grow", title: "Grow your impact", subtitle: "Generate more leads" },
    { id: "understand", title: "Understand your audience", subtitle: "Track engagement" }
  ];



  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="w-full max-w-5xl relative z-10">
        <div className="text-left mb-12 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            Build your leadership brand, grow your influence, and amplify your impact.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              className={`relative p-8 rounded-2xl transition-all text-left min-h-[200px] flex flex-col justify-between ${
                selectedGoal === goal.id 
                  ? "bg-white text-black shadow-2xl scale-105" 
                  : "bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm border border-white/10"
              }`}
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">{goal.title}</h3>
                <p className={selectedGoal === goal.id ? "text-neutral-700 text-sm" : "text-white/80 text-sm"}>
                  {goal.subtitle}
                </p>
              </div>
              {selectedGoal === goal.id && (
                <div className="mt-4">
                  <ChevronDown size={24} className="text-black" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => {
              if (selectedGoal) {
                // Save selected goal to localStorage
                localStorage.setItem('user_goal', selectedGoal);
                localStorage.setItem('has_seen_first_box', 'true');
                // Navigate to profile page
                window.location.href = '/dashboard/profile';
              }
            }}
            disabled={!selectedGoal}
            className="px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-2xl"
            style={{ background: BRAND_RED }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}