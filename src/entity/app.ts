import { IUser } from "./user";

export interface IAppContext {
    auth: boolean;
    user?: IUser;

    updateUser(user: Partial<IUser>): Promise<void>;

    updatePassword(newPassword: string): Promise<void>;

    reauthenticateWithCredential(credentials: firebase.auth.AuthCredential): Promise<void>;
}
