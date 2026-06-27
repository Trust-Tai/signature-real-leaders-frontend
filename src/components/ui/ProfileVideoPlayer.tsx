"use client";

import React from 'react';

interface ProfileVideoPlayerProps {
  src?: string;
  className?: string;
}

const getYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
};

const getVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

const ProfileVideoPlayer: React.FC<ProfileVideoPlayerProps> = ({ src, className }) => {
  if (!src) return null;

  const youTubeId = getYouTubeId(src);
  const vimeoId = getVimeoId(src);

  const wrapperClass = `relative w-full overflow-hidden rounded-2xl border border-white/20 shadow-lg ${className || ''}`;

  if (youTubeId || vimeoId) {
    const embedUrl = youTubeId
      ? `https://www.youtube.com/embed/${youTubeId}`
      : `https://player.vimeo.com/video/${vimeoId}`;

    return (
      <div className={wrapperClass} style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src={embedUrl}
          title="Profile video"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video src={src} controls playsInline className="w-full h-full object-cover">
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default ProfileVideoPlayer;
