import test from 'node:test';
import assert from 'node:assert/strict';
import { selectDrills, drills } from './coaching.ts';
test('targets observed weaknesses without assigning drills to successes or missing evidence', () => {
  assert.deepEqual(selectDrills([{kind:'literal',correct:1,total:1},{kind:'inference',correct:0,total:0}]), []);
  assert.deepEqual(selectDrills([{kind:'literal',correct:3,total:4},{kind:'inference',correct:0,total:2},{kind:'cohesion',correct:1,total:2}]).map(d=>d.kind), ['inference','cohesion']);
});
test('does not fabricate coaching for unsupported skills or invalid counts', () => {
  assert.deepEqual(selectDrills([{kind:'stance',correct:0,total:1},{kind:'literal',correct:-1,total:1}]), []);
  for (const drill of drills) for (const item of drill.examples) assert.ok(item.answer >= 0 && item.answer < item.options.length);
});
