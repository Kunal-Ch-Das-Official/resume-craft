import ResumeBuilder from "@/components/resume-form/ResumeBuilder";

export default async function BuildResume({ searchParams }) {
  const params = await searchParams;
  return (
    <ResumeBuilder
      initialTemplate={
        typeof params?.template === "string"
          ? params.template
          : "clean-ats-optimizer"
      }
    />
  );
}
