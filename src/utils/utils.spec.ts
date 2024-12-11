import { formatDate } from './format';
import { removeDuplicate } from './removeDuplicate';
import { sortByDate } from './sortByDate';

describe('formatDate function tests', () => {
  it('should format date correctly', () => {
    const date = new Date(2023, 0, 1);
    expect(formatDate(date)).toBe('2023-1-1');
  });

  it('should format date with different months and days', () => {
    const date = new Date(2023, 11, 31);
    expect(formatDate(date)).toBe('2023-12-31');
  });
});

describe('removeDuplicate function tests', () => {
  it('should remove duplicates based on key', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice' }
    ];
    const result = removeDuplicate(items, 'id');
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
  });

  it('should handle empty array', () => {
    const items: { id: number; name: string }[] = [];
    const result = removeDuplicate(items, 'id');
    expect(result).toEqual([]);
  });

  it('should remove duplicates based on different key', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Alice' }
    ];
    const result = removeDuplicate(items, 'name');
    expect(result).toEqual([
      { id: 3, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
  });
});

describe('sortByDate function tests', () => {
  it('should sort array of objects by date', () => {
    const items = [
      { date: new Date(2023, 0, 1), value: 'A' },
      { date: new Date(2022, 0, 1), value: 'B' },
      { date: new Date(2024, 0, 1), value: 'C' }
    ];
    const result = items.sort(sortByDate);
    expect(result).toEqual([
      { date: new Date(2022, 0, 1), value: 'B' },
      { date: new Date(2023, 0, 1), value: 'A' },
      { date: new Date(2024, 0, 1), value: 'C' }
    ]);
  });

  it('should handle empty array', () => {
    const items: { date: Date; value: string }[] = [];
    const result = items.sort(sortByDate);
    expect(result).toEqual([]);
  });

  it('should return 0 for identical dates', () => {
    const items = [
      { date: new Date(2023, 0, 1), value: 'A' },
      { date: new Date(2023, 0, 1), value: 'B' }
    ];
    const result = items.sort(sortByDate);
    expect(result).toEqual([
      { date: new Date(2023, 0, 1), value: 'A' },
      { date: new Date(2023, 0, 1), value: 'B' }
    ]);
  });
});
