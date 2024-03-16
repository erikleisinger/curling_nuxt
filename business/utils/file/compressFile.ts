import imageCompression from "browser-image-compression";
export default async (file: File): Promise<Blob | undefined> => {
    const options = {
        maxSizeMB: 0.3,
        useWebWorker: true,
    };
    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.log(error);
    }
}