export interface IApiPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface IApiComment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

