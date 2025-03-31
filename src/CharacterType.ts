export type CharacterType = 'hero' | 'villain';

export interface Character {
    id: string;
    name: string;
    type: CharacterType;
    hasTakenTurn: boolean;
}