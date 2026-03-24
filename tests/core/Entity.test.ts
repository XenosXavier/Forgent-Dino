/**
 * Entity unit tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Entity } from '../../src/core/Entity';
import type { Component } from '../../src/core/Component';

// Mock component for testing
class MockComponent implements Component {
  readonly type = 'MockComponent';
  value: number;

  constructor(value: number = 0) {
    this.value = value;
  }
}

class AnotherMockComponent implements Component {
  readonly type = 'AnotherMockComponent';
  name: string;

  constructor(name: string = 'test') {
    this.name = name;
  }
}

describe('Entity', () => {
  let entity: Entity;

  beforeEach(() => {
    entity = new Entity();
  });

  describe('getId', () => {
    it('should return unique ID for each entity', () => {
      const entity1 = new Entity();
      const entity2 = new Entity();
      const entity3 = new Entity();

      expect(entity1.getId()).not.toBe(entity2.getId());
      expect(entity2.getId()).not.toBe(entity3.getId());
      expect(entity1.getId()).not.toBe(entity3.getId());
    });

    it('should return incrementing IDs', () => {
      const entity1 = new Entity();
      const entity2 = new Entity();

      expect(entity2.getId()).toBe(entity1.getId() + 1);
    });
  });

  describe('isActive', () => {
    it('should be active by default', () => {
      expect(entity.isActive()).toBe(true);
    });

    it('should be inactive after deactivate', () => {
      entity.deactivate();
      expect(entity.isActive()).toBe(false);
    });
  });

  describe('addComponent', () => {
    it('should add component to entity', () => {
      const component = new MockComponent(42);
      entity.addComponent(MockComponent, component);

      expect(entity.hasComponent(MockComponent)).toBe(true);
    });

    it('should return entity for chaining', () => {
      const result = entity.addComponent(MockComponent, new MockComponent());
      expect(result).toBe(entity);
    });

    it('should allow adding multiple components', () => {
      entity.addComponent(MockComponent, new MockComponent(42));
      entity.addComponent(AnotherMockComponent, new AnotherMockComponent('test'));

      expect(entity.hasComponent(MockComponent)).toBe(true);
      expect(entity.hasComponent(AnotherMockComponent)).toBe(true);
    });

    it('should replace existing component of same type', () => {
      entity.addComponent(MockComponent, new MockComponent(42));
      entity.addComponent(MockComponent, new MockComponent(100));

      const component = entity.getComponent(MockComponent);
      expect(component?.value).toBe(100);
    });
  });

  describe('getComponent', () => {
    it('should return component if exists', () => {
      const component = new MockComponent(42);
      entity.addComponent(MockComponent, component);

      const result = entity.getComponent(MockComponent);
      expect(result).toBeDefined();
      expect(result?.value).toBe(42);
    });

    it('should return undefined if component does not exist', () => {
      const result = entity.getComponent(MockComponent);
      expect(result).toBeUndefined();
    });

    it('should return correct component type', () => {
      entity.addComponent(MockComponent, new MockComponent(42));
      entity.addComponent(AnotherMockComponent, new AnotherMockComponent('hello'));

      const mock = entity.getComponent(MockComponent);
      const another = entity.getComponent(AnotherMockComponent);

      expect(mock?.value).toBe(42);
      expect(another?.name).toBe('hello');
    });
  });

  describe('hasComponent', () => {
    it('should return true if component exists', () => {
      entity.addComponent(MockComponent, new MockComponent());
      expect(entity.hasComponent(MockComponent)).toBe(true);
    });

    it('should return false if component does not exist', () => {
      expect(entity.hasComponent(MockComponent)).toBe(false);
    });

    it('should return correct value for multiple components', () => {
      entity.addComponent(MockComponent, new MockComponent());

      expect(entity.hasComponent(MockComponent)).toBe(true);
      expect(entity.hasComponent(AnotherMockComponent)).toBe(false);
    });
  });

  describe('removeComponent', () => {
    it('should remove component if exists', () => {
      entity.addComponent(MockComponent, new MockComponent());
      const result = entity.removeComponent(MockComponent);

      expect(result).toBe(true);
      expect(entity.hasComponent(MockComponent)).toBe(false);
    });

    it('should return false if component does not exist', () => {
      const result = entity.removeComponent(MockComponent);
      expect(result).toBe(false);
    });

    it('should only remove specified component', () => {
      entity.addComponent(MockComponent, new MockComponent());
      entity.addComponent(AnotherMockComponent, new AnotherMockComponent());

      entity.removeComponent(MockComponent);

      expect(entity.hasComponent(MockComponent)).toBe(false);
      expect(entity.hasComponent(AnotherMockComponent)).toBe(true);
    });
  });

  describe('getAllComponents', () => {
    it('should return empty array if no components', () => {
      const components = entity.getAllComponents();
      expect(components).toEqual([]);
    });

    it('should return all components', () => {
      entity.addComponent(MockComponent, new MockComponent(42));
      entity.addComponent(AnotherMockComponent, new AnotherMockComponent('test'));

      const components = entity.getAllComponents();
      expect(components).toHaveLength(2);
    });
  });

  describe('clearComponents', () => {
    it('should remove all components', () => {
      entity.addComponent(MockComponent, new MockComponent());
      entity.addComponent(AnotherMockComponent, new AnotherMockComponent());

      entity.clearComponents();

      expect(entity.hasComponent(MockComponent)).toBe(false);
      expect(entity.hasComponent(AnotherMockComponent)).toBe(false);
      expect(entity.getAllComponents()).toHaveLength(0);
    });
  });
});
