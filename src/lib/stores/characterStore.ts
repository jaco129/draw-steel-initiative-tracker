import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type { Character, CharacterType } from '../types';

// Default initial state
const defaultCharacters = [
    { id: uuidv4(), name: 'Hero 1', type: 'hero', hasTakenTurn: false },
    { id: uuidv4(), name: 'Hero 2', type: 'hero', hasTakenTurn: false },
    { id: uuidv4(), name: 'Hero 3', type: 'hero', hasTakenTurn: false },
    { id: uuidv4(), name: 'Villain 1', type: 'villain', hasTakenTurn: false },
    { id: uuidv4(), name: 'Villain 2', type: 'villain', hasTakenTurn: false },
    { id: uuidv4(), name: 'Villain 3', type: 'villain', hasTakenTurn: false }
];

// Function to safely get stored data
const getStoredData = () => {
    if (typeof window === 'undefined') {
        return {
            characters: process.env.NODE_ENV === 'production' ? [] : defaultCharacters, // Use empty array in production
            round: 1
        };
    }

    const storedCharacters = window.localStorage.getItem('characters');
    const storedRound = window.localStorage.getItem('currentRound');

    return {
        characters: storedCharacters ? JSON.parse(storedCharacters) : (process.env.NODE_ENV === 'production' ? [] : defaultCharacters),
        round: storedRound ? parseInt(storedRound) : 1
    };
};

const { characters: initialCharacters, round: initialRound } = getStoredData();

export const characters = writable<Character[]>(initialCharacters);
export const currentRound = writable<number>(initialRound);

// Only subscribe to changes in the browser
if (typeof window !== 'undefined') {
    characters.subscribe(value => {
        window.localStorage.setItem('characters', JSON.stringify(value));
    });

    currentRound.subscribe(value => {
        window.localStorage.setItem('currentRound', value.toString());
    });
}

export const characterStore = {
    add: (name: string, type: CharacterType) => {
        characters.update(chars => [{
            id: uuidv4(), // Use uuidv4 instead of crypto.randomUUID
            name,
            type,
            hasTakenTurn: false
        }, ...chars]); // Prepend the new character to the array
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
    },
    
    reset: () => {
        characters.set([]);
        currentRound.set(1);
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('characters');
            window.localStorage.removeItem('currentRound');
        }
    }
};