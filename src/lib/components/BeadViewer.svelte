<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { currentPattern, computedBeads, stringSegments, animationState } from '$lib/stores/pattern';
	import type { ComputedBead, StringSegment } from '$lib/data/schema';
	import type { SceneManager } from '$lib/three/SceneManager';
	import type { AnimationEngine } from '$lib/three/AnimationEngine';
	
	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let sceneManager: SceneManager | null = null;
	let animationEngine: AnimationEngine | null = null;
	
	// Track current step for reactivity
	let currentStep = $state(0);
	let totalSteps = $state(0);
	let isPlaying = $state(false);
	
	// Subscribe to animation state
	$effect(() => {
		const unsub = animationState.subscribe(state => {
			currentStep = state.currentStep;
			totalSteps = state.totalSteps;
			isPlaying = state.isPlaying;
		});
		return unsub;
	});
	
	// Rebuild scene when pattern changes
	$effect(() => {
		if (!browser) return;
		
		const beads = $computedBeads;
		const strings = $stringSegments;
		
		if (sceneManager && beads.length > 0) {
			rebuildScene(beads, strings);
		}
	});
	
	async function rebuildScene(beads: ComputedBead[], strings: StringSegment[]) {
		if (!sceneManager || !browser) return;
		
		const { createBeadMesh, createStringMesh, createKeychainLoop, clearCaches } = await import('$lib/three/BeadRenderer');
		
		clearCaches();
		sceneManager.clearAll();
		
		// Add keychain loop at top
		const loop = createKeychainLoop();
		sceneManager.scene.add(loop);
		
		// Add all beads
		beads.forEach(bead => {
			const mesh = createBeadMesh(bead);
			sceneManager!.addBead(mesh);
		});
		
		// Add string segments
		strings.forEach(seg => {
			const mesh = createStringMesh(seg.startPos, seg.endPos, seg.assemblyStep);
			sceneManager!.addString(mesh);
		});
		
		// Show all by default
		sceneManager.showAll();
		sceneManager.centerCamera();
	}
	
	function handleResize() {
		if (!container || !sceneManager) return;
		const { width, height } = container.getBoundingClientRect();
		sceneManager.resize(width, height);
	}
	
	// Animation controls
	function play() {
		animationEngine?.play();
	}
	
	function pause() {
		animationEngine?.pause();
	}
	
	function stop() {
		animationEngine?.stop();
	}
	
	function stepForward() {
		animationEngine?.stepForward();
	}
	
	function stepBackward() {
		animationEngine?.stepBackward();
	}
	
	function goToEnd() {
		animationEngine?.goToEnd();
	}
	
	function handleSliderChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const step = parseInt(target.value);
		animationEngine?.goToStep(step);
	}
	
	function resetCamera() {
		sceneManager?.resetCamera();
	}
	
	function centerCamera() {
		sceneManager?.centerCamera();
	}
	
	onMount(async () => {
		if (!canvas || !container) return;
		
		// Dynamic imports to avoid SSR issues
		const { SceneManager: SM } = await import('$lib/three/SceneManager');
		const { AnimationEngine: AE } = await import('$lib/three/AnimationEngine');
		
		const { width, height } = container.getBoundingClientRect();
		
		sceneManager = new SM({
			canvas,
			width,
			height
		});
		
		animationEngine = new AE(sceneManager);
		
		sceneManager.startRenderLoop();
		
		window.addEventListener('resize', handleResize);
		
		// Initial build if pattern exists
		const pattern = $currentPattern;
		if (pattern) {
			const beads = $computedBeads;
			const strings = $stringSegments;
			await rebuildScene(beads, strings);
		}
	});
	
	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', handleResize);
		}
		animationEngine?.dispose();
		sceneManager?.dispose();
	});
</script>

<div class="viewer-container" bind:this={container}>
	<canvas bind:this={canvas}></canvas>
	
	<!-- Camera controls overlay -->
	<div class="camera-controls">
		<button onclick={resetCamera} title="Reset Camera">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
				<path d="M3 3v5h5"/>
			</svg>
		</button>
		<button onclick={centerCamera} title="Center View">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="3"/>
				<path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
			</svg>
		</button>
	</div>
	
	<!-- Animation controls -->
	{#if totalSteps > 0}
		<div class="animation-controls">
			<div class="controls-row">
				<button onclick={stop} title="Stop">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<rect x="6" y="6" width="12" height="12" rx="1"/>
					</svg>
				</button>
				<button onclick={stepBackward} title="Step Back">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 5v14l-8-7 8-7zM5 5h3v14H5V5z"/>
					</svg>
				</button>
				{#if isPlaying}
					<button class="play-btn" onclick={pause} title="Pause">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<rect x="6" y="5" width="4" height="14" rx="1"/>
							<rect x="14" y="5" width="4" height="14" rx="1"/>
						</svg>
					</button>
				{:else}
					<button class="play-btn" onclick={play} title="Play">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 5.14v14l11-7-11-7z"/>
						</svg>
					</button>
				{/if}
				<button onclick={stepForward} title="Step Forward">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M5 5v14l8-7-8-7zm11 0h3v14h-3V5z"/>
					</svg>
				</button>
				<button onclick={goToEnd} title="Go to End">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M5 5v14l8-7-8-7zm8 0v14l8-7-8-7z"/>
					</svg>
				</button>
			</div>
			<div class="progress-row">
				<span class="step-label">{currentStep + 1} / {totalSteps}</span>
				<input 
					type="range" 
					min="0" 
					max={totalSteps - 1} 
					value={currentStep}
					oninput={handleSliderChange}
				/>
			</div>
		</div>
	{/if}
	
	<!-- Instructions overlay -->
	{#if !$currentPattern}
		<div class="instructions">
			<p>Select a pattern from the library or create a new one to view it in 3D</p>
		</div>
	{/if}
</div>

<style>
	.viewer-container {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 400px;
		background: linear-gradient(135deg, #0f0f13 0%, #1a1a22 100%);
		border-radius: 12px;
		overflow: hidden;
	}
	
	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}
	
	.camera-controls {
		position: absolute;
		top: 12px;
		right: 12px;
		display: flex;
		gap: 8px;
	}
	
	.camera-controls button {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(26, 26, 34, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #a1a1aa;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.camera-controls button:hover {
		background: rgba(99, 102, 241, 0.3);
		color: #f4f4f5;
		border-color: rgba(99, 102, 241, 0.5);
	}
	
	.animation-controls {
		position: absolute;
		bottom: 16px;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(26, 26, 34, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 12px 16px;
		backdrop-filter: blur(8px);
	}
	
	.controls-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-bottom: 10px;
	}
	
	.controls-row button {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #a1a1aa;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.controls-row button:hover {
		background: rgba(99, 102, 241, 0.3);
		color: #f4f4f5;
	}
	
	.controls-row .play-btn {
		width: 44px;
		height: 44px;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		border: none;
		color: white;
	}
	
	.controls-row .play-btn:hover {
		background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
	}
	
	.progress-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	
	.step-label {
		font-size: 12px;
		color: #a1a1aa;
		min-width: 60px;
		text-align: center;
	}
	
	.progress-row input[type="range"] {
		flex: 1;
		min-width: 150px;
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		appearance: none;
		cursor: pointer;
	}
	
	.progress-row input[type="range"]::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		background: #6366f1;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.1s;
	}
	
	.progress-row input[type="range"]::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}
	
	.instructions {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		color: #71717a;
		font-size: 14px;
	}
</style>

