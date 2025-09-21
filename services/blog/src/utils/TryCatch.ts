import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";

// util function to reuse trycatch logic
const TryCatch = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      console.log("Internal Server Error");
      res.status(500).json({
        message: error.message,
      });
    }
  };
};

export default TryCatch;
