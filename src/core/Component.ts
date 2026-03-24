/**
 * Component - Pure data container (no logic)
 * Components are attached to entities and store game state
 * In pure ECS, components contain only data, never methods
 */

/**
 * Base interface for all components
 * Components should only contain data fields, no methods
 */
export interface Component {}

/**
 * Component class type for identifying component types
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentClass<T extends Component = Component> = new (...args: any[]) => T;
