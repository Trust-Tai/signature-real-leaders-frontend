"use client";

import React, { useState } from 'react';
import { X, BookOpen, Loader2 } from 'lucide-react';
import { GenerateBookRequest } from '@/lib/magicPublishingApi';

interface CreateBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: GenerateBookRequest) => Promise<void>;
  isGenerating: boolean;
}

const CreateBookModal: React.FC<CreateBookModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating
}) => {
  const [formData, setFormData] = useState<GenerateBookRequest>({
    book_title: '',
    book_genre: 'business',
    chapter_count: 8,
    writing_style: 'professional'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const genres = [
    { value: 'business', label: 'Business' },
    { value: 'self-help', label: 'Self Help' },
    { value: 'biography', label: 'Biography' },
    { value: 'technology', label: 'Technology' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'education', label: 'Education' },
    { value: 'fiction', label: 'Fiction' }
  ];

  const writingStyles = [
    { value: 'professional', label: 'Professional' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'academic', label: 'Academic' },
    { value: 'casual', label: 'Casual' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'technical', label: 'Technical' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.book_title.trim()) {
      newErrors.book_title = 'Book title is required';
    }

    if (formData.chapter_count < 1 || formData.chapter_count > 50) {
      newErrors.chapter_count = 'Chapter count must be between 1 and 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form and close modal on success
      setFormData({
        book_title: '',
        book_genre: 'business',
        chapter_count: 8,
        writing_style: 'professional'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting book generation:', error);
    }
  };

  const handleInputChange = (field: keyof GenerateBookRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#fee3e3] rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#cf3232]" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#101117]">Create New Book</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isGenerating}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Book Title */}
          <div>
            <label className="block text-sm font-medium font-outfit  text-gray-700 mb-2">
              Book Title *
            </label>
            <input
              type="text"
              value={formData.book_title}
              onChange={(e) => handleInputChange('book_title', e.target.value)}
              placeholder="Enter your book title..."
              className={`w-full px-3 py-2 border text-[#333333] font-outfit rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-transparent ${
                errors.book_title ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isGenerating}
            />
            {errors.book_title && (
              <p className="mt-1 text-sm text-red-600">{errors.book_title}</p>
            )}
          </div>

          {/* Book Genre */}
          <div>
            <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">
              Book Genre
            </label>
            <select
              value={formData.book_genre}
              onChange={(e) => handleInputChange('book_genre', e.target.value)}
              className="w-full px-3 py-2 text-[#333333] font-outfit border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-transparent"
              disabled={isGenerating}
            >
              {genres.map((genre) => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Count */}
          <div>
            <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">
              Number of Chapters
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.chapter_count}
              onChange={(e) => handleInputChange('chapter_count', parseInt(e.target.value) || 1)}
              className={`w-full px-3 py-2 border font-outfit text-[#333333] rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-transparent ${
                errors.chapter_count ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isGenerating}
            />
            {errors.chapter_count && (
              <p className="mt-1 text-sm text-red-600">{errors.chapter_count}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">Choose between 1-50 chapters</p>
          </div>

          {/* Writing Style */}
          <div>
            <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">
              Writing Style
            </label>
            <select
              value={formData.writing_style}
              onChange={(e) => handleInputChange('writing_style', e.target.value)}
              className="w-full px-3 py-2 border font-outfit text-[#333333] border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-transparent"
              disabled={isGenerating}
            >
              {writingStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 px-4 py-2 bg-[#cf3232] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Generate Book</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookModal;