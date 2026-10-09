"use client";
import { useState } from "react";
import {
  IconUser,
  IconFileText,
  IconCreditCard,
  IconLock,
  IconLogout,
  IconShieldCheck,
  IconMail,
  IconAt,
  IconChevronRight,
  IconSparkles,
  IconCheck,
  IconArrowUpRight,
  IconKey,
  IconCircleCheck,
  IconPlus,
  IconReceipt,
  IconShield,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Slot } from "@radix-ui/react-slot";
import "./UserProfileDashboard.css";
import { useRouter } from "next/navigation";



function Button({
  variant = "default",
  size = "default",
  className = "",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={`dashboard-button dashboard-button--${variant} dashboard-button--${size} ${className}`}
      {...props}
    />
  );
}
const navItems = [
  {
    id: "profile",
    label: "Profile Details",
    description: "Personal information",
    icon: IconUser,
  },
  {
    id: "resumes",
    label: "My Resumes",
    description: "Manage your documents",
    icon: IconFileText,
  },
  {
    id: "payments",
    label: "Billing & Payments",
    description: "Plan and invoices",
    icon: IconCreditCard,
  },
  {
    id: "security",
    label: "Change Password",
    description: "Account security",
    icon: IconLock,
  },
];
export default function UserProfileDashboard({
  userData,
  preview = false,
  onManageSubscription,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const user = userData || {
    id: "6ac76004354c9890b6280de5",
    userName: "ajay_devgan_001",
    userEmail: "ajay@gmail.com",
    fullName: "Ajay Devgan",
  };
  const initials =
    user.fullName
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  const activeItem =
    navItems.find((item) => item.id === activeTab) ?? navItems[0];
  if (!activeItem) return null;
  const changeTab = (id) => {
    setActiveTab(id);
    setMessage({ type: "", text: "" });
  };
  const handleLogout = async () => {
    if (preview) {
      setMessage({
        type: "info",
        text: "Logout is available when this page is connected to your existing app.",
      });
      return;
    }
    try {
      setIsLoggingOut(true);
      const response = await fetch(process.env.NEXT_PUBLIC_LOGOUT_URL, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Unable to log out. Please try again.");
      router.push("/sign-in")
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to log out.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (preview) {
      setMessage({
        type: "info",
        text: "Password updates are available when connected to your existing app.",
      });
      return;
    }
    try {
      setIsUpdating(true);
      const response = await fetch("/api/backend/auth/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update password.");
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update password.",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  const resumeAction = () => {
    if (preview)
      setMessage({
        type: "info",
        text: "The resume builder opens in your existing app.",
      });
    else window.location.href = "/resume-builder";
  };
  return (
    <main className="account-page">
      <div className="account-shell">
        <div className="account-breadcrumb">
          <IconUser size={15} />
          <span>My account</span>
          <IconChevronRight size={13} />
          <span>Settings</span>
        </div>
        <header className="account-identity">
          <div className="identity-person">
            <div className="account-avatar">
              {initials}
              <span className="avatar-status" />
            </div>
            <div className="identity-copy">
              <div className="identity-title">
                <h1>{user.fullName}</h1>
                <span className="premium-badge">
                  <IconSparkles size={13} />
                  Premium
                </span>
              </div>
              <p>@{user.userName}</p>
              <span className="identity-email">{user.userEmail}</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <IconLogout size={17} />
            {isLoggingOut ? "Logging out…" : "Log out"}
          </Button>
        </header>
        <div className="account-workspace">
          <aside className="account-sidebar">
            <p className="section-eyebrow">ACCOUNT SETTINGS</p>
            <nav aria-label="Account navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`account-nav ${activeTab === item.id ? "is-active" : ""}`}
                    aria-current={activeTab === item.id ? "page" : undefined}
                    onClick={() => changeTab(item.id)}
                  >
                    <Icon size={20} stroke={1.7} />
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <IconChevronRight size={15} className="nav-chevron" />
                  </Button>
                );
              })}
            </nav>
            <div className="sidebar-security">
              <span className="security-symbol">
                <IconShieldCheck size={22} stroke={1.7} />
              </span>
              <div>
                <strong>Account protected</strong>
                <p>
                  Your account is active
                  <br />
                  and secured.
                </p>
              </div>
              <span className="status-dot" />
            </div>
          </aside>
          <section className="account-content" aria-labelledby="content-title">
            <header className="content-heading">
              <div>
                <p className="section-eyebrow">YOUR ACCOUNT</p>
                <h2 id="content-title">{activeItem.label}</h2>
                <p>{activeItem.description}</p>
              </div>
              <span className="heading-icon">
                <activeItem.icon size={25} stroke={1.5} />
              </span>
            </header>
            {message.text && (
              <div
                className={`account-message ${message.type}`}
                role={message.type === "error" ? "alert" : "status"}
              >
                <IconAlertCircle size={18} />
                <span>{message.text}</span>
              </div>
            )}
            {activeTab === "profile" && (
              <div className="profile-body">
                <div className="profile-section-title">
                  <h3>Personal information</h3>
                  <span>
                    <IconLock size={13} /> Private to you
                  </span>
                </div>
                <div className="profile-fields">
                  <ProfileField
                    label="Full name"
                    value={user.fullName}
                    icon={IconUser}
                  />
                  <ProfileField
                    label="Username"
                    value={user.userName}
                    icon={IconAt}
                  />
                  <ProfileField
                    label="Email address"
                    value={user.userEmail}
                    icon={IconMail}
                    wide
                    verified
                  />
                  <ProfileField
                    label="Unique user ID"
                    value={user.id}
                    icon={IconShieldCheck}
                    wide
                    mono
                  />
                </div>
                <div className="account-status-row">
                  <InfoStat
                    icon={IconCircleCheck}
                    label="Account status"
                    value="Active"
                    tone="success"
                  />
                  <InfoStat
                    icon={IconShield}
                    label="Security"
                    value="Protected"
                  />
                  <InfoStat
                    icon={IconSparkles}
                    label="Membership"
                    value="Premium"
                    tone="primary"
                  />
                </div>
                <p className="profile-footer">
                  <IconShieldCheck size={15} /> Your personal information is
                  kept private and secure.
                </p>
              </div>
            )}
            {activeTab === "resumes" && (
              <div className="tab-body">
                <div className="resume-heading">
                  <div>
                    <h3>Your resume collection</h3>
                    <p>Everything you need for your next opportunity.</p>
                  </div>
                  <Button onClick={resumeAction}>
                    <IconPlus size={17} />
                    Create new
                  </Button>
                </div>
                <div className="empty-state">
                  <div className="document-art" aria-hidden="true">
                    <IconFileText size={58} stroke={1.1} />
                    <span>
                      <IconPlus size={16} />
                    </span>
                  </div>
                  <h3>No resumes yet</h3>
                  <p>
                    Your saved resumes will appear here
                    <br />
                    once you create one.
                  </p>
                  <Button onClick={resumeAction}>
                    Open resume builder
                    <IconArrowUpRight size={17} />
                  </Button>
                </div>
              </div>
            )}
            {activeTab === "payments" && (
              <div className="tab-body">
                <div className="plan-section">
                  <div className="plan-top">
                    <span className="plan-status">
                      <IconCircleCheck size={14} />
                      Active plan
                    </span>
                    <IconSparkles size={32} stroke={1.3} />
                  </div>
                  <h3>Professional ATS Suite</h3>
                  <p>
                    Unlimited exports, AI parsing and premium template access.
                  </p>
                  <div className="plan-features">
                    <span>
                      <IconCheck size={15} />
                      Unlimited exports
                    </span>
                    <span>
                      <IconCheck size={15} />
                      Premium templates
                    </span>
                  </div>
                </div>
                <div className="subscription-row">
                  <span>
                    <span className="status-dot" />
                    Subscription active
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      onManageSubscription
                        ? onManageSubscription()
                        : setMessage({
                            type: "info",
                            text: "Subscription management is not connected yet.",
                          })
                    }
                  >
                    <IconReceipt size={16} />
                    Manage subscription
                  </Button>
                </div>
                <div className="billing-summary">
                  <InfoStat
                    icon={IconSparkles}
                    label="Premium access"
                    value="Included"
                    tone="primary"
                  />
                  <InfoStat
                    icon={IconReceipt}
                    label="Payment history"
                    value="No invoices yet"
                  />
                </div>
              </div>
            )}
            {activeTab === "security" && (
              <div className="tab-body security-layout">
                <form onSubmit={handlePasswordUpdate}>
                  <PasswordField
                    label="Current password"
                    id="current-password"
                    autoComplete="current-password"
                    value={passwordForm.currentPassword}
                    onChange={(value) =>
                      setPasswordForm((form) => ({
                        ...form,
                        currentPassword: value,
                      }))
                    }
                  />
                  <PasswordField
                    label="New password"
                    id="new-password"
                    autoComplete="new-password"
                    value={passwordForm.newPassword}
                    onChange={(value) =>
                      setPasswordForm((form) => ({
                        ...form,
                        newPassword: value,
                      }))
                    }
                  />
                  <PasswordField
                    label="Confirm new password"
                    id="confirm-password"
                    autoComplete="new-password"
                    value={passwordForm.confirmPassword}
                    onChange={(value) =>
                      setPasswordForm((form) => ({
                        ...form,
                        confirmPassword: value,
                      }))
                    }
                  />
                  <Button type="submit" disabled={isUpdating}>
                    <IconKey size={17} />
                    {isUpdating ? "Updating…" : "Update password"}
                  </Button>
                </form>
                <aside className="password-advice">
                  <IconShield size={27} stroke={1.5} />
                  <h3>Keep your account secure</h3>
                  <p>
                    Use a unique password with a mix of letters, numbers and
                    symbols.
                  </p>
                  <ul>
                    {[
                      "Use at least 8 characters",
                      "Avoid common passwords",
                      "Never share your password",
                    ].map((tip) => (
                      <li key={tip}>
                        <IconCheck size={14} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            )}
          </section>
        </div>
        <footer className="account-page-footer">
          <IconLock size={12} />
          <span>A little peace of mind. Your account, protected.</span>
        </footer>
      </div>
    </main>
  );
}
function ProfileField({
  label,
  value,
  icon: Icon,
  wide = false,
  mono = false,
  verified = false,
}) {
  return (
    <div className={`profile-field ${wide ? "field-wide" : ""}`}>
      <div className="field-label">
        <span>{label}</span>
        {verified && (
          <span className="verified-label">
            <IconCircleCheck size={13} />
            Verified
          </span>
        )}
      </div>
      <div className="field-value">
        <Icon size={18} stroke={1.7} />
        <span className={mono ? "mono-value" : ""}>{value}</span>
      </div>
    </div>
  );
}
function InfoStat({ icon: Icon, label, value, tone = "neutral" }) {
  return (
    <div className={`info-stat ${tone}`}>
      <span className="stat-icon">
        <Icon size={19} stroke={1.7} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
function PasswordField({ label, id, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input">
        <IconLock size={17} />
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder="Enter password"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? <IconEyeOff size={17} /> : <IconEye size={17} />}
        </Button>
      </div>
    </div>
  );
}
