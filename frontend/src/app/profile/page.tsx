"use client";
import React, { useRef, useState } from "react";
import { useAppData, User, user_service } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/loading";

const ProfilePage = () => {
  const { user, setUser } = useAppData();
  const InputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const clickHandler = () => {
    InputRef.current?.click();
  };

  type UserProfileRes = Pick<User, "_id" | "name" | "email" | "image">;
  interface UpdatePicResponse {
    message: string;
    token: string;
    user: UserProfileRes;
  }

  const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.put<UpdatePicResponse>(
          `${user_service}/api/v1/user/update/pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data.message);
        setLoading(false);
        Cookies.set("token", data.token, {
          expires: 5,
          secure: true,
          path: "/",
        });
        setUser(data.user as User);
      } catch (error) {
        setLoading(false);
        console.log("error:", error);
        toast.error("Image update failed");
      }
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {loading ? (
        <Loading />
      ) : (
        <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer">
                <AvatarImage
                  src={user?.image}
                  alt="profile picture"
                  onClick={clickHandler}
                />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={InputRef}
                  onChange={changeHandler}
                />
              </Avatar>
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
