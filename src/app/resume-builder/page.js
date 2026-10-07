import ResumeBuilder from "@/components/resume-form/ResumeBuilder";
import BlockPrintPage from "@/components/utils/BlockPrintPage";

export default async function BuildResume({ searchParams }) {
  const params = await searchParams;
  return (
    <BlockPrintPage>
      <ResumeBuilder
        initialTemplate={
          typeof params?.template === "string"
            ? params.template
            : "clean-ats-optimizer"
        }
      />
    </BlockPrintPage>
  );
}
