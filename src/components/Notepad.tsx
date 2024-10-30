import React, { useState, useEffect } from 'react';
import { Save, Copy, Trash2, FileText, LogOut, Plus, Mail } from 'lucide-react';
import { EmailModal } from './EmailModal';
import { Sidebar } from './Sidebar';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

interface NotepadProps {
  onLogout: () => void;
}

export function Notepad({ onLogout }: NotepadProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notepad-notes');
    return saved ? JSON.parse(saved) : [{
      id: '1',
      title: 'Untitled Note',
      content: '',
      lastModified: Date.now()
    }];
  });
  
  const [currentNoteId, setCurrentNoteId] = useState(notes[0].id);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [saved, setSaved] = useState(true);
  
  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

  useEffect(() => {
    localStorage.setItem('notepad-notes', JSON.stringify(notes));
    setSaved(true);
  }, [notes]);

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      lastModified: Date.now()
    };
    setNotes([...notes, newNote]);
    setCurrentNoteId(newNote.id);
  };

  const updateCurrentNote = (updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === currentNoteId 
        ? { ...note, ...updates, lastModified: Date.now() }
        : note
    ));
    setSaved(false);
  };

  const handleDelete = () => {
    if (notes.length === 1) {
      alert('You must keep at least one note.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this note?')) {
      const newNotes = notes.filter(note => note.id !== currentNoteId);
      setNotes(newNotes);
      setCurrentNoteId(newNotes[0].id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <Sidebar
            notes={notes}
            currentNoteId={currentNoteId}
            onNoteSelect={setCurrentNoteId}
            onNewNote={handleNewNote}
          />

          <div className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) => updateCurrentNote({ title: e.target.value })}
                    className="text-lg font-semibold text-gray-800 bg-transparent border-none focus:outline-none flex-1"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Mail className="h-4 w-4 mr-1.5" />
                    Email
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </button>
                </div>
              </div>

              <textarea
                className="w-full h-[calc(100vh-16rem)] p-4 focus:outline-none resize-none"
                value={currentNote.content}
                onChange={(e) => updateCurrentNote({ content: e.target.value })}
                placeholder="Start typing..."
                spellCheck="true"
              />

              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(currentNote.content)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copy
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete
                  </button>
                </div>
                <div className="flex items-center">
                  <Save className={`h-4 w-4 ${saved ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="ml-1.5 text-sm text-gray-500">
                    {saved ? 'Saved' : 'Saving...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          noteTitle={currentNote.title}
          noteContent={currentNote.content}
        />
      )}
    </div>
  );
}