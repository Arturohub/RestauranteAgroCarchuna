export interface dish {
    id: number;
    name: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    image?: string;
    alergenos: string;
}

export interface Menu {
    id: number;
    date: string;
    dishes: dish[];
}

export interface MenuOfDay {
    id: number;
    date: string;
    dishes: dish[];
}