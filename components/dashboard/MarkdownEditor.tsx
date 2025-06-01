import React, { useState } from "react";
import MDEditor, { ICommand, commands } from "@uiw/react-md-editor";
import { Article, ArticleFormData } from "@/types/next-auth";
import { FaSave, FaFolderOpen } from "react-icons/fa";
import FetchDocs from "./FetchDocs";

export default function MarkdownEditor() {
  const [value, setValue] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(true);
  const [showDocsDialog, setShowDocsDialog] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    keywords: "",
    author: "Current User" // This would typically come from your auth context
  });

  const createArticle = async (articleData: ArticleFormData): Promise<Article> => {
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: articleData.title,
        keywords: articleData.keywords
      })
    });
    if (!res.ok) throw new Error('Failed to create article');
    return res.json();
  };
  
  const saveArticleContent = async (articleId: string, content: string): Promise<void> => {
    console.log(`Saving article ${articleId} with content:`, content);
    await fetch(`/api/articles/${articleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    console.log("Article saved successfully!");
  };

  const handleCreateArticle = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsCreating(true);
    try {
      const newArticle = await createArticle(formData);
      setCurrentArticle(newArticle);
      setValue(newArticle.content);
      setShowCreateDialog(false);
      setFormData({
        title: "",
        keywords: "",
        author: "Current User"
      });
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Failed to create article. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: keyof ArticleFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentSelect = (article: Article) => {
    setCurrentArticle(article);
    setValue(article.content || "");
    setShowDocsDialog(false);
    setShowCreateDialog(false);
  };

  const saveCommand: ICommand = {
    name: "save",
    keyCommand: "save",
    buttonProps: { "aria-label": "Save Article" },
    icon: (
      <span className="text-sm font-bold flex items-center gap-1">
        <FaSave /> Save
      </span>
    ),
    execute: async (): Promise<void> => {
      if (currentArticle) {
        try {
          await saveArticleContent(currentArticle.id, value);
          alert("Article saved successfully!");
        } catch (error) {
          console.error("Error saving article:", error);
          alert("Failed to save article. Please try again.");
        }
      }
    },
  };

  const openDocsCommand: ICommand = {
    name: "open-docs",
    keyCommand: "open-docs",
    buttonProps: { "aria-label": "Open Documents" },
    icon: (
      <span className="text-sm flex items-center gap-1">
        <FaFolderOpen /> Docs
      </span>
    ),
    execute: (): void => {
      setShowDocsDialog(true);
    },
  };

  return (
    <div>
      {/* Create Article Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary rounded-lg shadow-lg p-6 min-w-96 max-w-md">
            <h2 className="mt-0 mb-5 text-xl font-bold">Create New Article</h2>
            
            <div className="mb-4">
              <label className="block mb-2 font-bold">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter article title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
                placeholder="Enter keywords (comma separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex gap-3 justify-between">
              <button
                onClick={() => setShowDocsDialog(true)}
                className="btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FaFolderOpen /> Open Document
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateDialog(false)}
                  disabled={isCreating}
                  className="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateArticle}
                  disabled={isCreating || !formData.title.trim()}
                  className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Article"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Dialog */}
      {showDocsDialog && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary rounded-lg shadow-sm p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Documents</h2>
              <button
                onClick={() => setShowDocsDialog(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <FetchDocs onSelectDocument={handleDocumentSelect} isOpen={showDocsDialog} />
          </div>
        </div>
      )}

      {/* Article Info Header */}
      {currentArticle && (
        <div className="bg-secondary shadow-sm p-3 border-b border-gray-200">
          <h3 className="m-0 text-lg font-semibold">{currentArticle.title}</h3>
          <p className="mt-1 mb-0 text-xs opacity-70">
            ID: {currentArticle.id} | Author: {currentArticle.author}
            {currentArticle.keywords && ` | Keywords: ${currentArticle.keywords}`}
          </p>
        </div>
      )}

      {/* Markdown Editor */}
      {!showCreateDialog && !showDocsDialog && (
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || "")}
          height={currentArticle ? window.innerHeight * 0.85 : window.innerHeight * 0.92}
          style={{
            borderRadius: 0,
            backgroundColor: "transparent"
          }}
          commands={[
            ...commands.getCommands(),
            openDocsCommand,
            saveCommand,
          ]}
        />
      )}
    </div>
  );
}
