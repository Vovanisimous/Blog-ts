import { Dispatch, SetStateAction, useState } from "react";
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { dataURLtoFile, getExtension, getUnsafeExtension } from "../utils";

export interface IFileServiceParams {
    maxFileSize: number;
    whiteList: string[];
}

export function useFile(
    params: IFileServiceParams,
): {
    file?: File;
    src?: string | null;
    setSrc: Dispatch<SetStateAction<string | undefined | null>>;
    getError?: (file: File) => Promise<undefined | string>;
    setError: Dispatch<SetStateAction<string | undefined>>;
    loadFile: (file: File) => Promise<void>;
    deleteFile: () => void;
    error: string | undefined;
} {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [src, setSrc] = useState<string | undefined | null>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const loadFile = async (f: File) => {
        if (!!(await getError(f))) {
            setError(await getError(f));
            return;
        }
        setError(undefined);
        const reader = new FileReader();
        reader.readAsDataURL(f);
        fromEvent(reader, "loadend").subscribe(async () => {
            try {
                setSrc(reader.result as string);
                setFile(dataURLtoFile(reader.result as string, f.name));
            } catch (error) {
                // Nothing here
            }
        });
    };

    const getError = async (file: File): Promise<string | undefined> => {
        if (file.size > params.maxFileSize) {
            return `Upload the file less than ${params.maxFileSize / (1024 * 1024)} MB.`;
        }
        const ext = await new Promise((resolve: (ext: string) => void) =>
            getExtension(resolve, file),
        );
        if (params.whiteList.indexOf(ext) < 0) {
            return `The file type does not match the extension. Available extensions: ${params.whiteList.join(
                ", ",
            )}`;
        }
        if (getUnsafeExtension(file) !== ext) {
            return "The file type does not match the extension. Please, try again.";
        }
        return undefined;
    };

    const deleteFile = () => {
        setSrc(undefined);
        setFile(undefined);
        setError(undefined);
    };

    return { file, src, getError, loadFile, deleteFile, setSrc, setError, error };
}
