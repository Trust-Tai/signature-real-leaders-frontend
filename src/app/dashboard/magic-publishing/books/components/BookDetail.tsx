// "use client";

// import React, { useEffect, useState } from 'react';
// import { ArrowLeft, BookOpen, Download, Copy, Loader2, ExternalLink } from 'lucide-react';
// import { getGeneratedContent } from '@/lib/magicPublishingApi';
// import { toast } from '@/components/ui/toast';
// import { Book, Chapter } from '@/lib/magicPublishingApi';

// interface BookDetailProps {
//   contentId: string;
//   onBack: () => void;
// }

// const BookDetail: React.FC<BookDetailProps> = ({ contentId, onBack }) => {
//   const [book, setBook] = useState<Book | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchBook = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem('auth_token');
//         if (!token) {
//           setError('No authentication token found');
//           return;
//         }

//         const response = await getGeneratedContent(contentId, token);

//         if (response.success && response.content) {
//           // Check if it's a book content type
//           if (response.content.content_type !== 'book' && response.content.content_type !== 'books') {
//             setError('This content is not a book');
//             return;
//           }

//           // Try to get book data from different possible locations
//           if (response.content.generated_content?.book) {
//             setBook(response.content.generated_content.book);
//           } else if (response.content.generated_content_json) {
//             // Parse JSON if book is stored as JSON string
//             try {
//               const parsedContent = JSON.parse(response.content.generated_content_json);
//               console.log("parsedContent",parsedContent)
//               if (parsedContent.book) {
//                 setBook(parsedContent.book);
//               } else if (parsedContent.articles) {
//                 // If we get articles instead of book, show a helpful message
//                 setError(`This content contains ${parsedContent.articles.length} articles, not a book. Please check if you're viewing the correct content type.`);
//               } else {
//                 // If no book object found, show error with helpful message
//                 setError('Book data not found. This might be an articles content or the book is still being processed.');
//               }
//             } catch (parseError) {
//               console.error('Error parsing generated content JSON:', parseError);
//               setError('Error parsing book data');
//             }
//           } else {
//             setError('No book data found in the content. Please check if the book generation is complete.');
//           }
//         } else {
//           setError('Failed to fetch book content');
//         }
//       } catch (error) {
//         console.error('Error fetching book:', error);
//         setError(error instanceof Error ? error.message : 'Unknown error occurred');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBook();
//   }, [contentId]);

//   const handleCopyChapter = (chapter: Chapter) => {
//     const fullText = `Chapter ${chapter.chapter_number}: ${chapter.title}\n\n${chapter.content}\n\nSummary: ${chapter.summary}`;
//     navigator.clipboard.writeText(fullText);
//     toast.success('Chapter copied to clipboard!');
//   };

//   const handleCopyFullBook = () => {
//     if (!book) return;

//     let fullText = `${book.title}\n\nGenre: ${book.genre}\nWriting Style: ${book.writing_style}\n\nOutline:\n${book.outline}\n\n`;

//     book.chapters.forEach((chapter) => {
//       fullText += `\nChapter ${chapter.chapter_number}: ${chapter.title}\n\n${chapter.content}\n\nSummary: ${chapter.summary}\n\n${'='.repeat(50)}\n`;
//     });

//     navigator.clipboard.writeText(fullText);
//     toast.success('Full book copied to clipboard!');
//   };

//   const handleDownloadChapter = (chapter: Chapter) => {
//     const fullText = `Chapter ${chapter.chapter_number}: ${chapter.title}\n\n${chapter.content}\n\nSummary: ${chapter.summary}`;
//     const element = document.createElement('a');
//     const file = new Blob([fullText], { type: 'text/plain' });
//     element.href = URL.createObjectURL(file);
//     element.download = `chapter_${chapter.chapter_number}_${chapter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//     toast.success('Chapter downloaded!');
//   };

//   const handleDownloadFullBook = () => {
//     if (!book) return;

//     let fullText = `${book.title}\n\nGenre: ${book.genre}\nWriting Style: ${book.writing_style}\n\nOutline:\n${book.outline}\n\n`;

//     book.chapters.forEach((chapter) => {
//       fullText += `\nChapter ${chapter.chapter_number}: ${chapter.title}\n\n${chapter.content}\n\nSummary: ${chapter.summary}\n\n${'='.repeat(50)}\n`;
//     });

//     const element = document.createElement('a');
//     const file = new Blob([fullText], { type: 'text/plain' });
//     element.href = URL.createObjectURL(file);
//     element.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_full_book.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//     toast.success('Full book downloaded!');
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12">
//         <Loader2 className="w-8 h-8 animate-spin text-[#cf3232] mb-4" />
//         <p className="text-gray-600">Loading book...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         {/* Header with Back Button */}
//         <div className="flex items-center justify-between">
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back to Books</span>
//           </button>
//         </div>

//         {/* Error Content */}
//         <div className="text-center py-12">
//           <div className="text-[#cf3232] mb-4">
//             <ExternalLink className="w-12 h-12 mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Book</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="space-x-3">
//             <button
//               onClick={onBack}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Back to Books
//             </button>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-[#cf3232] text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="space-y-6">
//         {/* Header with Back Button */}
//         <div className="flex items-center justify-between">
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back to Books</span>
//           </button>
//         </div>

//         {/* No Book Content */}
//         <div className="text-center py-12">
//           <div className="text-gray-400 mb-4">
//             <BookOpen className="w-12 h-12 mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Book Found</h3>
//           <p className="text-gray-600 mb-4">
//             No book data was found for this content. The book might still be generating or there was an error.
//           </p>
//           <button
//             onClick={onBack}
//             className="px-4 py-2 bg-[#cf3232] text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             Back to Books
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>Back to Books</span>
//         </button>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={handleCopyFullBook}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2"
//           >
//             <Copy className="w-4 h-4" />
//             <span>Copy Full Book</span>
//           </button>
//           <button
//             onClick={handleDownloadFullBook}
//             className="px-4 py-2 bg-[#cf3232] hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
//           >
//             <Download className="w-4 h-4" />
//             <span>Download Book</span>
//           </button>
//         </div>
//       </div>

//       {/* Book Info */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
//         <div className="flex items-start space-x-4 mb-6">
//           <div className="w-16 h-16 bg-[#fee3e3] rounded-lg flex items-center justify-center">
//             <BookOpen className="w-8 h-8 text-[#cf3232]" />
//           </div>
//           <div className="flex-1">
//             <h1 className="text-2xl font-bold text-[#101117] mb-2">{book.title}</h1>
//             <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//               <span><strong>Genre:</strong> {book.genre}</span>
//               <span><strong>Style:</strong> {book.writing_style}</span>
//               <span><strong>Chapters:</strong> {book.chapters.length}</span>
//             </div>
//           </div>
//         </div>

//         {/* Book Outline */}
//         {book.outline && (
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-[#101117] mb-3">Book Outline</h3>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-gray-700 whitespace-pre-wrap">{book.outline}</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Chapters */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold text-[#101117]">
//           Chapters ({book.chapters.length})
//         </h2>

//         {book.chapters.map((chapter) => (
//           <div key={chapter.chapter_number} className="bg-white border border-gray-200 rounded-lg shadow-sm">
//             {/* Chapter Header */}
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-[#101117] mb-2">
//                     Chapter {chapter.chapter_number}: {chapter.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-3">
//                     {chapter.summary}
//                   </p>
//                 </div>
//                 <div className="flex items-center space-x-2 ml-4">
//                   <button
//                     onClick={() => handleCopyChapter(chapter)}
//                     className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//                     title="Copy chapter"
//                   >
//                     <Copy className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => handleDownloadChapter(chapter)}
//                     className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//                     title="Download chapter"
//                   >
//                     <Download className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Chapter Content */}
//               <div className="mb-4">
//                 <button
//                   onClick={() => setExpandedChapter(
//                     expandedChapter === chapter.chapter_number ? null : chapter.chapter_number
//                   )}
//                   className="text-[#cf3232] hover:text-red-700 text-sm font-medium mb-3"
//                 >
//                   {expandedChapter === chapter.chapter_number ? 'Hide Content' : 'Show Content'}
//                 </button>

//                 {expandedChapter === chapter.chapter_number && (
//                   <div className="prose max-w-none">
//                     <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 rounded-lg p-4">
//                       {chapter.content}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BookDetail;

"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Download, Copy, Loader2, ExternalLink, ChevronDown, ChevronRight, FileText, Maximize2, Wand2 } from 'lucide-react';
import { getGeneratedContent, Book as ApiBook, Chapter as ApiChapter } from '@/lib/magicPublishingApi';
import { toast } from '@/components/ui/toast';

interface Chapter {
  chapter_number: number;
  title: string;
  content: string;
  key_points: string[];
  exercises: unknown[];
  case_study: string;
}

interface ApiChapterData {
  chapter_number: number;
  title: string;
  content: string;
  key_points?: string[];
  exercises?: unknown[];
  case_study?: string;
}

interface ParsedBookContent {
  title?: string;
  summary?: string;
  target_audience?: string;
  chapters?: ApiChapterData[];
  conclusion?: string;
  about_author?: string;
  articles?: unknown[];
}

interface BookApiResponse {
  title: string;
  summary?: string;
  target_audience?: string;
  chapters: ApiChapterData[];
  conclusion?: string;
  about_author?: string;
}

interface Book {
  title: string;
  summary: string;
  target_audience: string;
  chapters: Chapter[];
  conclusion: string;
  about_author: string;
}

interface BookDetailProps {
  contentId: string;
  onBack: () => void;
}

// Helper function to convert API Book to component Book
const convertApiBookToComponentBook = (apiBook: ApiBook): Book => {
  return {
    title: apiBook.title,
    summary: apiBook.outline || '',
    target_audience: '',
    chapters: apiBook.chapters.map((apiChapter: ApiChapter) => ({
      chapter_number: apiChapter.chapter_number,
      title: apiChapter.title,
      content: apiChapter.content,
      key_points: [],
      exercises: [],
      case_study: apiChapter.summary || ''
    })),
    conclusion: '',
    about_author: ''
  };
};

const BookDetail: React.FC<BookDetailProps> = ({ contentId, onBack }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'chapter'>('overview');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterContent, setChapterContent] = useState('');
  const [outlineExpanded, setOutlineExpanded] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await getGeneratedContent(contentId, token);
        console.log('Book API Response:', response);

        if (response.success && response.content) {
          if (response.content.content_type !== 'book' && response.content.content_type !== 'books') {
            setError('This content is not a book');
            return;
          }

          if (response.content.generated_content) {
            const bookData = response.content.generated_content;
            console.log('Book Data:', bookData);

            // Handle direct book data structure (your API response format)
            if ((bookData as BookApiResponse).title && (bookData as BookApiResponse).chapters) {
              const directBookData = bookData as BookApiResponse;
              setBook({
                title: directBookData.title,
                summary: directBookData.summary || '',
                target_audience: directBookData.target_audience || '',
                chapters: directBookData.chapters.map((chapter: ApiChapterData) => ({
                  chapter_number: chapter.chapter_number,
                  title: chapter.title,
                  content: chapter.content,
                  key_points: chapter.key_points || [],
                  exercises: chapter.exercises || [],
                  case_study: chapter.case_study || ''
                })),
                conclusion: directBookData.conclusion || '',
                about_author: directBookData.about_author || ''
              });
            } else if ('book' in bookData && bookData.book && bookData.book.title && bookData.book.chapters) {
              // Fallback for nested book structure
              setBook(convertApiBookToComponentBook(bookData.book));
            } else {
              setError('Invalid book data structure');
            }
          } else if (response.content.generated_content_json) {
            try {
              const parsedContent: ParsedBookContent = JSON.parse(response.content.generated_content_json);
              console.log("parsedContent", parsedContent);

              if (parsedContent.title && parsedContent.chapters) {
                setBook({
                  title: parsedContent.title,
                  summary: parsedContent.summary || '',
                  target_audience: parsedContent.target_audience || '',
                  chapters: parsedContent.chapters.map((chapter: ApiChapterData) => ({
                    chapter_number: chapter.chapter_number,
                    title: chapter.title,
                    content: chapter.content,
                    key_points: chapter.key_points || [],
                    exercises: chapter.exercises || [],
                    case_study: chapter.case_study || ''
                  })),
                  conclusion: parsedContent.conclusion || '',
                  about_author: parsedContent.about_author || ''
                });
              } else if (parsedContent.articles) {
                setError(`This content contains ${Array.isArray(parsedContent.articles) ? parsedContent.articles.length : 0} articles, not a book.`);
              } else {
                setError('Book data not found in parsed content.');
              }
            } catch (parseError) {
              console.error('Error parsing generated content JSON:', parseError);
              setError('Error parsing book data');
            }
          } else {
            setError('No book data found in the content.');
          }
        } else {
          setError('Failed to fetch book content');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [contentId]);

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setChapterContent(chapter.content);
    setCurrentView('chapter');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedChapter(null);
    setChapterContent('');
  };

  const handleSaveChapter = () => {
    // API call to save chapter
    toast.success('Chapter saved successfully!');
    // Update book data
    if (book && selectedChapter) {
      const updatedChapters = book.chapters.map(ch =>
        ch.chapter_number === selectedChapter.chapter_number
          ? { ...ch, content: chapterContent }
          : ch
      );
      setBook({ ...book, chapters: updatedChapters });
    }
    handleBackToOverview();
  };

  const handleCopyFullBook = () => {
    if (!book) return;

    let fullText = `${book.title}\n\n`;
    fullText += `Summary: ${book.summary}\n\n`;
    fullText += `Target Audience: ${book.target_audience}\n\n`;

    book.chapters.forEach((chapter) => {
      fullText += `\nChapter ${chapter.chapter_number}: ${chapter.title}\n\n`;
      fullText += `${chapter.content}\n\n`;
      fullText += `Key Points:\n${chapter.key_points.join('\n')}\n\n`;
      fullText += `Case Study: ${chapter.case_study}\n\n`;
      fullText += `${'='.repeat(50)}\n`;
    });

    fullText += `\nConclusion:\n${book.conclusion}\n\n`;
    fullText += `About Author:\n${book.about_author}`;

    navigator.clipboard.writeText(fullText);
    toast.success('Full book copied to clipboard!');
  };

  const handleDownloadFullBook = () => {
    if (!book) return;

    // Create HTML content with book styling
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${book.title}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    
    body {
      font-family: Georgia, 'Times New Roman', serif;
      line-height: 1.8;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    
    .book-title-page {
      text-align: center;
      page-break-after: always;
      padding-top: 200px;
    }
    
    .book-title {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .book-subtitle {
      font-size: 20px;
      color: #666;
      margin-bottom: 40px;
      font-style: italic;
    }
    
    .book-info {
      font-size: 14px;
      color: #999;
      margin-top: 60px;
    }
    
    .chapter {
      page-break-before: always;
      margin-top: 60px;
    }
    
    .chapter-header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    
    .chapter-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .chapter-number {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .chapter-title {
      font-size: 24px;
      color: #333;
    }
    
    .chapter-content {
      text-align: justify;
      font-size: 16px;
      line-height: 1.8;
    }
    
    .chapter-content p {
      margin-bottom: 16px;
      text-indent: 2em;
    }
    
    .chapter-content p:first-child {
      text-indent: 0;
    }
    
    .chapter-footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #999;
    }
    
    .key-points {
      margin: 30px 0;
      padding: 20px;
      background-color: #f9f9f9;
      border-left: 4px solid #333;
    }
    
    .key-points h4 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }
    
    .key-points ul {
      list-style-type: disc;
      padding-left: 30px;
    }
    
    .key-points li {
      margin-bottom: 8px;
      text-align: left;
    }
    
    .case-study {
      margin: 30px 0;
      padding: 20px;
      background-color: #fafafa;
      border: 1px solid #e0e0e0;
      font-style: italic;
    }
    
    .case-study-label {
      font-weight: bold;
      font-style: normal;
      margin-bottom: 10px;
    }
    
    .conclusion-section {
      page-break-before: always;
      margin-top: 60px;
    }
    
    .section-title {
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .about-author {
      margin-top: 40px;
      padding: 30px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <!-- Title Page -->
  <div class="book-title-page">
    <div class="book-title">${book.title}</div>
    ${book.summary ? `<div class="book-subtitle">${book.summary}</div>` : ''}
    <div class="book-info">
      ${book.target_audience ? `<p>Target Audience: ${book.target_audience}</p>` : ''}
    </div>
  </div>
`;

    // Add each chapter
    book.chapters.forEach((chapter) => {
      const paragraphs = chapter.content.split('\n\n').filter(p => p.trim());

      htmlContent += `
  <!-- Chapter ${chapter.chapter_number} -->
  <div class="chapter">
    <div class="chapter-header">
      <div class="chapter-label">${book.title}</div>
      <div class="chapter-number">Chapter ${chapter.chapter_number}</div>
      <div class="chapter-title">${chapter.title}</div>
    </div>
    
    <div class="chapter-content">
      ${paragraphs.map(p => `<p>${p}</p>`).join('\n      ')}
    </div>
`;

      // Add key points if available
      if (chapter.key_points && chapter.key_points.length > 0) {
        htmlContent += `
    <div class="key-points">
      <h4>Key Points</h4>
      <ul>
        ${chapter.key_points.map(point => `<li>${point}</li>`).join('\n        ')}
      </ul>
    </div>
`;
      }

      // Add case study if available
      if (chapter.case_study) {
        htmlContent += `
    <div class="case-study">
      <div class="case-study-label">Case Study:</div>
      <div>${chapter.case_study}</div>
    </div>
`;
      }

      htmlContent += `
    <div class="chapter-footer">
      — ${chapter.chapter_number} —
    </div>
  </div>
`;
    });

    // Add conclusion
    if (book.conclusion) {
      htmlContent += `
  <div class="conclusion-section">
    <div class="section-title">Conclusion</div>
    <div class="chapter-content">
      ${book.conclusion.split('\n\n').map(p => `<p>${p}</p>`).join('\n      ')}
    </div>
  </div>
`;
    }

    // Add about author
    if (book.about_author) {
      htmlContent += `
  <div class="about-author">
    <div class="section-title" style="font-size: 20px; text-align: left;">About the Author</div>
    <p style="text-indent: 0;">${book.about_author}</p>
  </div>
`;
    }

    htmlContent += `
</body>
</html>`;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_book.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Book downloaded as HTML! Open in browser and use Print > Save as PDF');
  };

  const buildOutline = () => {
    if (!book) return '';

    let outline = '';
    book.chapters.forEach((chapter) => {
      outline += `Chapter ${chapter.chapter_number}: ${chapter.title}\n`;
      if (chapter.key_points && chapter.key_points.length > 0) {
        chapter.key_points.forEach(point => {
          outline += `- ${point}\n`;
        });
      }
      outline += '\n';
    });

    if (book.conclusion) {
      outline += `Conclusion: ${book.conclusion.substring(0, 100)}...\n`;
    }

    return outline;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#cf3232] mb-4" />
        <p className="text-gray-600">Loading book...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Books</span>
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-[#cf3232] mb-4">
            <ExternalLink className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Book</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Books
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#cf3232] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Books</span>
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Book Found</h3>
          <p className="text-gray-600 mb-4">No book data was found for this content.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#cf3232] text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  // Chapter Editor View
  if (currentView === 'chapter' && selectedChapter) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <button
            onClick={handleBackToOverview}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to book</span>
          </button>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
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
                  onClick={handleBackToOverview}
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
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{book.title}</p>
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

  // Overview/Outline View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Books</span>
        </button>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleCopyFullBook}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Full Book</span>
          </button>
          <button
            onClick={handleDownloadFullBook}
            className="px-4 py-2 bg-[#cf3232] hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            <span>Download Book</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
        {/* Book Header */}
        <div className="flex flex-col sm:flex-row gap-[20px] items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
          <div className="w-24 h-32 sm:w-32 sm:h-44 bg-[#fee3e3] rounded-lg flex items-center justify-center shadow-md mx-auto sm:mx-0 flex-shrink-0">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-[#cf3232]" />
          </div>
          <div className="flex-1 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                Book
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                draft
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#101117] mb-2">{book.title}</h1>
            {book.summary && <p className="text-gray-600 mb-2 text-sm sm:text-base">{book.summary}</p>}
            {book.target_audience && (
              <p className="text-sm text-gray-500">Target Audience: {book.target_audience}</p>
            )}
          </div>
        </div>

        {/* View Outline Toggle */}
        <button
          onClick={() => setOutlineExpanded(!outlineExpanded)}
          className="flex items-center space-x-2 text-[#cf3232] hover:text-red-700 font-medium mb-6"
        >
          {outlineExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          <span>View Outline</span>
        </button>

        {/* Outline Content */}
        {outlineExpanded && (
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
              {buildOutline()}
            </pre>
          </div>
        )}

        {/* Chapters List */}
        <div>
          <h2 className="text-xl font-semibold text-[#101117] mb-4">Chapters:</h2>
          <div className="space-y-3">
            {book.chapters.map((chapter) => (
              <button
                key={chapter.chapter_number}
                onClick={() => handleChapterClick(chapter)}
                className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group"
              >
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#cf3232]" />
                <span className="text-gray-900 font-medium">
                  Chapter {chapter.chapter_number}: {chapter.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Edit Outline
          </button>
          <button className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Wand2 className="w-4 h-4" />
            <span>Regenerate Cover</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;