// This file defines TypeScript types and interfaces used throughout the application.

export interface Story {
    id: number;
    by: string;
    title: string;
    score: number;
    time: number;
    type: string;
    url?: string;
    kids?: number[];
}
export interface Leader {
    id: string;
    name: string; // Added name field
    about: string;
    created: number;
    karma: number;
    submitted: number[];
}
