/**
 * Core ECS (Entity Component System) exports
 */

export type { Entity } from './entity';
export { createEntity, resetEntityCounter } from './entity';
export { System } from './system';
export { World } from './world';
export { Engine } from './engine';
export type { EngineConfig } from './engine';
export type { Component, ComponentClass } from './component';
