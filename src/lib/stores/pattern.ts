import { writable, derived, type Readable } from 'svelte/store';
import type { 
	BeadPattern, 
	AnimationState, 
	EditorState, 
	ComputedBead, 
	StringSegment 
} from '$lib/data/schema';
import { BEAD_COLORS } from '$lib/data/colors';

// Current pattern being edited/viewed
export const currentPattern = writable<BeadPattern | null>(null);

// Animation state
export const animationState = writable<AnimationState>({
	currentStep: 0,
	totalSteps: 0,
	isPlaying: false,
	playbackSpeed: 1
});

// Editor state
export const editorState = writable<EditorState>({
	selectedColor: BEAD_COLORS[0].code,
	selectedRow: null,
	selectedBead: null,
	tool: 'paint'
});

// Bead size constants (in 3D units)
export const BEAD_RADIUS = 0.4;
export const BEAD_HEIGHT = 0.3;
export const BEAD_HOLE_RADIUS = 0.12;

// Adjustable spacing values (as stores for reactivity)
export const beadSpacing = writable(0.65); // X-axis gap between beads
export const rowSpacing = writable(0.65);  // Y-axis gap between rows

// View settings store
export interface ViewSettings {
	beadSpacing: number;
	rowSpacing: number;
	stringColor: string;
}

export const viewSettings = writable<ViewSettings>({
	beadSpacing: 0.65,
	rowSpacing: 0.65,
	stringColor: '#3d3d3d'
});

// Compute 3D positions for all beads in a pattern
export function computeBeadPositions(pattern: BeadPattern, settings: ViewSettings): ComputedBead[] {
	const beads: ComputedBead[] = [];
	let assemblyStep = 0;
	
	const { beadSpacing: bSpacing, rowSpacing: rSpacing } = settings;
	
	pattern.rows.forEach((row, rowIndex) => {
		const y = -rowIndex * rSpacing;
		
		if (row.rowType === 'single') {
			// Single row - beads in a line
			const rowWidth = (row.beads.length - 1) * bSpacing;
			const startX = -rowWidth / 2;
			
			row.beads.forEach((bead, beadIndex) => {
				beads.push({
					id: bead.id,
					colorCode: bead.colorCode,
					position: {
						x: startX + beadIndex * bSpacing,
						y,
						z: 0
					},
					rowIndex,
					beadIndex,
					assemblyStep: assemblyStep++
				});
			});
		} else if (row.rowType === 'split' && row.splitGroups) {
			// Split row - separate groups for limbs
			row.splitGroups.forEach((group) => {
				const groupBeads = group.beads;
				const offsetX = group.side === 'left' ? -1.5 : group.side === 'right' ? 1.5 : 0;
				const offsetZ = group.side === 'center' ? 0 : 0.3;
				
				groupBeads.forEach((bead, beadIndex) => {
					const localY = y - beadIndex * rSpacing * 0.8;
					beads.push({
						id: bead.id,
						colorCode: bead.colorCode,
						position: {
							x: offsetX,
							y: localY,
							z: offsetZ
						},
						rowIndex,
						beadIndex,
						assemblyStep: assemblyStep++,
						groupId: group.id
					});
				});
			});
		}
	});
	
	return beads;
}

// Compute string segments connecting beads
export function computeStringSegments(computedBeads: ComputedBead[]): StringSegment[] {
	const segments: StringSegment[] = [];
	
	// Group beads by their assembly order for string connections
	const sortedBeads = [...computedBeads].sort((a, b) => a.assemblyStep - b.assemblyStep);
	
	for (let i = 0; i < sortedBeads.length - 1; i++) {
		const current = sortedBeads[i];
		const next = sortedBeads[i + 1];
		
		// Simple connection between consecutive beads
		// In reality, pony bead patterns have two strings crossing through
		// We'll simplify to show the general flow
		segments.push({
			id: `seg-${current.id}-${next.id}`,
			startPos: current.position,
			endPos: next.position,
			stringId: i % 2 === 0 ? 'left' : 'right',
			assemblyStep: current.assemblyStep
		});
	}
	
	return segments;
}

// Derived store for computed beads (reacts to pattern AND view settings)
export const computedBeads: Readable<ComputedBead[]> = derived(
	[currentPattern, viewSettings],
	([$pattern, $settings]) => $pattern ? computeBeadPositions($pattern, $settings) : []
);

// Derived store for string segments
export const stringSegments: Readable<StringSegment[]> = derived(
	computedBeads,
	($beads) => computeStringSegments($beads)
);

// Derived store for total animation steps
export const totalSteps: Readable<number> = derived(
	computedBeads,
	($beads) => $beads.length
);

// Update total steps when pattern changes
computedBeads.subscribe(beads => {
	animationState.update(state => ({
		...state,
		totalSteps: beads.length,
		currentStep: Math.min(state.currentStep, beads.length)
	}));
});

// Pattern library (saved patterns)
export const patternLibrary = writable<BeadPattern[]>([]);

// Load patterns from localStorage
export function loadPatternLibrary(): void {
	if (typeof window === 'undefined') return;
	
	const saved = localStorage.getItem('beadPatterns');
	if (saved) {
		try {
			const patterns = JSON.parse(saved);
			patternLibrary.set(patterns);
		} catch (e) {
			console.error('Failed to load patterns:', e);
		}
	}
}

// Save patterns to localStorage
export function savePatternLibrary(patterns: BeadPattern[]): void {
	if (typeof window === 'undefined') return;
	
	localStorage.setItem('beadPatterns', JSON.stringify(patterns));
	patternLibrary.set(patterns);
}

// Add a pattern to the library
export function savePattern(pattern: BeadPattern): void {
	patternLibrary.update(patterns => {
		const existing = patterns.findIndex(p => p.id === pattern.id);
		if (existing >= 0) {
			patterns[existing] = pattern;
		} else {
			patterns.push(pattern);
		}
		savePatternLibrary(patterns);
		return patterns;
	});
}

// Delete a pattern from the library
export function deletePattern(patternId: string): void {
	patternLibrary.update(patterns => {
		const filtered = patterns.filter(p => p.id !== patternId);
		savePatternLibrary(filtered);
		return filtered;
	});
}

