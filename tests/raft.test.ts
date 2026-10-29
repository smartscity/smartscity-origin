import { describe, expect, it } from 'vitest';
import { nextRaftStep, raftSnapshot, type RaftStep } from '../src/lib/raft';
import { alternatePath } from '../src/i18n';
describe('Raft teaching model', () => {
  it('does not commit on leader append or before majority replication', () => {
    expect(raftSnapshot(1)).toMatchObject({
      leader: [1],
      followerA: [],
      followerB: [],
      commitIndex: 0,
      acknowledgments: 1,
    });
    expect(raftSnapshot(2)).toMatchObject({
      followerA: [1],
      followerB: [],
      commitIndex: 0,
      acknowledgments: 2,
    });
  });
  it('only exposes a committed entry present on a majority of nodes', () => {
    for (let step = 0; step <= 3; step++) {
      const state = raftSnapshot(step as RaftStep);
      if (state.commitIndex)
        expect(
          [state.leader, state.followerA, state.followerB].filter((log) =>
            log.includes(state.commitIndex),
          ).length,
        ).toBeGreaterThanOrEqual(2);
    }
    expect(raftSnapshot(3).commitIndex).toBe(1);
  });
  it('resets all node logs when the cycle is restarted', () => {
    expect(raftSnapshot(nextRaftStep(3))).toEqual({
      leader: [],
      followerA: [],
      followerB: [],
      acknowledgments: 0,
      commitIndex: 0,
    });
  });
});
describe('locale routing', () => {
  it('preserves project paths when switching languages', () =>
    expect(alternatePath('/en/projects/polarbear/', 'zh-CN')).toBe(
      '/zh-CN/projects/polarbear/',
    ));
  it('handles locale roots and only replaces a complete locale segment', () => {
    expect(alternatePath('/zh-CN', 'en')).toBe('/en/');
    expect(alternatePath('/en', 'zh-CN')).toBe('/zh-CN/');
    expect(alternatePath('/engineering/', 'zh-CN')).toBe('/zh-CN/engineering/');
  });
});
