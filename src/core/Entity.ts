/**
 * Entity - Container for components
 * Entities are unique IDs that have components attached to them
 */

import type { Component, ComponentConstructor } from './Component';

/**
 * Entity class manages components attached to a game object
 * Uses Map for O(1) component lookup performance
 */
export class Entity {
  private static nextId = 0;
  private readonly id: number;
  private readonly components: Map<ComponentConstructor, Component>;
  private active: boolean;

  constructor() {
    this.id = Entity.nextId++;
    this.components = new Map();
    this.active = true;
  }

  /**
   * Get unique entity ID
   */
  getId(): number {
    return this.id;
  }

  /**
   * Check if entity is active
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Deactivate entity (mark for removal)
   */
  deactivate(): void {
    this.active = false;
  }

  /**
   * Add component to entity
   * @param ctor Component constructor
   * @param component Component instance to add
   * @returns This entity for chaining
   */
  addComponent<T extends Component>(ctor: ComponentConstructor<T>, component: T): this {
    this.components.set(ctor, component);
    return this;
  }

  /**
   * Get component by constructor type
   * @param ctor Component constructor
   * @returns Component instance or undefined
   */
  getComponent<T extends Component>(ctor: ComponentConstructor<T>): T | undefined {
    return this.components.get(ctor) as T | undefined;
  }

  /**
   * Check if entity has component
   * @param ctor Component constructor
   * @returns True if component exists
   */
  hasComponent<T extends Component>(ctor: ComponentConstructor<T>): boolean {
    return this.components.has(ctor);
  }

  /**
   * Remove component by constructor type
   * @param ctor Component constructor
   * @returns True if component was removed
   */
  removeComponent<T extends Component>(ctor: ComponentConstructor<T>): boolean {
    return this.components.delete(ctor);
  }

  /**
   * Get all components attached to this entity
   * @returns Array of all components
   */
  getAllComponents(): Component[] {
    return Array.from(this.components.values());
  }

  /**
   * Remove all components
   */
  clearComponents(): void {
    this.components.clear();
  }
}
