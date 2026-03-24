/**
 * Component - Pure data container (no logic)
 * Components are attached to entities and store game state
 */

/**
 * Base interface for all components
 * Components should only contain data, no methods
 */
export interface Component {
  /**
   * Unique type identifier for this component
   * Used for component queries and type checking
   */
  readonly type: string;
}

/**
 * Component constructor type for creating component instances
 */
export type ComponentConstructor<T extends Component = Component> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]) => T;
