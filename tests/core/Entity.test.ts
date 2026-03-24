import { describe, it, expect, beforeEach } from 'vitest';
import { createEntity, resetEntityCounter } from '../../src/core/Entity';

describe('Entity', () => {
  beforeEach(() => {
    resetEntityCounter();
  });

  describe('createEntity', () => {
    it('should create unique entity IDs', () => {
      const entity1 = createEntity();
      const entity2 = createEntity();
      const entity3 = createEntity();

      expect(entity1).not.toBe(entity2);
      expect(entity2).not.toBe(entity3);
      expect(entity1).not.toBe(entity3);
    });

    it('should create incrementing IDs', () => {
      const entity1 = createEntity();
      const entity2 = createEntity();

      expect(entity2).toBe(entity1 + 1);
    });

    it('should return number type', () => {
      const entity = createEntity();
      expect(typeof entity).toBe('number');
    });

    it('should start from 0', () => {
      const entity = createEntity();
      expect(entity).toBe(0);
    });
  });

  describe('resetEntityCounter', () => {
    it('should reset ID counter to 0', () => {
      createEntity();
      createEntity();
      createEntity();

      resetEntityCounter();

      const entity = createEntity();
      expect(entity).toBe(0);
    });
  });
});
