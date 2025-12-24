<script lang="ts">
	import { onMount } from 'svelte';
	import { currentPattern, patternLibrary, loadPatternLibrary, savePattern, deletePattern } from '$lib/stores/pattern';
	import { getHexByCode } from '$lib/data/colors';
	import type { BeadPattern } from '$lib/data/schema';
	
	// Import sample patterns
	import { samplePatterns } from '$lib/data/patterns';
	
	let patterns = $state<BeadPattern[]>([]);
	let activePatternId = $state<string | null>(null);
	let showSamples = $state(true);
	
	$effect(() => {
		const unsub = patternLibrary.subscribe(p => {
			patterns = p;
		});
		return unsub;
	});
	
	$effect(() => {
		const unsub = currentPattern.subscribe(p => {
			activePatternId = p?.id ?? null;
		});
		return unsub;
	});
	
	onMount(() => {
		loadPatternLibrary();
	});
	
	function selectPattern(pattern: BeadPattern) {
		currentPattern.set(structuredClone(pattern));
	}
	
	function handleSave() {
		const pattern = $currentPattern;
		if (pattern) {
			savePattern(pattern);
		}
	}
	
	function handleDelete(patternId: string) {
		if (confirm('Delete this pattern?')) {
			deletePattern(patternId);
			if (activePatternId === patternId) {
				currentPattern.set(null);
			}
		}
	}
	
	function getPatternPreviewColors(pattern: BeadPattern): string[] {
		const colors = new Set<string>();
		pattern.rows.forEach(row => {
			row.beads.forEach(bead => {
				colors.add(bead.colorCode);
			});
		});
		return Array.from(colors).slice(0, 5);
	}
	
	function getPatternBeadCount(pattern: BeadPattern): number {
		return pattern.rows.reduce((sum, row) => sum + row.beads.length, 0);
	}
</script>

<div class="pattern-library">
	<div class="library-header">
		<h3>Pattern Library</h3>
		<button class="save-btn" onclick={handleSave} title="Save Current Pattern">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
				<polyline points="17,21 17,13 7,13 7,21"/>
				<polyline points="7,3 7,8 15,8"/>
			</svg>
		</button>
	</div>
	
	<!-- Sample patterns section -->
	<div class="section">
		<button class="section-header" onclick={() => showSamples = !showSamples}>
			<span>Sample Patterns</span>
			<svg 
				xmlns="http://www.w3.org/2000/svg" 
				width="16" 
				height="16" 
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				stroke-width="2"
				class:rotated={showSamples}
			>
				<polyline points="6,9 12,15 18,9"/>
			</svg>
		</button>
		
		{#if showSamples}
			<div class="pattern-grid">
				{#each samplePatterns as pattern}
					<button 
						class="pattern-card"
						class:active={activePatternId === pattern.id}
						onclick={() => selectPattern(pattern)}
					>
						<div class="pattern-preview">
							{#each getPatternPreviewColors(pattern) as color}
								<span class="color-dot" style="background: {getHexByCode(color)}"></span>
							{/each}
						</div>
						<div class="pattern-info">
							<span class="pattern-name">{pattern.name}</span>
							<span class="pattern-stats">{getPatternBeadCount(pattern)} beads</span>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
	
	<!-- Saved patterns section -->
	{#if patterns.length > 0}
		<div class="section">
			<div class="section-header">
				<span>My Patterns</span>
			</div>
			
			<div class="pattern-grid">
				{#each patterns as pattern}
					<div class="pattern-card-wrapper">
						<button 
							class="pattern-card"
							class:active={activePatternId === pattern.id}
							onclick={() => selectPattern(pattern)}
						>
							<div class="pattern-preview">
								{#each getPatternPreviewColors(pattern) as color}
									<span class="color-dot" style="background: {getHexByCode(color)}"></span>
								{/each}
							</div>
							<div class="pattern-info">
								<span class="pattern-name">{pattern.name}</span>
								<span class="pattern-stats">{getPatternBeadCount(pattern)} beads</span>
							</div>
						</button>
						<button 
							class="delete-btn"
							onclick={() => handleDelete(pattern.id)}
							title="Delete Pattern"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
							</svg>
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.pattern-library {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	
	.library-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.library-header h3 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		color: #f4f4f5;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.save-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(99, 102, 241, 0.2);
		border: none;
		border-radius: 6px;
		color: #818cf8;
		cursor: pointer;
		transition: all 0.15s;
	}
	
	.save-btn:hover {
		background: rgba(99, 102, 241, 0.3);
		color: #a5b4fc;
	}
	
	.section {
		padding: 12px;
	}
	
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.03);
		border: none;
		border-radius: 6px;
		color: #a1a1aa;
		font-size: 12px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		cursor: pointer;
		transition: all 0.15s;
	}
	
	.section-header:hover {
		background: rgba(255, 255, 255, 0.05);
	}
	
	.section-header svg {
		transition: transform 0.2s;
	}
	
	.section-header svg.rotated {
		transform: rotate(180deg);
	}
	
	.pattern-grid {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 12px;
	}
	
	.pattern-card-wrapper {
		position: relative;
	}
	
	.pattern-card {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.15s;
		text-align: left;
	}
	
	.pattern-card:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.1);
	}
	
	.pattern-card.active {
		background: rgba(99, 102, 241, 0.15);
		border-color: rgba(99, 102, 241, 0.4);
	}
	
	.pattern-preview {
		display: flex;
		gap: 3px;
		padding: 6px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 6px;
	}
	
	.color-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2);
	}
	
	.pattern-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	
	.pattern-name {
		font-size: 14px;
		font-weight: 500;
		color: #f4f4f5;
	}
	
	.pattern-stats {
		font-size: 11px;
		color: #71717a;
	}
	
	.delete-btn {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: #52525b;
		cursor: pointer;
		opacity: 0;
		transition: all 0.15s;
	}
	
	.pattern-card-wrapper:hover .delete-btn {
		opacity: 1;
	}
	
	.delete-btn:hover {
		background: rgba(239, 68, 68, 0.2);
		color: #ef4444;
	}
</style>

