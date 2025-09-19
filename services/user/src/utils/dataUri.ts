// This code converts a file received from multer (which contains the file buffer in memory) into a Data URI string format
// A Data URI (Uniform Resource Identifier) is a scheme that allows data to be embedded directly into web documents (like HTML or CSS) as a string of characters,
import DataURIParser from "datauri/parser.js";
import path from "path";

const getBuffer = (file: any) => {
  const parser = new DataURIParser();

  const extName = path.extname(file.originalname).toString();

  return parser.format(extName, file.buffer);
};

export default getBuffer;
