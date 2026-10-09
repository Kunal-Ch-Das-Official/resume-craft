import ResumeFieldSelector from "@/components/builder/ResumeFieldSelector";
import React, { Suspense } from "react";

const ResumeSelector = () => {
  return (
    <Suspense fallback={<div>Loading selector...</div>}>
      <ResumeFieldSelector />
    </Suspense>
  );
};

export default ResumeSelector;
