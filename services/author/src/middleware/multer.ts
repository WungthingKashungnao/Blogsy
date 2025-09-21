import multer from "multer";
// multer is a nodejs middleware for handling multipart/form-data, which is primarily used for uploading files.
const storage = multer.memoryStorage(); //memeoryStorage does not store the file locally but makes a temporary buffer of the file  as we are going to upload to cloudinary

const uploadFile = multer({ storage }).single("file");

export default uploadFile;
