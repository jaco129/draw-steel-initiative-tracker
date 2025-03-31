import { writable } from 'svelte/store';
import type { Character } from './types';

export const characters = writable<Character[]>([]);
export const currentRound = writable<number>(1);

export const characterStore = {
    add: (name: string, type: CharacterType) => {
        characters.update(chars => [...chars, {
            id: crypto.randomUUID(),
            name,
            type,
            hasTakenTurn: false
        }]);
    },
    
    toggleTurn: (id: string) => {
        characters.update(chars => 
            chars.map(char => 
                char.id === id 
                    ? { ...char, hasTakenTurn: !char.hasTakenTurn }
                    : char
            )
        );
    },
    
    nextRound: () => {
        characters.update(chars => 
            chars.map(char => ({ ...char, hasTakenTurn: false }))
        );
        currentRound.update(round => round + 1);
    }
};