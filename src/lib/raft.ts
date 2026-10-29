/** A fixed-leader, current-term, single-entry teaching model; never a Raft implementation. */
export type RaftStep = 0 | 1 | 2 | 3;
export function nextRaftStep(step: RaftStep): RaftStep {
  return step === 3 ? 0 : ((step + 1) as RaftStep);
}
export function raftSnapshot(step: RaftStep) {
  return {
    leader: step >= 1 ? [1] : [],
    followerA: step >= 2 ? [1] : [],
    followerB: step >= 3 ? [1] : [],
    acknowledgments: step >= 2 ? 2 : step >= 1 ? 1 : 0,
    commitIndex: step >= 3 ? 1 : 0,
  };
}
