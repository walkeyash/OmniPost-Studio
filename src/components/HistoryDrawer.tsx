'use client';

import React from 'react';
import { SavedDraft } from '@/types/repurposer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  drafts: SavedDraft[];
  onSelectDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  drafts,
  onSelectDraft,
  onDeleteDraft,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-icon">📁</span>
            <div>
              <h3 className="drawer-title">Saved Content Library</h3>
              <span className="drawer-subtitle">
                {drafts.length} saved {drafts.length === 1 ? 'campaign' : 'campaigns'} in your workspace
              </span>
            </div>
          </div>
          <button onClick={onClose} className="drawer-close-btn">
            ✕
          </button>
        </div>

        <div className="drawer-list">
          {drafts.length === 0 ? (
            <div className="drawer-empty-state">
              <span className="empty-folder-icon">📂</span>
              <p>No saved campaigns yet.</p>
              <small>Click &quot;Save to Library&quot; on any generated output to store it for future use.</small>
            </div>
          ) : (
            drafts.map((draft) => (
              <div key={draft.id} className="draft-card">
                <div className="draft-header-row">
                  <span className="draft-title">{draft.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDraft(draft.id);
                    }}
                    className="draft-delete-btn"
                    title="Delete saved draft"
                  >
                    🗑️
                  </button>
                </div>

                <p className="draft-preview-text">{draft.sourcePreview}</p>

                <div className="draft-meta-row">
                  <span className="draft-tag">{draft.tone.replace('_', ' ')}</span>
                  <span className="draft-tag audience">{draft.audience}</span>
                  <span className="draft-time">
                    {new Date(draft.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <button
                    onClick={() => {
                      onSelectDraft(draft);
                      onClose();
                    }}
                    className="draft-load-btn"
                  >
                    Load Campaign →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
