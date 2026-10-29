import { useEffect, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { nextRaftStep, raftSnapshot, type RaftStep } from '../lib/raft';
import type { Dictionary } from '../i18n';
export default function RaftDemo({ text }: { text: Dictionary['raft'] }) {
  const [step, setStep] = useState<RaftStep>(0);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const state = raftSnapshot(step);
  const labels = [text.propose, text.replicate, text.commit, text.reset];
  const messages = [
    text.idle,
    text.appended,
    text.acknowledged,
    text.committed,
  ];
  return (
    <div className="raft-demo">
      <div className="demo-topline">
        <span>
          <i className="status-dot" /> {text.term}
        </span>
        <span>
          {text.index}{' '}
          <strong data-testid="commit-index">{state.commitIndex}</strong>
        </span>
      </div>
      <div className={`raft-network step-${step}`}>
        {[
          { name: text.leader, log: state.leader, id: 'L' },
          { name: `${text.follower} A`, log: state.followerA, id: 'A' },
          { name: `${text.follower} B`, log: state.followerB, id: 'B' },
        ].map((node) => (
          <div className={`raft-node node-${node.id}`} key={node.id}>
            <div className="node-symbol">{node.id === 'L' ? '◈' : '◇'}</div>
            <span>{node.name}</span>
            <div className="log-slot">
              <span
                className={node.log.length ? 'log-entry visible' : 'log-entry'}
              >
                {node.log.length ? '#001' : '—'}
              </span>
            </div>
            <small>
              {node.log.length
                ? state.commitIndex
                  ? text.done
                  : node.id === 'A'
                    ? text.ack
                    : text.pending
                : '—'}
            </small>
          </div>
        ))}
        <svg className="raft-lines" viewBox="0 0 500 180" aria-hidden="true">
          <path d="M250 55 L90 140 M250 55 L410 140" />
          <path className="signal" d="M250 55 L90 140 M250 55 L410 140" />
        </svg>
      </div>
      <p className="raft-message" aria-live="polite">
        {messages[step]}
      </p>
      <button
        disabled={!ready}
        className="button demo-action"
        onClick={() => setStep(nextRaftStep(step))}
      >
        {labels[step]}
        {step === 3 ? <RotateCcw size={16} /> : <ArrowRight size={16} />}
      </button>
      <p className="demo-disclaimer">{text.assumptions}</p>
    </div>
  );
}
