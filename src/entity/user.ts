export interface IUser {
    id: string;
    login: string;
    email: string;
    avatar?: string | null;
}

export interface IUserAt {
    id: string;
    login: string;
    email: string;
    avatar?: string | null;
    createdAt: string;
}
