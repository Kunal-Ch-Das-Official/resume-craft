import ResumeFieldSelector from "@/components/builder/ResumeFieldSelector";
import PageLoader from "@/components/utils/page-loader/PageLoader";
import React, { Suspense } from "react";

const ResumeSelector = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResumeFieldSelector />
    </Suspense>
  );
};

export default ResumeSelector;
