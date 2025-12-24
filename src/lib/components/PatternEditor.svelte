<script lang="ts">
	import { currentPattern, editorState } from '$lib/stores/pattern';
	import { getHexByCode, BEAD_COLORS } from '$lib/data/colors';
	import type { BeadPattern, BeadRow, Bead } from '$lib/data/schema';
	
	let pattern = $state<BeadPattern | null>(null);
	let selectedColor = $state('P');
	let tool = $state<'paint' | 'erase' | 'select'>('paint');
	let isDragging = $state(false);
	
	$effect(() => {
		const unsub = currentPattern.subscribe(p => {
			pattern = p;
		});
		return unsub;
	});
	
	$effect(() => {
		const unsub = editorState.subscribe(state => {
			selectedColor = state.selectedColor;
			tool = state.tool;
		});
		return unsub;
	});
	
	function generateId(): string {
		return Math.random().toString(36).substring(2, 9);
	}
	
	function addRow() {
		if (!pattern) return;
		
		const newRow: BeadRow = {
			id: generateId(),
			beads: [],
			rowType: 'single'
		};
		
		pattern = {
			...pattern,
			rows: [...pattern.rows, newRow]
		};
		currentPattern.set(pattern);
	}
	
	function removeRow(rowIndex: number) {
		if (!pattern) return;
		
		pattern = {
			...pattern,
			rows: pattern.rows.filter((_, i) => i !== rowIndex)
		};
		currentPattern.set(pattern);
	}
	
	function addBeadToRow(rowIndex: number) {
		if (!pattern) return;
		
		const newBead: Bead = {
			id: generateId(),
			colorCode: selectedColor
		};
		
		const newRows = [...pattern.rows];
		newRows[rowIndex] = {
			...newRows[rowIndex],
			beads: [...newRows[rowIndex].beads, newBead]
		};
		
		pattern = { ...pattern, rows: newRows };
		currentPattern.set(pattern);
	}
	
	function removeBeadFromRow(rowIndex: number) {
		if (!pattern || pattern.rows[rowIndex].beads.length === 0) return;
		
		const newRows = [...pattern.rows];
		newRows[rowIndex] = {
			...newRows[rowIndex],
			beads: newRows[rowIndex].beads.slice(0, -1)
		};
		
		pattern = { ...pattern, rows: newRows };
		currentPattern.set(pattern);
	}
	
	function handleBeadClick(rowIndex: number, beadIndex: number) {
		if (!pattern) return;
		
		if (tool === 'paint') {
			paintBead(rowIndex, beadIndex);
		} else if (tool === 'erase') {
			eraseBead(rowIndex, beadIndex);
		}
	}
	
	function paintBead(rowIndex: number, beadIndex: number) {
		if (!pattern) return;
		
		const newRows = [...pattern.rows];
		const newBeads = [...newRows[rowIndex].beads];
		newBeads[beadIndex] = {
			...newBeads[beadIndex],
			colorCode: selectedColor
		};
		newRows[rowIndex] = { ...newRows[rowIndex], beads: newBeads };
		
		pattern = { ...pattern, rows: newRows };
		currentPattern.set(pattern);
	}
	
	function eraseBead(rowIndex: number, beadIndex: number) {
		if (!pattern) return;
		
		const newRows = [...pattern.rows];
		newRows[rowIndex] = {
			...newRows[rowIndex],
			beads: newRows[rowIndex].beads.filter((_, i) => i !== beadIndex)
		};
		
		pattern = { ...pattern, rows: newRows };
		currentPattern.set(pattern);
	}
	
	function handleMouseDown() {
		isDragging = true;
	}
	
	function handleMouseUp() {
		isDragging = false;
	}
	
	function handleMouseEnter(rowIndex: number, beadIndex: number) {
		if (isDragging && tool === 'paint') {
			paintBead(rowIndex, beadIndex);
		}
	}
	
	function setTool(newTool: 'paint' | 'erase' | 'select') {
		editorState.update(state => ({ ...state, tool: newTool }));
	}
	
	function updatePatternName(e: Event) {
		if (!pattern) return;
		const target = e.target as HTMLInputElement;
		pattern = { ...pattern, name: target.value };
		currentPattern.set(pattern);
	}
	
	function createNewPattern() {
		const newPattern: BeadPattern = {
			id: generateId(),
			name: 'New Pattern',
			rows: [
				{ id: generateId(), beads: [], rowType: 'single' }
			],
			colorPalette: BEAD_COLORS.map(c => c.code)
		};
		currentPattern.set(newPattern);
	}
	
	// Calculate max beads for grid alignment
	$effect(() => {
		if (pattern) {
			// Just trigger re-render when pattern changes
		}
	});
</script>

<div class="pattern-editor" role="application" onmouseup={handleMouseUp}>
	{#if !pattern}
		<div class="empty-state">
			<div class="empty-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<circle cx="12" cy="12" r="10"/>
					<path d="M12 8v8m-4-4h8"/>
				</svg>
			</div>
			<h3>No Pattern Selected</h3>
			<p>Create a new pattern or select one from the library</p>
			<button class="primary-btn" onclick={createNewPattern}>
				Create New Pattern
			</button>
		</div>
	{:else}
		<div class="editor-header">
			<input 
				type="text" 
				class="pattern-name"
				value={pattern.name}
				oninput={updatePatternName}
				placeholder="Pattern Name"
			/>
			<div class="tool-buttons">
				<button 
					class:active={tool === 'paint'}
					onclick={() => setTool('paint')}
					title="Paint Tool"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/>
						<path d="m9 15 3-3 3 3"/>
					</svg>
				</button>
				<button 
					class:active={tool === 'erase'}
					onclick={() => setTool('erase')}
					title="Erase Tool"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
						<path d="M22 21H7"/>
						<path d="m5 11 9 9"/>
					</svg>
				</button>
			</div>
		</div>
		
		<div class="grid-container">
			{#each pattern.rows as row, rowIndex}
				<div class="row-wrapper">
					<div class="row-controls left">
						<span class="row-number">{rowIndex + 1}</span>
					</div>
					
					<div class="bead-row">
						{#each row.beads as bead, beadIndex}
							<button
								class="bead"
								style="--bead-color: {getHexByCode(bead.colorCode)}"
								onmousedown={handleMouseDown}
								onmouseenter={() => handleMouseEnter(rowIndex, beadIndex)}
								onclick={() => handleBeadClick(rowIndex, beadIndex)}
								aria-label="Bead {beadIndex + 1} - {bead.colorCode}"
							>
								<span class="bead-inner"></span>
							</button>
						{/each}
						
						<!-- Add/remove bead buttons -->
						<button class="bead-control add" onclick={() => addBeadToRow(rowIndex)} title="Add Bead">
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M12 5v14m-7-7h14"/>
							</svg>
						</button>
						{#if row.beads.length > 0}
							<button class="bead-control remove" onclick={() => removeBeadFromRow(rowIndex)} title="Remove Bead">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M5 12h14"/>
								</svg>
							</button>
						{/if}
					</div>
					
					<div class="row-controls right">
						<button class="row-delete" onclick={() => removeRow(rowIndex)} title="Delete Row">
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M18 6 6 18M6 6l12 12"/>
							</svg>
						</button>
					</div>
				</div>
			{/each}
			
			<!-- Add row button -->
			<button class="add-row-btn" onclick={addRow}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 5v14m-7-7h14"/>
				</svg>
				Add Row
			</button>
		</div>
		
		<div class="editor-stats">
			<span>{pattern.rows.length} rows</span>
			<span>•</span>
			<span>{pattern.rows.reduce((sum, row) => sum + row.beads.length, 0)} beads</span>
		</div>
	{/if}
</div>

<style>
	.pattern-editor {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 16px;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		text-align: center;
		color: #71717a;
	}
	
	.empty-icon {
		margin-bottom: 16px;
		opacity: 0.5;
	}
	
	.empty-state h3 {
		margin: 0 0 8px 0;
		font-size: 18px;
		color: #a1a1aa;
	}
	
	.empty-state p {
		margin: 0 0 20px 0;
		font-size: 14px;
	}
	
	.primary-btn {
		padding: 10px 20px;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		border: none;
		border-radius: 8px;
		color: white;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.primary-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
	}
	
	.editor-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}
	
	.pattern-name {
		flex: 1;
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #f4f4f5;
		font-size: 16px;
		font-weight: 500;
	}
	
	.pattern-name:focus {
		outline: none;
		border-color: #6366f1;
	}
	
	.tool-buttons {
		display: flex;
		gap: 4px;
		padding: 4px;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
	}
	
	.tool-buttons button {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: #71717a;
		cursor: pointer;
		transition: all 0.15s;
	}
	
	.tool-buttons button:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #f4f4f5;
	}
	
	.tool-buttons button.active {
		background: rgba(99, 102, 241, 0.3);
		color: #818cf8;
	}
	
	.grid-container {
		flex: 1;
		overflow-y: auto;
		padding: 8px 0;
	}
	
	.row-wrapper {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
		padding: 4px 0;
	}
	
	.row-controls {
		display: flex;
		align-items: center;
		min-width: 32px;
	}
	
	.row-controls.left {
		justify-content: flex-end;
	}
	
	.row-number {
		font-size: 11px;
		color: #52525b;
		font-family: monospace;
	}
	
	.row-delete {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 4px;
		color: #52525b;
		cursor: pointer;
		opacity: 0;
		transition: all 0.15s;
	}
	
	.row-wrapper:hover .row-delete {
		opacity: 1;
	}
	
	.row-delete:hover {
		background: rgba(239, 68, 68, 0.2);
		color: #ef4444;
	}
	
	.bead-row {
		display: flex;
		align-items: center;
		gap: 4px;
		min-height: 36px;
		padding: 4px 8px;
		background: rgba(255, 255, 255, 0.02);
		border-radius: 8px;
		flex-wrap: wrap;
	}
	
	.bead {
		width: 32px;
		height: 32px;
		padding: 2px;
		background: rgba(0, 0, 0, 0.3);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.15s;
	}
	
	.bead:hover {
		transform: scale(1.1);
		border-color: rgba(255, 255, 255, 0.3);
	}
	
	.bead-inner {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: var(--bead-color);
		box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2),
					inset 0 -2px 4px rgba(0, 0, 0, 0.3);
	}
	
	.bead-control {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px dashed rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		color: #52525b;
		cursor: pointer;
		transition: all 0.15s;
	}
	
	.bead-control:hover {
		border-color: #6366f1;
		color: #6366f1;
		background: rgba(99, 102, 241, 0.1);
	}
	
	.bead-control.remove:hover {
		border-color: #ef4444;
		color: #ef4444;
		background: rgba(239, 68, 68, 0.1);
	}
	
	.add-row-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		padding: 12px;
		margin-top: 8px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px dashed rgba(255, 255, 255, 0.15);
		border-radius: 8px;
		color: #71717a;
		font-size: 13px;
		cursor: pointer;
		transition: all 0.15s;
	}
	
	.add-row-btn:hover {
		background: rgba(99, 102, 241, 0.1);
		border-color: #6366f1;
		color: #818cf8;
	}
	
	.editor-stats {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-top: 12px;
		margin-top: auto;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		font-size: 12px;
		color: #52525b;
	}
</style>

