import multer from "multer";
// multer is a nodejs middleware for handling multipart/form-data, which is primarily used for uploading files.
const storage = multer.memoryStorage();

const uploadFile = multer({ storage }).single("file");

export default uploadFile;
