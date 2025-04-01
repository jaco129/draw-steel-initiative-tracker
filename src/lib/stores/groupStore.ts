import { writable } from 'svelte/store';
import type { Character, CharacterType } from '../types';

export interface Group {
    id: string;
    hasTakenTurn: boolean;
    characters: Character[];
}

export const groups = writable<Group[]>([]);

export const groupStore = {
    addCharacter: (character: Character) => {
        groups.update((currentGroups) => [
            ...currentGroups,
            {
                id: crypto.randomUUID(),
                hasTakenTurn: false,
                characters: [character],
            },
        ]);
    },
    combineGroups: (groupIds: string[]) => {
        groups.update((currentGroups) => {
            const combinedGroup = {
                id: crypto.randomUUID(),
                hasTakenTurn: false,
                characters: currentGroups
                    .filter((group) => groupIds.includes(group.id))
                    .flatMap((group) => group.characters),
            };
            return [
                ...currentGroups.filter((group) => !groupIds.includes(group.id)),
                combinedGroup,
            ];
        });
    },
    toggleGroupTurn: (groupId: string) => {
        groups.update((currentGroups) =>
            currentGroups.map((group) =>
                group.id === groupId
                    ? { ...group, hasTakenTurn: !group.hasTakenTurn }
                    : group
            )
        );
    },
    reset: () => {
        groups.set([]);
    },
};