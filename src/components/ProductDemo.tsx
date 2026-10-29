import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, BookOpen, PenLine, Folder } from 'lucide-react';
import type { Dictionary } from '../i18n';
export default function ProductDemo({
  kind,
  text,
}: {
  kind: string;
  text: Dictionary['demos'];
}) {
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [revealed, setRevealed] = useState(false);
  const [editing, setEditing] = useState(false);
  const reduced = useReducedMotion();
  const [draft, setDraft] = useState(`# ${text.noteTitle}\n\n${text.noteText}`);
  if (kind === 'polarbear')
    return (
      <div className="editor-demo">
        <div className="window-bar">
          <span className="window-dots">● ● ●</span>
          <span>PolarBear / {text.preview}</span>
        </div>
        <div className="editor-body">
          <aside>
            <Folder size={18} />
            <span>{text.notes}</span>
            <span className="file-name">welcome.md</span>
          </aside>
          <div className="editor-paper">
            <div className="editor-tabs">
              <button
                disabled={!ready}
                aria-pressed={!editing}
                onClick={() => setEditing(false)}
              >
                <BookOpen size={14} />
                {text.read}
              </button>
              <button
                disabled={!ready}
                aria-pressed={editing}
                onClick={() => setEditing(true)}
              >
                <PenLine size={14} />
                {text.write}
              </button>
            </div>
            {editing ? (
              <textarea
                aria-label={text.draft}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            ) : (
              <>
                <h3>{draft.split('\n')[0].replace(/^#\s*/, '')}</h3>
                <p>{draft.split('\n').slice(1).join('\n')}</p>
                <div className="paper-lines">
                  <i />
                  <i />
                  <i />
                </div>
              </>
            )}
            <small>{text.local}</small>
          </div>
        </div>
      </div>
    );
  if (kind === 'qualitysphere')
    return (
      <div className="pipeline-demo">
        <div className="demo-topline">
          <span>
            <i className="status-dot" /> {text.preview}
          </span>
          <span>{step}/5</span>
        </div>
        <div className="pipeline-stages">
          {text.pipeline.map((label, i) => (
            <div className={i < step ? 'stage active' : 'stage'} key={label}>
              <span>{i < step ? <Check size={20} /> : `0${i + 1}`}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>
        <p aria-live="polite">{step === 5 ? text.complete : text.ready}</p>
        <button
          disabled={!ready}
          className="button"
          onClick={() => setStep(step === 5 ? 0 : step + 1)}
        >
          {step === 5 ? text.reset : text.run}
          <ArrowRight size={16} />
        </button>
        <p className="demo-disclaimer">{text.pipelineNote}</p>
      </div>
    );
  const second = step % 2 === 1;
  return (
    <div className="vocab-demo">
      <div className="demo-topline">
        <span>{text.wordLabel}</span>
        <span>0{second ? 2 : 1} / 02</span>
      </div>
      <motion.div
        key={`${step}-${revealed}`}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="word-content"
      >
        <span className="word-symbol">✳</span>
        <h3>{second ? text.word2 : text.word}</h3>
        <p className="phonetic">{second ? text.phonetic2 : text.phonetic}</p>
        {revealed && (
          <div className="word-definition" aria-live="polite">
            <p>{second ? text.definition2 : text.definition}</p>
            <em>{second ? text.example2 : text.example}</em>
          </div>
        )}
      </motion.div>
      <div className="word-actions">
        <button
          disabled={!ready}
          className="button"
          onClick={() => setRevealed(!revealed)}
          aria-expanded={revealed}
        >
          {text.reveal}
          <BookOpen size={16} />
        </button>
        <button
          disabled={!ready}
          className="text-button"
          onClick={() => {
            setStep(step + 1);
            setRevealed(false);
          }}
        >
          {text.next}
          <ArrowRight size={16} />
        </button>
      </div>
      <p className="demo-disclaimer">
        {text.preview} · {text.local}
      </p>
    </div>
  );
}
