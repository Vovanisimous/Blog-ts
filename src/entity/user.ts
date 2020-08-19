export interface IUser {
    id?: string;
    login: string;
    email: string;
    avatar?: string | null;
    createdAt?: string;
}

export interface IAvatar {
    avatar?: string | null;
    userId: string;
}

export interface IUserData {
    login: string;
    email: string;
    avatar?: string;
}

