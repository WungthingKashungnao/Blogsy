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

const LoginPage = () => {
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
          <Button className="w-full">
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
