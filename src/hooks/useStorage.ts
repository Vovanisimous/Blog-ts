import { useFirebase } from "./useFirebase";

interface IFirebaseStorage<T> {
    getDownloadURL(avatarName: string): Promise<any>;
}

export const useStorage = <T>(): IFirebaseStorage<T> => {
    const { storage } = useFirebase();

    const getDownloadURL = (avatarName:string) => {
        return storage().ref(avatarName).getDownloadURL()
    }

    return {
        getDownloadURL
    }
}