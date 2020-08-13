import { IUser } from "./user";

export interface IBasePost {
    id: string;
    name: string;
    text: string;
    createdAt: string;
}

export interface IServerPost extends IBasePost {
    userId: string;
}

export interface IPost extends IBasePost {
    user?: IUser;
}

export interface IComment {
    userId: string;
    createdAt: string;
    comment: string;
}