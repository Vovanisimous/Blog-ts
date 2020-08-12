import { IUser } from "./user";

export interface IAppContext {
    auth: boolean;
    user?: IUser;

    updateUser(user: Partial<IUser>): Promise<void>;
}
