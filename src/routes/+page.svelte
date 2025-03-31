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

<div class="min-h-screen bg-gray-50 p-4">
    <div class="container mx-auto max-w-lg">
        <h1 class="text-3xl font-bold mb-4 text-center">Draw Steel Initiative</h1>
        
        <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 class="text-xl font-semibold text-center">Round {$currentRound}</h2>
        </div>
        
        <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-2 mb-6">
            <input
                type="text"
                bind:value={newName}
                placeholder="Character name"
                class="flex-1 p-3 border rounded-lg text-lg"
            />
            <select 
                bind:value={selectedType}
                class="p-3 border rounded-lg bg-white text-lg"
            >
                <option value="hero">Hero</option>
                <option value="villain">Villain</option>
            </select>
            <button 
                type="submit"
                class="bg-blue-500 text-white p-3 rounded-lg text-lg font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors"
            >
                Add
            </button>
        </form>
        
        <div class="space-y-3">
            {#each $characters as character (character.id)}
                <div class={`p-6 rounded-lg shadow-sm transition-all ${
                    character.type === 'hero' 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-red-50 border-red-200'
                } ${character.hasTakenTurn ? 'opacity-60' : 'opacity-100'} border-2`}>
                    <div class="flex items-center justify-between">
                        <span class={`text-xl font-medium ${
                            character.type === 'hero' ? 'text-blue-800' : 'text-red-800'
                        }`}>
                            {character.name}
                        </span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                class="sr-only peer"
                                checked={character.hasTakenTurn}
                                on:change={() => characterStore.toggleTurn(character.id)}
                            />
                            <div class={`w-11 h-6 rounded-full peer 
                                ${character.type === 'hero' 
                                    ? 'bg-blue-200 peer-checked:bg-blue-600' 
                                    : 'bg-red-200 peer-checked:bg-red-600'
                                } 
                                peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-blue-300 
                                after:content-[''] 
                                after:absolute 
                                after:top-[2px] 
                                after:left-[2px] 
                                after:bg-white 
                                after:border-gray-300 
                                after:border 
                                after:rounded-full 
                                after:h-5 
                                after:w-5 
                                after:transition-all 
                                peer-checked:after:translate-x-full`}>
                            </div>
                        </label>
                    </div>
                </div>
            {/each}
        </div>
        
        {#if $characters.length > 0}
            <button
                on:click={characterStore.nextRound}
                class="w-full mt-6 bg-purple-500 text-white p-4 rounded-lg text-lg font-medium hover:bg-purple-600 active:bg-purple-700 transition-colors"
            >
                Next Round
            </button>
        {/if}
    </div>
</div>