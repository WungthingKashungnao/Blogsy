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
import { useAppData, user_service, User } from "../context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";

const LoginPage = () => {
  const { loading, isAuth, setLoading, setIsAuth, setUser } = useAppData();

  if (isAuth) return redirect("/");

  interface GoogleAuthCodeResponse {
    code: string;
  }
  interface LoginResponse {
    message: string;
    token: string;
    user: Record<string, unknown>;
  }

  // function called when google login sucess
  // authResult: is an argument passed from our google account, when we click login
  const responseGoogle = async (authResult: GoogleAuthCodeResponse) => {
    setLoading(true);
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
      setIsAuth(true);
      setLoading(false);

      // Explicitly map and type check user fields for User type
      const u = result.data.user;
      const userData = {
        _id: u._id as string,
        name: u.name as string,
        email: u.email as string,
        image: u.image as string,
      } as User;

      setUser(userData);
      toast.success(result.data.message);
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
      toast.error("Problem while login");
    }
  };

  // function called when google login error
  const onError = (errorResponse: {
    error?: string;
    error_description?: string;
    error_uri?: string;
  }) => {
    setLoading(false);
    console.error("Google login error", errorResponse);
    toast.error("Problem while login");
  };

  // function to call login succes or error
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: onError,
    flow: "auth-code",
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
};

export default LoginPage;
