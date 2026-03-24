/**
 * World - ECS World Container
 * Manages entities, components, and systems
 * In pure ECS, the World owns all entity-component relationships
 */

import type { Entity } from './Entity';
import { createEntity } from './Entity';
import type { Component, ComponentClass } from './Component';
import type { System } from './System';

/**
 * World class manages the ECS world
 * - Stores all entities
 * - Stores all component data organized by type
 * - Manages systems
 * - Provides query methods for systems
 */
export class World {
  // Active entities
  private entities: Set<Entity>;

  // Component storage: ComponentClass -> (Entity -> Component)
  private components: Map<ComponentClass, Map<Entity, Component>>;

  // Systems
  private systems: System[];

  // Entities pending removal
  private entitiesToRemove: Set<Entity>;

  constructor() {
    this.entities = new Set();
    this.components = new Map();
    this.systems = [];
    this.entitiesToRemove = new Set();
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
    this.entitiesToRemove.add(entity);
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
   * @param componentClass Component class
   * @param component Component instance
   */
  addComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentClass<T>,
    component: T
  ): void {
    if (!this.entities.has(entity)) {
      throw new Error(`Entity ${entity} does not exist in world`);
    }

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
   * Register system to world
   * Systems are sorted by priority (higher = earlier execution)
   * @param system System to register
   */
  addSystem(system: System): void {
    this.systems.push(system);
    // Sort systems by priority (descending)
    this.systems.sort((a, b) => b.priority - a.priority);
    // Initialize system if it has init method
    if (system.init) {
      system.init(this);
    }
  }

  /**
   * Remove system from world
   * @param system System to remove
   * @returns True if system was removed
   */
  removeSystem(system: System): boolean {
    const index = this.systems.indexOf(system);
    if (index !== -1) {
      // Cleanup system if it has destroy method
      if (system.destroy) {
        system.destroy();
      }
      this.systems.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get all registered systems
   * @returns Array of systems (sorted by priority)
   */
  getSystems(): readonly System[] {
    return this.systems;
  }

  /**
   * Update all systems (called by engine)
   * @param deltaTime Time since last frame in seconds
   */
  update(deltaTime: number): void {
    // Update all systems in priority order
    for (const system of this.systems) {
      system.update(this, deltaTime);
    }

    // Remove inactive entities at end of frame
    this.cleanupEntities();
  }

  /**
   * Remove all entities marked for deletion
   */
  private cleanupEntities(): void {
    if (this.entitiesToRemove.size === 0) return;

    for (const entity of this.entitiesToRemove) {
      // Remove entity
      this.entities.delete(entity);

      // Remove all components for this entity
      for (const componentMap of this.components.values()) {
        componentMap.delete(entity);
      }
    }

    this.entitiesToRemove.clear();
  }

  /**
   * Remove all entities, components, and systems
   */
  clear(): void {
    // Cleanup all systems
    for (const system of this.systems) {
      if (system.destroy) {
        system.destroy();
      }
    }

    this.entities.clear();
    this.components.clear();
    this.systems = [];
    this.entitiesToRemove.clear();
  }
}
