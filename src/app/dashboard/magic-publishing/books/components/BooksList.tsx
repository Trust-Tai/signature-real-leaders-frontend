"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { BookOpen, Download, Copy, ExternalLink, Loader2, Search, Filter, Calendar, SortAsc, SortDesc, ChevronDown, ChevronRight, FileText, ArrowLeft, Maximize2, Wand2, Image, Palette, Sparkles, RefreshCw } from 'lucide-react';
import { getAllContent } from '@/lib/magicPublishingApi';
import { toast } from '@/components/ui/toast';

interface Chapter {
  chapter_number: number;
  title: string;
  content: string;
  key_points?: string[];
  exercises?: unknown[];
  case_study?: string;
  summary?: string;
}

interface Book {
  title: string;
  summary?: string;
  target_audience?: string;
  chapters: Chapter[];
  conclusion?: string;
  about_author?: string;
}

interface ContentItem {
  id: number;
  title: string;
  slug: string;
  content_type: string;
  status: string;
  created_at: string;
  completed_at: string;
  updated_at: string;
  request_id: string;
  generated_content: Book | null;
  generated_content_json: string;
  content_preview: string;
  content_summary: string;
  word_count: number;
  error_message: string;
  tags: string[];
  categories: string[];
}

interface BooksListProps {
  onBookSelect?: (book: Book) => void;
}

const BooksList: React.FC<BooksListProps> = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBooks, setExpandedBooks] = useState<Set<number>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  
  // Chapter preview states
  const [currentView, setCurrentView] = useState<'list' | 'chapter' | 'cover'>('list');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterContent, setChapterContent] = useState('');
  
  // Book cover states
  const [bookCovers, setBookCovers] = useState<Map<number, string>>(new Map());
  const [generatingCover, setGeneratingCover] = useState<Set<number>>(new Set());
  const [coverPrompt, setCoverPrompt] = useState('');
  const [selectedCoverStyle, setSelectedCoverStyle] = useState<'professional' | 'artistic' | 'classic' | 'modern'>('professional');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [showFilters, setShowFilters] = useState(false);
  
  // Applied filter states (used for API calls)
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
  const [appliedDateFrom, setAppliedDateFrom] = useState('');
  const [appliedDateTo, setAppliedDateTo] = useState('');
  
  // Temporary filter states (used for UI inputs)
  const [tempStatusFilter, setTempStatusFilter] = useState('');
  const [tempDateFrom, setTempDateFrom] = useState('');
  const [tempDateTo, setTempDateTo] = useState('');

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const options = {
        search: searchTerm || undefined,
        status: appliedStatusFilter || undefined,
        date_from: appliedDateFrom || undefined,
        date_to: appliedDateTo || undefined,
        order: sortOrder,
      };

      const response = await getAllContent('book', token, options);

      if (response.success && response.data && response.data.content) {
        const allBooks: Book[] = [];
        const allContentItems: ContentItem[] = response.data.content;
        
        // Process each content item - only get books from completed ones
        response.data.content.forEach((contentItem: ContentItem) => {
          if (contentItem.status === 'completed') {
            // Try to get books from generated_content first
            if (contentItem.generated_content) {
              allBooks.push(contentItem.generated_content);
            } 
            // Fallback to generated_content_json
            else if (contentItem.generated_content_json) {
              try {
                const parsedContent = JSON.parse(contentItem.generated_content_json);
                allBooks.push(parsedContent);
              } catch (parseError) {
                console.error('Error parsing generated content JSON:', parseError);
              }
            }
          }
        });

        setBooks(allBooks);
        setContentItems(allContentItems);
      } else {
        setError('Failed to fetch books');
      }
    } catch (fetchError) {
      console.error('Error fetching books:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, appliedStatusFilter, appliedDateFrom, appliedDateTo, sortOrder]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBooks();
    }, searchTerm ? 500 : 0); // 500ms delay for search, immediate for other changes

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchBooks]);

  // Effect for applied filters and sort order
  useEffect(() => {
    fetchBooks();
  }, [appliedStatusFilter, appliedDateFrom, appliedDateTo, sortOrder, fetchBooks]);

  // Handle apply filters
  const handleApplyFilters = () => {
    setAppliedStatusFilter(tempStatusFilter);
    setAppliedDateFrom(tempDateFrom);
    setAppliedDateTo(tempDateTo);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setTempStatusFilter('');
    setTempDateFrom('');
    setTempDateTo('');
    setAppliedStatusFilter('');
    setAppliedDateFrom('');
    setAppliedDateTo('');
  };

  const handleCopyBook = (book: Book) => {
    const fullText = `${book.title}\n\n${book.summary || ''}\n\nTarget Audience: ${book.target_audience || ''}\n\n${book.chapters.map(chapter => `Chapter ${chapter.chapter_number}: ${chapter.title}\n${chapter.content}`).join('\n\n')}\n\n${book.conclusion || ''}\n\nAbout Author: ${book.about_author || ''}`;
    navigator.clipboard.writeText(fullText);
    toast.success('Book copied to clipboard!');
  };

  const handleDownloadBook = (book: Book, index: number) => {
    const fullText = `${book.title}\n\n${book.summary || ''}\n\nTarget Audience: ${book.target_audience || ''}\n\n${book.chapters.map(chapter => `Chapter ${chapter.chapter_number}: ${chapter.title}\n${chapter.content}`).join('\n\n')}\n\n${book.conclusion || ''}\n\nAbout Author: ${book.about_author || ''}`;
    const element = document.createElement('a');
    const file = new Blob([fullText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `book_${index + 1}_${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Book downloaded!');
  };

  const toggleBookExpansion = (index: number) => {
    const newExpanded = new Set(expandedBooks);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBooks(newExpanded);
  };

  const toggleChaptersExpansion = (index: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChapters(newExpanded);
  };

  const handleChapterClick = (book: Book, chapter: Chapter) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setChapterContent(chapter.content);
    setCurrentView('chapter');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedBook(null);
    setSelectedChapter(null);
    setChapterContent('');
  };

  const handleSaveChapter = () => {
    // API call to save chapter would go here
    toast.success('Chapter saved successfully!');
    // Update book data
    if (selectedBook && selectedChapter) {
      const updatedBooks = books.map(book => {
        if (book.title === selectedBook.title) {
          const updatedChapters = book.chapters.map(ch =>
            ch.chapter_number === selectedChapter.chapter_number
              ? { ...ch, content: chapterContent }
              : ch
          );
          return { ...book, chapters: updatedChapters };
        }
        return book;
      });
      setBooks(updatedBooks);
    }
    handleBackToList();
  };

  // Book cover handlers
  const handleGenerateCover = async (book: Book, bookIndex: number) => {
    try {
      setGeneratingCover(prev => new Set(prev).add(bookIndex));
      
      // Simulate API call for cover generation with selected style
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a placeholder cover URL with style parameter (in real implementation, this would come from API)
      const styleParam = selectedCoverStyle;
      const coverUrl = `https://picsum.photos/400/600?random=${bookIndex}&style=${styleParam}&text=${encodeURIComponent(book.title)}`;
      
      setBookCovers(prev => new Map(prev).set(bookIndex, coverUrl));
      toast.success(`${selectedCoverStyle.charAt(0).toUpperCase() + selectedCoverStyle.slice(1)} book cover generated successfully!`);
    } catch {
      toast.error('Failed to generate book cover');
    } finally {
      setGeneratingCover(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookIndex);
        return newSet;
      });
    }
  };

  const handleCoverView = (book: Book) => {
    setSelectedBook(book);
    setCoverPrompt(`Create a ${selectedCoverStyle} book cover for "${book.title}". ${book.summary ? `The book is about: ${book.summary}` : ''}`);
    setCurrentView('cover');
  };

  const handleRegenerateCover = async (bookIndex: number) => {
    if (selectedBook) {
      await handleGenerateCover(selectedBook, bookIndex);
    }
  };

  const processingItems = contentItems.filter(item => item.status === 'processing');
  const failedItems = contentItems.filter(item => item.status === 'failed');

  // Chapter Editor View - Same as BookDetail
  if (currentView === 'chapter' && selectedChapter && selectedBook) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to books</span>
          </button>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{selectedBook.title}</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Chapter {selectedChapter.chapter_number}: {selectedChapter.title}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Chapter Content Editor */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Chapter Content</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    <Wand2 className="w-4 h-4" />
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              <textarea
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
                placeholder="Write or generate chapter content here..."
                className="w-full h-[500px] p-4 border border-gray-200 rounded-lg text-[#333333] resize-none focus:outline-none focus:ring-2 focus:ring-[#cf3232] font-mono text-sm"
              />

              <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                  onClick={handleBackToList}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChapter}
                  className="px-6 py-2 bg-[#cf3232] text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Save Chapter
                </button>
              </div>
            </div>

            {/* Book Page Preview */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
              <div className="max-w-2xl mx-auto">
                {/* Book Page Header */}
                <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{selectedBook.title}</p>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">
                    Chapter {selectedChapter.chapter_number}
                  </h2>
                  <h3 className="text-xl font-serif text-gray-700 mt-2">{selectedChapter.title}</h3>
                </div>

                {/* Book Content */}
                <div className="prose prose-lg max-w-none">
                  {chapterContent ? (
                    <div className="text-gray-800 leading-relaxed font-serif" style={{
                      textAlign: 'justify',
                      fontSize: '16px',
                      lineHeight: '1.8',
                      textIndent: '2em'
                    }}>
                      {chapterContent.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-12 italic">
                      Start writing to see the book preview...
                    </p>
                  )}
                </div>

                {/* Book Page Footer */}
                <div className="text-center mt-8 pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-500">
                    — {selectedChapter.chapter_number} —
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Book Cover View
  if (currentView === 'cover' && selectedBook) {
    const bookIndex = books.findIndex(book => book.title === selectedBook.title);
    const currentCover = bookCovers.get(bookIndex);
    const isGenerating = generatingCover.has(bookIndex);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to books</span>
          </button>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{selectedBook.title}</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Book Cover Design & Preview
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Cover Generator */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Cover Generator</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleRegenerateCover(bookIndex)}
                    disabled={isGenerating}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 ${isGenerating ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => handleGenerateCover(selectedBook, bookIndex)}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-[#cf3232] text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGenerating ? 'Generating...' : 'Generate Cover'}</span>
                  </button>
                </div>
              </div>

              {/* Cover Prompt */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Description</label>
                <textarea
                  value={coverPrompt}
                  onChange={(e) => setCoverPrompt(e.target.value)}
                  placeholder="Describe the style, colors, and elements you want for the book cover..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg text-[#333333] resize-none focus:outline-none focus:ring-2 focus:ring-[#cf3232] text-sm"
                />
              </div>

              {/* Book Info */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Book Information</h3>
                <div className="space-y-2 text-sm">
                  <div className='font-outfit text-[#333333]'><span className="font-medium font-outfit text-[#333333]">Title:</span> {selectedBook.title}</div>
                  {selectedBook.summary && <div className='font-outfit text-[#333333]'><span className="font-medium font-outfit text-[#333333]">Summary:</span> {selectedBook.summary}</div>}
                  {selectedBook.target_audience && <div className='font-outfit text-[#333333]'><span className="font-medium font-outfit text-[#333333]">Audience:</span> {selectedBook.target_audience}</div>}
                  <div><span className="font-medium font-outfit text-[#333333]">Chapters:</span> {selectedBook.chapters.length}</div>
                </div>
              </div>

              {/* Style Options */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Style</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setSelectedCoverStyle('professional')}
                    className={`p-3 border rounded-lg transition-colors text-sm ${
                      selectedCoverStyle === 'professional' 
                        ? 'border-[#cf3232] bg-red-50 text-[#cf3232]' 
                        : 'border-gray-200 hover:border-[#cf3232] hover:bg-red-50'
                    }`}
                  >
                    <Palette className="w-4 h-4 mx-auto mb-1" />
                    Professional
                  </button>
                  <button 
                    onClick={() => setSelectedCoverStyle('artistic')}
                    className={`p-3 border rounded-lg transition-colors text-sm ${
                      selectedCoverStyle === 'artistic' 
                        ? 'border-[#cf3232] bg-red-50 text-[#cf3232]' 
                        : 'border-gray-200 hover:border-[#cf3232] hover:bg-red-50'
                    }`}
                  >
                    <Image className="w-4 h-4 mx-auto mb-1" />
                    Artistic
                  </button>
                  <button 
                    onClick={() => setSelectedCoverStyle('classic')}
                    className={`p-3 border rounded-lg transition-colors text-sm ${
                      selectedCoverStyle === 'classic' 
                        ? 'border-[#cf3232] bg-red-50 text-[#cf3232]' 
                        : 'border-gray-200 hover:border-[#cf3232] hover:bg-red-50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 mx-auto mb-1" />
                    Classic
                  </button>
                  <button 
                    onClick={() => setSelectedCoverStyle('modern')}
                    className={`p-3 border rounded-lg transition-colors text-sm ${
                      selectedCoverStyle === 'modern' 
                        ? 'border-[#cf3232] bg-red-50 text-[#cf3232]' 
                        : 'border-gray-200 hover:border-[#cf3232] hover:bg-red-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1" />
                    Modern
                  </button>
                </div>
              </div>
            </div>

            {/* Cover Preview */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Cover Preview</h3>
                
                {isGenerating ? (
                  <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#cf3232] mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Generating Cover...</p>
                      <div className="flex space-x-1 justify-center mt-2">
                        <span className="animate-bounce inline-block w-2 h-2 bg-[#cf3232] rounded-full" style={{ animationDelay: '0ms' }}></span>
                        <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '150ms' }}></span>
                        <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                ) : currentCover ? (
                  <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={currentCover} 
                      alt={`Cover for ${selectedBook.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[2/3] bg-gradient-to-br from-[#fee3e3] to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center p-6">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium mb-2">No Cover Generated</p>
                      <p className="text-sm text-gray-500">Click &quot;Generate Cover&quot; to create a book cover</p>
                    </div>
                  </div>
                )}

                {/* Cover Actions */}
                {currentCover && (
                  <div className="flex items-center justify-center space-x-3 mt-4">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = currentCover;
                        link.download = `${selectedBook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover.jpg`;
                        link.click();
                        toast.success('Cover downloaded!');
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentCover);
                        toast.success('Cover URL copied!');
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy URL</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section - Always Visible */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-[#333333] font-outfit pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-sm"
            />
          </div>

          {/* Filter Toggle and Sort */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              className="flex items-center text-[#333333] font-outfit space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === 'ASC' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'ASC' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span className="hidden sm:inline">{sortOrder === 'ASC' ? 'Oldest' : 'Newest'}</span>
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 px-3 py-2 text-sm border rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-[#cf3232] text-white border-[#cf3232]' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>Status</label>
                <select
                  value={tempStatusFilter}
                  onChange={(e) => setTempStatusFilter(e.target.value)}
                  className="w-full text-[#333333] font-outfit px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-sm"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={tempDateFrom}
                    onChange={(e) => setTempDateFrom(e.target.value)}
                    className="pl-10 text-[#333333] font-outfit pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-sm"
                  />
                </div>
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={tempDateTo}
                    onChange={(e) => setTempDateTo(e.target.value)}
                    className="pl-10 text-[#333333] font-outfit pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear All Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-[#cf3232] text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#cf3232] mb-4" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-[#cf3232] mb-4">
            <ExternalLink className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Books</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      )}

      {/* Content Area - Only show when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Processing Items */}
          {processingItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#101117]">
                Processing Content ({processingItems.length})
              </h3>
              {processingItems.map((item) => (
                <div key={item.id} className="mb-4 p-6 bg-gradient-to-br from-[#f9efef] via-[#fee3e3] to-gray-50 rounded-xl border-2 border-gray-300 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/10 via-gray-300/10 to-gray-200/10 animate-pulse"></div>

                  <div className="absolute inset-0 rounded-xl">
                    <div className="absolute inset-0 rounded-xl border-2 border-gray-400 opacity-30 animate-ping"></div>
                  </div>

                  <div className="flex items-center space-x-5 relative z-10">
                    <div className="relative flex-shrink-0">
                      <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-[#cf3232] shadow-lg"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-ping w-4 h-4 bg-[#cf3232] rounded-full opacity-75"></div>
                      </div>
                      <div className="absolute -inset-2 rounded-full border-2 border-gray-300 opacity-30 animate-pulse"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <p className="text-[#333333] font-bold text-lg">🚀 Processing Your Book...</p>
                        <div className="flex space-x-1">
                          <span className="animate-bounce inline-block w-2 h-2 bg-[#cf3232] rounded-full shadow-lg" style={{ animationDelay: '0ms' }}></span>
                          <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full shadow-lg" style={{ animationDelay: '150ms' }}></span>
                          <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full shadow-lg" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>

                      <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner mb-4">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#cf3232] via-gray-500 to-gray-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${Math.max(15, 50)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                          <div className="absolute inset-0 blur-sm bg-gradient-to-r from-[#cf3232] via-gray-400 to-gray-500 opacity-50"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30 animate-pulse"></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <p className="text-base font-bold text-[#333333]">
                            Processing...
                          </p>
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-[#cf3232] rounded-full animate-pulse"></div>
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-[#f9efef] to-[#fee3e3] px-4 py-2 rounded-full shadow-md">
                          <span className="text-lg">⏱️</span>
                          <p className="text-sm font-bold text-[#333333]">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <span className="text-lg animate-bounce">✨</span>
                        <p className="text-sm text-[#333333] font-medium">
                          {item.title} - Creating amazing content for you. This usually takes a few moments...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Failed Items */}
          {failedItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#101117]">
                Failed Content ({failedItems.length})
              </h3>
              {failedItems.map((item) => (
                <div key={item.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-red-600 text-xl">❌</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800">{item.title}</h4>
                      <p className="text-sm text-red-600">
                        {item.error_message || 'Content generation failed'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Content Found - Only show when no books AND no processing/failed items */}
          {books.length === 0 && processingItems.length === 0 && failedItems.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Found</h3>
              <p className="text-gray-600">No books were found matching your criteria.</p>
            </div>
          )}

          {books.length > 0 && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117]">
                  Generated Books ({books.length})
                </h2>
                <div className="text-sm text-gray-500">
                  {books.length} book{books.length !== 1 ? 's' : ''} ready
                </div>
              </div>

              {/* Books Grid - 2 per row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {books.map((book, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Book Header - Same as BookDetail */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                        <div className="w-20 h-28 bg-[#fee3e3] rounded-lg flex items-center justify-center shadow-md mx-auto sm:mx-0 flex-shrink-0">
                          <BookOpen className="w-10 h-10 text-[#cf3232]" />
                        </div>
                        <div className="flex-1 text-center sm:text-left w-full">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              Book
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              draft
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#101117] mb-2">{book.title}</h3>
                          {book.summary && <p className="text-gray-600 mb-2 text-sm line-clamp-2">{book.summary}</p>}
                          {book.target_audience && (
                            <p className="text-xs text-gray-500">Target Audience: {book.target_audience}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => handleCoverView(book)}
                            className="p-2 text-gray-400 hover:text-[#cf3232] hover:bg-red-50 rounded-full transition-colors"
                            title="Generate book cover"
                          >
                            <Image className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyBook(book)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            title="Copy book"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadBook(book, index)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            title="Download book"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* View Outline Toggle */}
                      <button
                        onClick={() => toggleBookExpansion(index)}
                        className="flex items-center space-x-2 text-[#cf3232] hover:text-red-700 font-medium mb-4"
                      >
                        {expandedBooks.has(index) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span>View Outline</span>
                      </button>

                      {/* Outline Content */}
                      {expandedBooks.has(index) && (
                        <div className="mb-6 bg-gray-50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                            {book.chapters.map((chapter) => 
                              `Chapter ${chapter.chapter_number}: ${chapter.title}\n${chapter.key_points ? chapter.key_points.map(point => `- ${point}`).join('\n') : ''}\n\n`
                            ).join('')}
                            {book.conclusion && `Conclusion: ${book.conclusion.substring(0, 100)}...\n`}
                          </pre>
                        </div>
                      )}

                      {/* Chapters List - Same as BookDetail */}
                      <div>
                        <h4 className="text-base font-semibold text-[#101117] mb-3">Chapters:</h4>
                        <div className="space-y-2">
                          {book.chapters.slice(0, expandedChapters.has(index) ? book.chapters.length : 3).map((chapter, chapterIndex) => (
                            <button
                              key={`${chapter.chapter_number}-${chapterIndex}`}
                              onClick={() => handleChapterClick(book, chapter)}
                              className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group"
                            >
                              <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#cf3232] flex-shrink-0" />
                              <span className="text-gray-900 font-medium text-sm">
                                Chapter {chapter.chapter_number}: {chapter.title}
                              </span>
                            </button>
                          ))}
                          
                          {!expandedChapters.has(index) && book.chapters.length > 3 && (
                            <div className="text-center py-2">
                              <button
                                onClick={() => toggleChaptersExpansion(index)}
                                className="text-sm text-[#cf3232] hover:text-red-700 font-medium hover:underline transition-colors"
                              >
                                +{book.chapters.length - 3} more chapters
                              </button>
                            </div>
                          )}
                          
                          {expandedChapters.has(index) && book.chapters.length > 3 && (
                            <div className="text-center py-2">
                              <button
                                onClick={() => toggleChaptersExpansion(index)}
                                className="text-sm text-[#cf3232] hover:text-red-700 font-medium hover:underline transition-colors"
                              >
                                Show less chapters
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional sections when expanded */}
                      {expandedBooks.has(index) && (
                        <>
                          {book.conclusion && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Conclusion</h5>
                              <p className="text-sm text-gray-700">{book.conclusion}</p>
                            </div>
                          )}
                          
                          {book.about_author && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">About Author</h5>
                              <p className="text-sm text-gray-700">{book.about_author}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BooksList;