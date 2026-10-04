import { describe, expect, it } from 'vitest';
import { mockStore } from '@/lib/api/mock-store';

describe('mock-store', () => {
  it('seeds from fixture on first access', async () => {
    const tasks = await mockStore.getAll('KanbanTasks.json');
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('finds by id', async () => {
    const all = await mockStore.getAll('KanbanTasks.json');
    const first = all[0];
    const found = await mockStore.getById('KanbanTasks.json', first.id);
    expect(found).toEqual(first);
  });

  it('returns undefined for missing id', async () => {
    const found = await mockStore.getById('KanbanTasks.json', 'does-not-exist');
    expect(found).toBeUndefined();
  });

  it('creates with synthetic id', async () => {
    const before = await mockStore.getAll('KanbanTasks.json');
    const created = await mockStore.create('KanbanTasks.json', {
      title: 'New task',
      status: 'todo',
    } as any);
    expect(created.id).toBeDefined();
    const after = await mockStore.getAll('KanbanTasks.json');
    expect(after.length).toBe(before.length + 1);
  });

  it('updates by id', async () => {
    const all = await mockStore.getAll('KanbanTasks.json');
    const target = all[0];
    const updated = await mockStore.update('KanbanTasks.json', target.id, {
      title: 'Updated',
    } as any);
    expect(updated.title).toBe('Updated');
    const reloaded = await mockStore.getById('KanbanTasks.json', target.id);
    expect(reloaded?.title).toBe('Updated');
  });

  it('throws 404 on update for missing id', async () => {
    await expect(
      mockStore.update('KanbanTasks.json', 'missing', { title: 'X' } as any),
    ).rejects.toMatchObject({ status: 404 });
  });

  it('deletes by id', async () => {
    const before = await mockStore.getAll('KanbanTasks.json');
    const target = before[0];
    await mockStore.delete('KanbanTasks.json', target.id);
    const after = await mockStore.getAll('KanbanTasks.json');
    expect(after.length).toBe(before.length - 1);
  });

  it('throws 404 on delete for missing id', async () => {
    await expect(
      mockStore.delete('KanbanTasks.json', 'missing'),
    ).rejects.toMatchObject({ status: 404 });
  });
});
