import React, { useEffect, useState } from 'react';
import { Article } from '@/types/next-auth';
import { FaEdit, FaTrash, FaChevronDown, FaChevronRight, FaFileAlt } from 'react-icons/fa';

interface FetchDocsProps {
  isOpen: boolean;
  onSelectDocument: (article: Article) => void;
}

interface EditFormData {
  title: string;
  keywords: string;
}

export default function FetchDocs({ isOpen, onSelectDocument }: FetchDocsProps) {
  const [documents, setDocuments] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({ title: '', keywords: '' });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (docId: string) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
  };

  const handleEditClick = (doc: Article) => {
    setEditingDoc(doc.id);
    setEditForm({
      title: doc.title,
      keywords: doc.keywords || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingDoc(null);
    setEditForm({ title: '', keywords: '' });
  };

  const handleUpdateDocument = async (docId: string) => {
    if (!editForm.title.trim()) {
      alert('Title is required');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/articles/${docId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          keywords: editForm.keywords
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const updatedDoc = await response.json();
      setDocuments(docs => docs.map(doc => 
        doc.id === docId ? updatedDoc : doc
      ));
      setEditingDoc(null);
      setEditForm({ title: '', keywords: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update document');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setIsDeleting(docId);
    try {
      const response = await fetch(`/api/articles/${docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(docs => docs.filter(doc => doc.id !== docId));
      if (expandedDoc === docId) {
        setExpandedDoc(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete document');
    } finally {
      setIsDeleting(null);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading documents...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={fetchDocuments}
          className="bg-blue-500 hover:bg-blue-600 text-foreground px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <FaFileAlt className="mx-auto text-4xl mb-4 opacity-50" />
        <p>No documents found. Create your first article!</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.id} className="border border-neutral-500 rounded-lg">
            {/* Document Header */}
            <div className="flex items-center justify-between p-3 hover:cursor-help">
              <div className="flex items-center flex-1" onClick={() => handleToggleExpand(doc.id)}>
                {expandedDoc === doc.id ? (
                  <FaChevronDown className="text-foreground/80 mr-2" />
                ) : (
                  <FaChevronRight className="text-foreground/80 mr-2" />
                )}
                <FaFileAlt className="text-primary mr-2" />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                  <p className="text-sm text-foreground/80">
                    {doc.updatedAt ? formatDate(doc.updatedAt) : formatDate(doc.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onSelectDocument(doc)}
                  className="bg-blue-500 btn"
                >
                  Open
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedDoc === doc.id && (
              <div className="border-t border-secondary/50 p-3 bg-secondary">
                {editingDoc === doc.id ? (
                  /* Edit Form */
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={editForm.keywords}
                        onChange={(e) => setEditForm(prev => ({ ...prev, keywords: e.target.value }))}
                        placeholder="Enter keywords (comma separated)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateDocument(doc.id)}
                        disabled={isUpdating || !editForm.title.trim()}
                        className="bg-green-500 btn"
                      >
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="bg-gray-500 btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Document Details */
                  <div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium text-foreground/80">ID:</span>
                        <span className="ml-2 text-foreground">{doc.id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground/80">Author:</span>
                        <span className="ml-2 text-foreground">{doc.author}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground/80">Created:</span>
                        <span className="ml-2 text-foreground">{formatDate(doc.createdAt)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground/80">Updated:</span>
                        <span className="ml-2 text-foreground">
                          {doc.updatedAt ? formatDate(doc.updatedAt) : 'Never'}
                        </span>
                      </div>
                    </div>
                    
                    {doc.keywords && (
                      <div className="mb-3">
                        <span className="font-medium text-foreground/80">Keywords:</span>
                        <div className="mt-1">
                          {doc.keywords.split(',').map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-block bg-primary text-foreground px-2 py-1 rounded-full text-xs mr-2 mb-1"
                            >
                              {keyword.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(doc)}
                        className="bg-yellow-500 btn"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        disabled={isDeleting === doc.id}
                        className="bg-red-500 btn"
                      >
                        <FaTrash /> {isDeleting === doc.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}