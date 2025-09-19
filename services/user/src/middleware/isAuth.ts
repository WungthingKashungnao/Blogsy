import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { IUser } from "../model/User.js";

// defining the interface of the request for isAuth function
export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization; //getting the authorization header which stores the metadata of the token
    // checks if there is header and checks wheter if its a bearer token which is commonly used for jwt authentication
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please Login - No auth header",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    // verifying token
    const decodedValue = jwt.verify(
      token as string,
      process.env.JWT_SEC as string
    ) as JwtPayload;

    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    req.user = decodedValue.user;
    next();
  } catch (error: any) {
    console.log("JWT verification error: ", error);
    res.status(500).json({
      message: "Please Login - JWT error",
    });
  }
};
