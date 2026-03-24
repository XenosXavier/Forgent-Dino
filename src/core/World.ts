/**
 * World - ECS World Container
 * Manages entities and components
 * In pure ECS, the World owns all entity-component relationships
 */

import type { Entity } from './Entity';
import { createEntity } from './Entity';
import type { Component, ComponentClass } from './Component';

/**
 * World class manages the ECS world
 * - Stores all entities
 * - Stores all component data organized by type
 * - Provides query methods for systems
 */
export class World {
  // Active entities
  private entities: Set<Entity>;

  // Component storage: ComponentClass -> (Entity -> Component)
  private components: Map<ComponentClass, Map<Entity, Component>>;

  // Entities pending removal
  private removalEntities: Set<Entity>;

  constructor() {
    this.entities = new Set();
    this.components = new Map();
    this.removalEntities = new Set();
  }

  /**
   * Create new entity and add to world
   * @returns New entity ID
   */
  createEntity(): Entity {
    const entity = createEntity();
    this.entities.add(entity);
    return entity;
  }

  /**
   * Add existing entity to world
   * @param entity Entity ID to add
   */
  addEntity(entity: Entity): void {
    this.entities.add(entity);
  }

  /**
   * Mark entity for removal (removed at end of frame)
   * @param entity Entity ID to remove
   */
  removeEntity(entity: Entity): void {
    this.removalEntities.add(entity);
  }

  /**
   * Get all active entities
   * @returns Set of active entity IDs
   */
  getEntities(): ReadonlySet<Entity> {
    return this.entities;
  }

  /**
   * Check if entity exists in world
   * @param entity Entity ID
   * @returns True if entity is active
   */
  hasEntity(entity: Entity): boolean {
    return this.entities.has(entity);
  }

  /**
   * Add component to entity
   * @param entity Entity ID
   * @param component Component instance
   */
  addComponent<T extends Component>(entity: Entity, component: T): void {
    if (!this.entities.has(entity)) {
      throw new Error(`Entity ${entity} does not exist in world`);
    }

    const componentClass = component.constructor as ComponentClass<T>;
    let componentMap = this.components.get(componentClass);
    if (!componentMap) {
      componentMap = new Map();
      this.components.set(componentClass, componentMap);
    }

    componentMap.set(entity, component);
  }

  /**
   * Get component from entity
   * @param entity Entity ID
   * @param componentClass Component class
   * @returns Component instance or undefined
   */
  getComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentClass<T>
  ): T | undefined {
    const componentMap = this.components.get(componentClass);
    return componentMap?.get(entity) as T | undefined;
  }

  /**
   * Check if entity has component
   * @param entity Entity ID
   * @param componentClass Component class
   * @returns True if entity has component
   */
  hasComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentClass<T>
  ): boolean {
    const componentMap = this.components.get(componentClass);
    return componentMap?.has(entity) ?? false;
  }

  /**
   * Remove component from entity
   * @param entity Entity ID
   * @param componentClass Component class
   * @returns True if component was removed
   */
  removeComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentClass<T>
  ): boolean {
    const componentMap = this.components.get(componentClass);
    return componentMap?.delete(entity) ?? false;
  }

  /**
   * Get all components for an entity
   * @param entity Entity ID
   * @returns Array of all components attached to entity
   */
  getEntityComponents(entity: Entity): Component[] {
    const result: Component[] = [];

    for (const componentMap of this.components.values()) {
      const component = componentMap.get(entity);
      if (component) {
        result.push(component);
      }
    }

    return result;
  }

  /**
   * Query entities that have specific components
   * @param componentClasses Component classes to query
   * @returns Array of entity IDs that have all specified components
   */
  query(...componentClasses: ComponentClass[]): Entity[] {
    const result: Entity[] = [];

    for (const entity of this.entities) {
      // Check if entity has all required components
      const hasAll = componentClasses.every((componentClass) =>
        this.hasComponent(entity, componentClass)
      );

      if (hasAll) {
        result.push(entity);
      }
    }

    return result;
  }

  /**
   * Cleanup entities marked for removal
   * Called by Engine at end of frame
   */
  cleanup(): void {
    this.cleanupEntities();
  }

  /**
   * Remove all entities marked for deletion
   */
  private cleanupEntities(): void {
    if (this.removalEntities.size === 0) return;

    for (const entity of this.removalEntities) {
      // Remove entity
      this.entities.delete(entity);

      // Remove all components for this entity
      for (const componentMap of this.components.values()) {
        componentMap.delete(entity);
      }
    }

    this.removalEntities.clear();
  }

  /**
   * Remove all entities and components
   */
  clear(): void {
    this.entities.clear();
    this.components.clear();
    this.removalEntities.clear();
  }
}
