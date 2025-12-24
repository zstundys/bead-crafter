<script lang="ts">
	import { BEAD_COLORS, getColorGroups } from '$lib/data/colors';
	import { editorState } from '$lib/stores/pattern';
	import type { ColorDef } from '$lib/data/schema';
	
	let selectedColor = $state('P');
	
	$effect(() => {
		const unsub = editorState.subscribe(state => {
			selectedColor = state.selectedColor;
		});
		return unsub;
	});
	
	const colorGroups = getColorGroups();
	
	function selectColor(code: string) {
		editorState.update(state => ({ ...state, selectedColor: code }));
	}
</script>

<div class="color-picker">
	<h3>Colors</h3>
	
	<div class="color-section">
		<span class="section-label">Basic</span>
		<div class="color-grid">
			{#each colorGroups.basic as color}
				<button
					class="color-swatch"
					class:selected={selectedColor === color.code}
					style="--color: {color.hex}"
					onclick={() => selectColor(color.code)}
					title={color.name}
				>
					<span class="swatch-inner"></span>
					{#if selectedColor === color.code}
						<span class="check">✓</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>
	
	<div class="color-section">
		<span class="section-label">Metallic</span>
		<div class="color-grid">
			{#each colorGroups.metallic as color}
				<button
					class="color-swatch metallic"
					class:selected={selectedColor === color.code}
					style="--color: {color.hex}"
					onclick={() => selectColor(color.code)}
					title={color.name}
				>
					<span class="swatch-inner"></span>
					{#if selectedColor === color.code}
						<span class="check">✓</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>
	
	<div class="selected-info">
		{#each BEAD_COLORS as color}
			{#if color.code === selectedColor}
				<div class="info-row">
					<span class="preview" style="background: {color.hex}"></span>
					<span class="name">{color.name}</span>
					<span class="code">({color.code})</span>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.color-picker {
		padding: 16px;
	}
	
	h3 {
		margin: 0 0 16px 0;
		font-size: 14px;
		font-weight: 600;
		color: #f4f4f5;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.color-section {
		margin-bottom: 16px;
	}
	
	.section-label {
		display: block;
		font-size: 11px;
		color: #71717a;
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.color-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
	}
	
	.color-swatch {
		aspect-ratio: 1;
		border-radius: 8px;
		border: 2px solid transparent;
		padding: 3px;
		background: rgba(255, 255, 255, 0.05);
		cursor: pointer;
		position: relative;
		transition: all 0.15s;
	}
	
	.color-swatch:hover {
		transform: scale(1.1);
		z-index: 1;
	}
	
	.color-swatch.selected {
		border-color: #6366f1;
		box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
	}
	
	.swatch-inner {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 5px;
		background: var(--color);
	}
	
	.metallic .swatch-inner {
		background: linear-gradient(
			135deg, 
			var(--color) 0%, 
			color-mix(in srgb, var(--color), white 40%) 50%, 
			var(--color) 100%
		);
	}
	
	.check {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 12px;
		font-weight: bold;
		color: white;
		text-shadow: 0 1px 2px rgba(0,0,0,0.5);
	}
	
	.selected-info {
		margin-top: 16px;
		padding: 12px;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.info-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	
	.preview {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		flex-shrink: 0;
	}
	
	.name {
		font-size: 14px;
		color: #f4f4f5;
		flex: 1;
	}
	
	.code {
		font-size: 12px;
		color: #71717a;
		font-family: monospace;
	}
</style>

