import { useFirebase } from "./useFirebase";

interface IFirebaseStorage<T> {
    getDownloadURL(avatarName: string): Promise<any>;
    getChildDownloadURL(avatarName: string): Promise<any>;
    put(data: Blob | Uint8Array | ArrayBuffer, avatarName: string): firebase.storage.UploadTask;
}

export const useStorage = <T>(): IFirebaseStorage<T> => {
    const { storage } = useFirebase();

    const getDownloadURL = (avatarName:string) => {
        return storage().ref(avatarName).getDownloadURL()
    }

    const getChildDownloadURL = (avatarName:string) => {
        return storage().ref().child(avatarName).getDownloadURL()
    }

    const put = (data: Blob | Uint8Array | ArrayBuffer, avatarName: string) => {
        return storage().ref().child(avatarName).put(data)
    }

    return {
        getDownloadURL,
        getChildDownloadURL,
        put
    }
}