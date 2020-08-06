import fileType from 'file-type';
import {get, head, last} from 'lodash';

export function dataURLtoFile(dataurl: string, filename: string): File {
    const type = head(dataurl.split(','));
    const src = last(dataurl.split(','));

    const mime = last(type!.match(/:(.*?);/));
    const byteString = atob(src!);
    let n = byteString.length;
    const u8arr = new Uint8Array(n);
    while (n) {
        u8arr[n - 1] = byteString.charCodeAt(n - 1);
        n -= 1; // to make eslint happy
    }
    const blob = new Blob([u8arr], {type: mime});
    const file = new File([blob], filename, {type: mime});
    return file;
}

export function getExtension(resolve: (ext: string) => void, file: File): void {
    const reader = new FileReader();
    if (!file) {
        return;
    }
    reader.readAsArrayBuffer(file);
    (reader.onloadend = () => {
        const result = reader.result as ArrayBuffer;
        const ext = get(fileType(result), 'ext', '');
        resolve(ext);
    });
}

export function getUnsafeExtension(file: File): string {
    return (last(file.name.split('.')) || '').toLowerCase();
}
