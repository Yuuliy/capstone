// ** Lib
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "../configs/firebase.js";
import mongoose from "mongoose";

const firebaseHelper = {
    /**
   *
   * @param {String} productCode
   * @param {File[]} files
   * @returns {Promise<String[]>}
   */
    uploadToStorage: async (productCode, files = []) => {
        const datas = await Promise.all(
            files.map(async (file) => {
                const imageId = new mongoose.Types.ObjectId().toString();
                let folder = `${productCode}/${imageId}`;
                const fileRef = ref(
                    storage,
                    folder
                );
                return {
                    data: await uploadBytes(fileRef, file.buffer, {
                        contentType: file?.mimetype || "image/jpeg",
                    }),
                    imageId
                };
            })
        );

        const urls = await Promise.all(
            datas.map(async (data) => ({ url: await getDownloadURL(data.data.ref), id: data.imageId }))
        );

        return urls;
    },

    /**
         * Thay thế một tệp trong Firebase Storage
         * @param {String} productCode
         * @param {String[]} imageIds
         * @returns {Promise<void>}
         */
    deleteFile: async (productCode , imageIds = [] ) => {
        for (const imageId of imageIds) {
            const filePath = `${productCode}/${imageId}`;
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
        }
    },
}

export default firebaseHelper;