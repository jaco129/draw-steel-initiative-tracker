<script lang="ts">
    import { characters, currentRound, characterStore } from '$lib/stores/characterStore';
    import { base } from '$app/paths'; // Import base from $app/paths

    let newName = '';
    let isHero = true; // New variable to track toggle state
    $: selectedType = isHero ? 'hero' : 'villain'; // Derive character type from toggle
    let firstTurn = '--'; // Default to heroes going first
    let rolledValue: number | null = null; // Store the rolled value
    let numberOfCharacters = 1; // New variable to track the selected number of characters to add

    function handleSubmit() {
        if (newName.trim()) {
            for (let i = 0; i < numberOfCharacters; i++) {
                characterStore.add(`${newName}${numberOfCharacters > 1 ? ` ${i + 1}` : ''}`, selectedType);
            }
            newName = '';
            numberOfCharacters = 1; // Reset the selector to 1
        }
    }

    function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this character?')) {
            characterStore.remove(id);
        }
    }

    function determineFirstTurn() {
        rolledValue = Math.floor(Math.random() * 10) + 1; // Generate a number between 1 and 10
        firstTurn = rolledValue >= 6 ? 'Heroes' : 'Villains';
    }

    function handleReset() {
        if (confirm('Are you sure you want to reset the encounter? This will remove all characters and reset the round counter.')) {
            characterStore.reset();
            firstTurn = '--';
            rolledValue = null;
        }
    }

    $: safeCharacters = Array.isArray($characters) ? $characters : []; // Ensure $characters is always an array
</script>

<div class="min-h-screen bg-gray-900 text-gray-100 p-4">
    <div class="container mx-auto max-w-lg">
        <h1 class="text-3xl font-bold mb-4 text-center">Draw Steel Initiative</h1>
        
        <div class="bg-gray-800 p-4 rounded-lg shadow-sm mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold">Round {$currentRound}</h2>
            <button 
                on:click={determineFirstTurn}
                class="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 active:bg-green-700 transition-colors"
            >
                Roll Initiative (1d10): {rolledValue ?? '--'}
            </button>
        </div>
        
        {#if rolledValue !== null}
            <p class="text-center text-lg font-medium mb-4">{firstTurn} act first!</p>
        {/if}
        
        <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-2 mb-6">
            <div class="flex gap-2 items-center">
                <input
                    type="text"
                    bind:value={newName}
                    placeholder="Character name"
                    class="flex-1 p-3 border border-gray-700 bg-gray-800 rounded-lg text-lg text-gray-100 placeholder-gray-400"
                />
                <div class="flex items-center gap-2 p-3 border border-gray-700 bg-gray-800 rounded-lg shrink-0">
                    <span class="text-lg text-gray-100 w-16 hidden sm:inline">{isHero ? 'Hero' : 'Villain'}</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            class="sr-only peer"
                            bind:checked={isHero}
                        />
                        <div class="w-11 h-6 rounded-full peer 
                            bg-red-400 peer-checked:bg-blue-400
                            peer-focus:outline-none peer-focus:ring-4 
                            peer-focus:ring-gray-700 
                            after:content-[''] 
                            after:absolute 
                            after:top-[2px] 
                            after:left-[2px] 
                            after:bg-gray-800 
                            after:border-gray-600 
                            after:border 
                            after:rounded-full 
                            after:h-5 
                            after:w-5 
                            after:transition-all 
                            peer-checked:after:translate-x-full">
                        </div>
                    </label>
                </div>
            </div>
            <div class="flex gap-2 items-center">
                <label for="numberOfCharacters" class="text-gray-100 text-lg">#</label>
                <select
                    id="numberOfCharacters"
                    bind:value={numberOfCharacters}
                    class="p-3 border border-gray-700 bg-gray-800 rounded-lg text-lg text-gray-100"
                >
                    {#each Array.from({ length: 10 }, (_, i) => i + 1) as num}
                        <option value={num}>{num}</option>
                    {/each}
                </select>
                <button 
                    type="submit"
                    class="bg-blue-500 text-white p-3 rounded-lg text-lg font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors flex-grow"
                >
                    Add
                </button>
            </div>
        </form>
        
        {#if safeCharacters.length > 0}
            <div class="space-y-3">
                {#each safeCharacters as character (character.id)}
                    <div class={`p-6 rounded-lg shadow-sm transition-all ${
                        character.type === 'hero' 
                            ? 'bg-gray-600 border-blue-500' 
                            : 'bg-gray-600 border-red-500'
                    } ${character.hasTakenTurn ? 'opacity-60' : 'opacity-100'} border-2`}>
                        <div class="flex items-center justify-between">
                            <span class={`text-xl font-medium ${
                                character.type === 'hero' ? 'text-blue-300' : 'text-red-300'
                            }`}>
                                {character.name}
                            </span>
                            <div class="flex items-center gap-2">
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        class="sr-only peer"
                                        checked={character.hasTakenTurn}
                                        on:change={() => characterStore.toggleTurn(character.id)}
                                    />
                                    <div class={`w-11 h-6 rounded-full peer 
                                        ${character.type === 'hero' 
                                            ? 'bg-blue-400 peer-checked:bg-blue-100' 
                                            : 'bg-red-400 peer-checked:bg-red-100'
                                        } 
                                        peer-focus:outline-none peer-focus:ring-4 
                                        peer-focus:ring-gray-700 
                                        after:content-[''] 
                                        after:absolute 
                                        after:top-[2px] 
                                        after:left-[2px] 
                                        after:bg-gray-800 
                                        after:border-gray-600 
                                        after:border 
                                        after:rounded-full 
                                        after:h-5 
                                        after:w-5 
                                        after:transition-all 
                                        peer-checked:after:translate-x-full`}>
                                    </div>
                                </label>
                                <button
                                    on:click={() => handleDelete(character.id)}
                                    class="w-8 h-8 flex items-center justify-center ml-8"
                                    title="Delete character"
                                >
                                    <img 
                                        src="{base}/trash.png" 
                                        alt="Delete" 
                                        class="w-full h-full object-contain opacity-60 filter grayscale"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
            
            <button
                on:click={characterStore.nextRound}
                class="w-full mt-6 bg-purple-600 text-white p-4 rounded-lg text-lg font-medium hover:bg-purple-700 active:bg-purple-800 transition-colors"
            >
                Next Round
            </button>
        {/if}
        {#if safeCharacters.length === 0}
            <p class="text-center text-gray-400 mt-4">No characters available. Add some to get started!</p>
        {/if}

        <button
            on:click={handleReset}
            class="w-full mt-6 bg-red-600 text-white p-2 rounded-lg text-sm font-medium hover:bg-red-700 active:bg-red-800 transition-colors"
        >
            Reset Encounter
        </button>
    </div>
</div>