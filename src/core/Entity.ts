/**
 * Entity - Pure ECS Entity (ID only)
 * In pure ECS, an entity is just a unique identifier
 * All data lives in components, managed by the World
 */

/**
 * Entity type - just a unique number
 * Entities don't have methods or data, only an ID
 */
export type Entity = number;

/**
 * Entity ID generator
 */
let nextEntityId = 0;

/**
 * Create a new unique entity ID
 * @returns New entity ID
 */
export function createEntity(): Entity {
  return nextEntityId++;
}

/**
 * Reset entity ID counter (useful for testing)
 */
export function resetEntityCounter(): void {
  nextEntityId = 0;
}
