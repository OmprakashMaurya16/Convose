import React from "react";
import { LoaderIcon } from "react-hot-toast";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <span className="loading loading-spinner loading-xl text-primary"></span>
    </div>
  );
};

export default PageLoader;
