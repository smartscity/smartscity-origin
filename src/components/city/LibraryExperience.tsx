import { useState } from 'react';
import type { Dictionary } from '../../i18n';

export default function LibraryExperience({
  text,
}: {
  text: Dictionary['city'];
}) {
  const [mode, setMode] = useState(1);
  const [draft, setDraft] = useState(`# ${text.noteTitle}\n\n${text.noteText}`);
  return (
    <div className="city-editor">
      <div className="city-editor-bar">
        <span>● ● ●</span>
        <span>city-notes.md</span>
      </div>
      <div className="city-editor-modes" aria-label={text.modes}>
        {[text.write, text.split, text.preview].map((label, i) => (
          <button
            key={label}
            aria-pressed={mode === i}
            onClick={() => setMode(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={`city-editor-body mode-${mode}`}>
        {mode !== 2 && (
          <textarea
            aria-label={text.draft}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
          />
        )}
        {mode !== 0 && (
          <div className="city-editor-preview">
            <h4>{draft.split('\n')[0].replace(/^#\s*/, '')}</h4>
            <p>{draft.split('\n').slice(1).join('\n')}</p>
          </div>
        )}
      </div>
      <small>{text.sample}</small>
    </div>
  );
}
