// Bead Crafter - 3D Beaded Animal Generator
// Export components
export { default as BeadViewer } from './components/BeadViewer.svelte';
export { default as PatternEditor } from './components/PatternEditor.svelte';
export { default as ColorPicker } from './components/ColorPicker.svelte';
export { default as PatternLibrary } from './components/PatternLibrary.svelte';

// Export data types and utilities
export * from './data/schema';
export * from './data/colors';
export { samplePatterns } from './data/patterns';

// Export stores
export * from './stores/pattern';

// Export Three.js utilities
export { SceneManager } from './three/SceneManager';
export { AnimationEngine } from './three/AnimationEngine';
export * from './three/BeadRenderer';
