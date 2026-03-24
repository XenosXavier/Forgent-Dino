/**
 * World - Container for entities and systems
 * Manages entity lifecycle and system registration
 */

import { Entity } from './Entity';
import type { System } from './System';
import type { ComponentConstructor } from './Component';

/**
 * World class manages all entities and systems
 * Provides query methods for systems to find entities
 */
export class World {
  private entities: Entity[];
  private systems: System[];
  private entitiesToRemove: Set<Entity>;

  constructor() {
    this.entities = [];
    this.systems = [];
    this.entitiesToRemove = new Set();
  }

  /**
   * Create and add new entity to world
   * @returns New entity instance
   */
  createEntity(): Entity {
    const entity = new Entity();
    this.entities.push(entity);
    return entity;
  }

  /**
   * Add existing entity to world
   * @param entity Entity to add
   */
  addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  /**
   * Mark entity for removal (removed at end of frame)
   * @param entity Entity to remove
   */
  removeEntity(entity: Entity): void {
    entity.deactivate();
    this.entitiesToRemove.add(entity);
  }

  /**
   * Get all active entities
   * @returns Array of active entities
   */
  getEntities(): readonly Entity[] {
    return this.entities.filter((e) => e.isActive());
  }

  /**
   * Query entities that have specific components
   * @param ctors Component constructors to query
   * @returns Array of matching entities
   */
  queryEntities(...ctors: ComponentConstructor[]): Entity[] {
    return this.entities.filter((entity) => {
      if (!entity.isActive()) return false;
      return ctors.every((ctor) => entity.hasComponent(ctor));
    });
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
   * Remove all inactive entities from world
   */
  private cleanupEntities(): void {
    if (this.entitiesToRemove.size === 0) return;

    // Remove entities marked for deletion
    this.entities = this.entities.filter(
      (entity) => !this.entitiesToRemove.has(entity)
    );
    this.entitiesToRemove.clear();
  }

  /**
   * Remove all entities and systems
   */
  clear(): void {
    // Cleanup all systems
    for (const system of this.systems) {
      if (system.destroy) {
        system.destroy();
      }
    }

    this.entities = [];
    this.systems = [];
    this.entitiesToRemove.clear();
  }
}
