<script lang="ts">
    import { characters, currentRound, characterStore } from '$lib/stores';
    import type { CharacterType } from '$lib/types';
    
    let newName = '';
    let selectedType: CharacterType = 'hero';
    
    function handleSubmit() {
        if (newName.trim()) {
            characterStore.add(newName, selectedType);
            newName = '';
        }
    }
</script>

<div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-4">Draw Steel Initiative Tracker</h1>
    <div class="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 class="text-xl font-semibold">Round {$currentRound}</h2>
    </div>
    
    <form on:submit|preventDefault={handleSubmit} class="flex gap-2 mb-6">
        <input
            type="text"
            bind:value={newName}
            placeholder="Character name"
            class="flex-1 p-2 border rounded"
        />
        <select 
            bind:value={selectedType}
            class="p-2 border rounded bg-white"
        >
            <option value="hero">Hero</option>
            <option value="villain">Villain</option>
        </select>
        <button 
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Add
        </button>
    </form>
    
    <div class="space-y-2">
        {#each $characters as character (character.id)}
            <div class="flex items-center justify-between p-3 border rounded bg-white">
                <span class={character.type === 'hero' ? 'text-blue-600' : 'text-red-600'}>
                    {character.name}
                </span>
                <button
                    on:click={() => characterStore.toggleTurn(character.id)}
                    class={`px-3 py-1 rounded ${
                        character.hasTakenTurn 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200'
                    }`}
                >
                    {character.hasTakenTurn ? 'Done' : 'Waiting'}
                </button>
            </div>
        {/each}
    </div>
    
    {#if $characters.length > 0}
        <button
            on:click={characterStore.nextRound}
            class="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
            Next Round
        </button>
    {/if}
</div>