"use client";

import React from 'react';
import { BookOpen, Clock, CheckCircle, AlertCircle, Trash2, Eye } from 'lucide-react';
import { GenerationRequest } from '@/lib/magicPublishingApi';
import { useRouter } from 'next/navigation';
import BookShimmer from '@/components/ui/BookShimmer';

interface BooksListProps {
  books: GenerationRequest[];
  onDelete: (contentId: string) => void;
  processingContentIds: Set<string>;
}

const BooksList: React.FC<BooksListProps> = ({ books, onDelete, processingContentIds }) => {
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing...';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleViewBook = (bookId: string) => {
    router.push(`/dashboard/magic-publishing/books/${bookId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBookGenre = (params: Record<string, unknown> | null) => {
    if (!params) return 'Unknown';
    return (params.book_genre as string) || 'Unknown';
  };

  const getWritingStyle = (params: Record<string, unknown> | null) => {
    if (!params) return 'Unknown';
    return (params.writing_style as string) || 'Unknown';
  };

  const extractBookTitle = (title: string, preview: string) => {
    // Try to extract book title from preview first
    const previewMatch = preview.match(/"([^"]+)"/);
    if (previewMatch) {
      return previewMatch[1];
    }
    
    // Fallback to cleaning up the title
    return title
      .replace(/^\d+\s+Book\s+\(\d+\s+Chapters\)\s+Generated\s+By\s+.*?\s+on\s+.*$/i, '')
      .replace(/^Generating\s+"([^"]+)".*$/i, '$1')
      .trim() || 'Untitled Book';
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h4 className="text-lg font-semibold text-[#101117] mb-2">No Books Yet</h4>
        <p className="text-gray-500 text-center max-w-md mx-auto">
          Start creating your first book with AI assistance. Generate professional books with multiple chapters in minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {books.map((book) => {
        // Show shimmer effect for processing books
        if (book.status === 'processing' || processingContentIds.has(book.id.toString())) {
          return (
            <div key={book.id} className="relative">
              <BookShimmer />
              {/* Overlay with processing indicator */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f9efef] via-[#fee3e3] to-gray-50 rounded-xl border-2 border-gray-300 shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#cf3232] shadow-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-ping w-4 h-4 bg-[#cf3232] rounded-full opacity-75"></div>
                    </div>
                  </div>
                  <p className="text-[#333333] font-bold text-lg mb-2">🚀 Processing Your Book...</p>
                  <div className="flex space-x-1 justify-center">
                    <span className="animate-bounce inline-block w-2 h-2 bg-[#cf3232] rounded-full shadow-lg" style={{ animationDelay: '0ms' }}></span>
                    <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full shadow-lg" style={{ animationDelay: '150ms' }}></span>
                    <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full shadow-lg" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Regular book card for completed/failed books
        return (
          <div key={book.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            {/* Book Card Header */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#fee3e3] rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#cf3232]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(book.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)} whitespace-nowrap`}>
                        {getStatusText(book.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  {book.status === 'completed' && (
                    <button
                      onClick={() => handleViewBook(book.id.toString())}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="View book"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(book.id.toString())}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete book"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Book Title */}
              <h3 className="text-base sm:text-lg font-semibold text-[#101117] mb-2 line-clamp-2">
                {extractBookTitle(book.title, book.preview)}
              </h3>

              {/* Book Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Genre:</span>
                  <span className="text-gray-700 capitalize">{getBookGenre(book.generation_params)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Style:</span>
                  <span className="text-gray-700 capitalize">{getWritingStyle(book.generation_params)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Chapters:</span>
                  <span className="text-gray-700">
                    {book.status === 'completed' 
                      ? `${book.generated_count} chapters` 
                      : book.requested_count > 0 
                        ? `${book.generated_count}/${book.requested_count}` 
                        : `${book.generated_count} chapters`
                    }
                  </span>
                </div>
                {book.status === 'completed' && book.completed_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="text-gray-700">{book.duration}</span>
                  </div>
                )}
              </div>


              {/* Preview Text */}
              {book.preview && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {book.preview.replace(/✅\s*Book completed:\s*"[^"]*"\s*\(\d+\s*chapters\)/i, '').trim() || 
                   `Book with ${book.generated_count} chapters completed successfully`}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {book.status === 'completed' && book.completed_at 
                    ? `Completed ${formatDate(book.completed_at)}`
                    : `Created ${formatDate(book.created_at)}`
                  }
                </div>
                {book.status === 'completed' && (
                  <button
                    onClick={() => handleViewBook(book.id.toString())}
                    className="px-3 py-1 bg-[#cf3232] text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                  >
                    View Book
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BooksList;