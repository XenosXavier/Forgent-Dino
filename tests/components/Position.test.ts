import { describe, it, expect } from 'vitest';
import { Position } from '../../src/components/Position';

describe('Position Component', () => {
  describe('constructor', () => {
    it('should create position with default values (0, 0)', () => {
      const position = new Position();

      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
    });

    it('should create position with specified values', () => {
      const position = new Position(100, 200);

      expect(position.x).toBe(100);
      expect(position.y).toBe(200);
    });

    it('should handle negative coordinates', () => {
      const position = new Position(-50, -100);

      expect(position.x).toBe(-50);
      expect(position.y).toBe(-100);
    });

    it('should handle floating point coordinates', () => {
      const position = new Position(10.5, 20.7);

      expect(position.x).toBe(10.5);
      expect(position.y).toBe(20.7);
    });
  });

  describe('mutation', () => {
    it('should allow position modification', () => {
      const position = new Position(0, 0);

      position.x = 50;
      position.y = 100;

      expect(position.x).toBe(50);
      expect(position.y).toBe(100);
    });
  });
});
