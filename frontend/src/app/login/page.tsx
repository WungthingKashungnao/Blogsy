"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import axios from "axios";
import { user_service } from "../context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  interface GoogleAuthCodeResponse {
    code: string;
  }
  interface LoginResponse {
    message: string;
    token: string;
    user: Record<string, unknown>;
  }
  const responseGoogle = async (authResult: GoogleAuthCodeResponse) => {
    try {
      const result = await axios.post<LoginResponse>(
        `${user_service}/api/v1/login`,
        {
          code: authResult["code"],
        }
      );

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
      toast.success(result.data.message);
    } catch (error) {
      console.log("error: ", error);
      toast.error("Problem while login");
    }
  };

  const onError = (errorResponse: {
    error?: string;
    error_description?: string;
    error_uri?: string;
  }) => {
    console.error("Google login error", errorResponse);
    toast.error("Problem while login");
  };
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: onError,
    flow: "auth-code",
  });

  return (
    <div className="w-[350px] m-auto mt-[200px]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to Blogsy</CardTitle>
          <CardDescription>
            Your go to blog diary, the best of its kind, and explore other
            peoples mind
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={googleLogin}>
            Login with google{" "}
            <Image
              src={"/google.png"}
              width={32}
              height={32}
              className="w-7 h-7"
              alt="google icon"
            />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
