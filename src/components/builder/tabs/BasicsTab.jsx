// components/builder/tabs/BasicsTab.jsx
import React, { useRef } from "react";
import {
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorld,
  IconUpload,
  IconTrash,
  IconPhoto,
} from "@tabler/icons-react";
import { Field, AreaField, Section } from "../controls/FormControls";
import { TEMPLATE_DEFINITIONS } from "@/lib/resume-data";

export default function BasicsTab({ resume, update }) {
  const fileInputRef = useRef(null);
  const activeTemplateDef =
    TEMPLATE_DEFINITIONS.find((t) => t.id === resume.templateName) ||
    TEMPLATE_DEFINITIONS[0];

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview URL
    const previewUrl = URL.createObjectURL(file);
    update("avatar", {
      url: previewUrl,
      key: `local-${Date.now()}`,
      file,
    });
  };

  const removeAvatar = () => {
    update("avatar", { url: "", key: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Section
        title="Personal details"
        required
        description="Core contact info displayed at top"
      >
        {/* Strictly shown ONLY if the selected template supports an avatar */}
        {activeTemplateDef.hasAvatar && (
          <div className="mb-2 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5">
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-900">
              <IconPhoto size={14} /> Profile Avatar
            </span>
            <div className="flex items-center gap-4">
              {resume.avatar?.url ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-indigo-400 shadow-sm">
                  <img
                    src={resume.avatar.url}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-dashed border-indigo-300 bg-white text-indigo-400">
                  <IconPhoto size={24} />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  <IconUpload size={14} />
                  {resume.avatar?.url ? "Change Photo" : "Upload Photo"}
                </button>
                {resume.avatar?.url && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <IconTrash size={14} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Full name"
            value={resume.basicInfo?.fullName}
            onChange={(v) => update("basicInfo.fullName", v)}
            placeholder="Aarav Mehta"
          />
          <Field
            label="Target role"
            value={resume.basicInfo?.position}
            onChange={(v) => update("basicInfo.position", v)}
            placeholder="Senior Backend Engineer"
          />
          <Field
            label="Email"
            type="email"
            value={resume.contactInfo?.primaryEmail}
            onChange={(v) => update("contactInfo.primaryEmail", v)}
            placeholder="aarav.mehta@example.com"
          />
          <Field
            label="Phone"
            icon={IconPhone}
            value={resume.contactInfo?.primaryMobile}
            onChange={(v) => update("contactInfo.primaryMobile", v)}
            placeholder="+91 98765 43210"
          />
        </div>
      </Section>

      <Section title="Profile summary" description="Summary or objective">
        <AreaField
          label="Professional summary"
          value={resume.profileSummary?.objective}
          onChange={(v) => update("profileSummary.objective", v)}
          placeholder="Describe your technical strengths, track record and value..."
        />
      </Section>

      <Section title="Location & links" description="Location and external URLs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="City"
            icon={IconMapPin}
            value={resume.address?.city}
            onChange={(v) => update("address.city", v)}
            placeholder="Pune"
          />
          <Field
            label="Country"
            value={resume.address?.country}
            onChange={(v) => update("address.country", v)}
            placeholder="India"
          />
        </div>
        <Field
          label="LinkedIn"
          icon={IconBrandLinkedin}
          value={resume.contactInfo?.linkedin}
          onChange={(v) => update("contactInfo.linkedin", v)}
          placeholder="https://linkedin.com/in/aarav-mehta"
        />
        <Field
          label="GitHub"
          icon={IconBrandGithub}
          value={resume.contactInfo?.github}
          onChange={(v) => update("contactInfo.github", v)}
          placeholder="https://github.com/aarav-mehta"
        />
        <Field
          label="Portfolio"
          icon={IconWorld}
          value={resume.contactInfo?.portfolio}
          onChange={(v) => update("contactInfo.portfolio", v)}
          placeholder="https://aaravmehta.dev"
        />
      </Section>
    </>
  );
}