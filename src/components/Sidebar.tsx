import React from 'react';
import { Plus } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  lastModified: number;
}

interface SidebarProps {
  notes: Note[];
  currentNoteId: string;
  onNoteSelect: (id: string) => void;
  onNewNote: () => void;
}

export function Sidebar({ notes, currentNoteId, onNoteSelect, onNewNote }: SidebarProps) {
  return (
    <div className="col-span-12 md:col-span-3">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
          <button
            onClick={onNewNote}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => onNoteSelect(note.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                note.id === currentNoteId
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="font-medium truncate">{note.title}</div>
              <div className="text-xs text-gray-500">
                {new Date(note.lastModified).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}