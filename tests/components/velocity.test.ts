import { describe, it, expect } from 'vitest';
import { Velocity } from '../../src/components/velocity';

describe('Velocity Component', () => {
  describe('constructor', () => {
    it('should create velocity with default values (0, 0)', () => {
      const velocity = new Velocity();

      expect(velocity.vx).toBe(0);
      expect(velocity.vy).toBe(0);
    });

    it('should create velocity with specified values', () => {
      const velocity = new Velocity(100, -50);

      expect(velocity.vx).toBe(100);
      expect(velocity.vy).toBe(-50);
    });

    it('should handle negative velocities', () => {
      const velocity = new Velocity(-100, -200);

      expect(velocity.vx).toBe(-100);
      expect(velocity.vy).toBe(-200);
    });

    it('should handle floating point velocities', () => {
      const velocity = new Velocity(10.5, 20.7);

      expect(velocity.vx).toBe(10.5);
      expect(velocity.vy).toBe(20.7);
    });

    it('should handle zero velocity', () => {
      const velocity = new Velocity(0, 0);

      expect(velocity.vx).toBe(0);
      expect(velocity.vy).toBe(0);
    });
  });

  describe('mutation', () => {
    it('should allow velocity modification', () => {
      const velocity = new Velocity(100, 50);

      velocity.vx = 200;
      velocity.vy = -100;

      expect(velocity.vx).toBe(200);
      expect(velocity.vy).toBe(-100);
    });
  });
});
