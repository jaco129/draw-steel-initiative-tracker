import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library
import type { Character } from '../types';

export const characters = writable<Character[]>([
    { id: uuidv4(), name: 'Hero 1', type: 'hero', hasTakenTurn: false },
    { id: uuidv4(), name: 'Hero 2', type: 'hero', hasTakenTurn: false },
    { id: uuidv4(), name: 'Hero 3', type: 'hero', hasTakenTurn: false },
    { id: uuidv4(), name: 'Villain 1', type: 'villain', hasTakenTurn: false },
    { id: uuidv4(), name: 'Villain 2', type: 'villain', hasTakenTurn: false },
    { id: uuidv4(), name: 'Villain 3', type: 'villain', hasTakenTurn: false }
]);
export const currentRound = writable<number>(1);

export const characterStore = {
    add: (name: string, type: CharacterType) => {
        characters.update(chars => [...chars, {
            id: uuidv4(), // Use uuidv4 instead of crypto.randomUUID
            name,
            type,
            hasTakenTurn: false
        }]);
    },
    
    toggleTurn: (id: string) => {
        characters.update(chars => {
            let toggledType: CharacterType | null = null;

            const updatedChars = chars.map(char => {
                if (char.id === id) {
                    toggledType = char.type;
                    return { ...char, hasTakenTurn: !char.hasTakenTurn };
                }
                return char;
            });

            // Resort characters based on the toggled character's type
            return updatedChars.sort((a, b) => {
                if (a.hasTakenTurn !== b.hasTakenTurn) {
                    return a.hasTakenTurn ? 1 : -1; // Characters that haven't gone come first
                }
                if (toggledType && a.type !== b.type) {
                    return a.type === toggledType ? 1 : -1; // Opposite type comes first
                }
                return 0; // No further sorting within the same type
            });
        });
    },
    
    nextRound: () => {
        characters.update(chars => 
            chars.map(char => ({ ...char, hasTakenTurn: false }))
        );
        currentRound.update(round => round + 1);
    },
    
    remove: (id: string) => {
        characters.update(chars => chars.filter(char => char.id !== id));
    }
};