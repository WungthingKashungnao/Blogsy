// import React from "react";

// // const Loading = () => {
// //   return (
// //     <div className="w-[200px] m-auto mt-[400px]">
// //       <p className="text-2xl text-blue-500 font-bold text-center">Loading...</p>
// //     </div>
// //   );
// // };

// export default Loading;

"use client";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
const Loading = () => {
  return (
    <div className="w-[200px] m-auto mt-[400px] flex justify-center items-center">
      <Spinner className="text-gray-600" size={64} variant="bars" />
    </div>
  );
};
export default Loading;
