"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./RegistrationForm.module.css";

export default function RegistrationForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    emailId: "",
    fullName: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const birthDate = new Date(`${dateOfBirth}T00:00:00`);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const userName = formData.userName.trim();
    const emailId = formData.emailId.trim();
    const fullName = formData.fullName.trim();

    if (userName.length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (!emailId) {
      setError("Please enter your email address.");
      return;
    }

    if (!fullName || fullName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.dateOfBirth) {
      setError("Please select your date of birth.");
      return;
    }

    const age = calculateAge(formData.dateOfBirth);

    if (age === null || age < 1 || age > 120) {
      setError("Please enter a valid date of birth.");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        process.env.NEXT_PUBLIC_REGISTRATION_URL ||
          "http://localhost:8080/api/v1/auth/registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userName,
            emailId,
            fullName,
            age,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to create your account."
        );
      }

      router.push("/sign-in");
    } catch (err) {
      setError(
        err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.registrationPage}>
      <section className={styles.registrationCard}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 3.5H17C18.1 3.5 19 4.4 19 5.5V18.5C19 19.6 18.1 20.5 17 20.5H7C5.9 20.5 5 19.6 5 18.5V5.5C5 4.4 5.9 3.5 7 3.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M8.5 8H15.5M8.5 12H15.5M8.5 16H13"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span>Resume Craft</span>
        </div>

        <div className={styles.header}>
          <h1>Create your account</h1>
          <p>Build your professional resume with Resume Craft.</p>
        </div>

        {error && (
          <div className={styles.errorMessage} role="alert">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 8V12.5M12 16H12.01"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <span>{error}</span>
          </div>
        )}

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Full Name */}
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor="fullName">Full Name</label>

            <div className={styles.inputContainer}>
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 21C20 17.6863 16.4183 15 12 15C7.58172 15 4 17.6863 4 21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Username + Age */}
          <div className={styles.twoFields}>
            <div className={styles.field}>
              <label htmlFor="userName">Username</label>

              <div className={styles.inputContainer}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M5 20C5.7 16.8 8.2 15 12 15C15.8 15 18.3 16.8 19 20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="userName"
                  name="userName"
                  type="text"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="dateOfBirth">Date of Birth</label>

              <div className={styles.inputContainer}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="4"
                    y="5"
                    width="16"
                    height="15"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 3V7M16 3V7M4 10H20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor="emailId">Email Address</label>

            <div className={styles.inputContainer}>
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M4 7L12 13L20 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                id="emailId"
                name="emailId"
                type="email"
                value={formData.emailId}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password + Confirm Password */}
          <div className={styles.twoFields}>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>

              <div className={styles.inputContainer}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6C10.2 11 10 11.5 10 12C10 13.1 10.9 14 12 14C12.5 14 13 13.8 13.4 13.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 5.2C10.6 5 11.3 5 12 5C17.2 5 20.5 9.2 21 12C20.7 13.7 19.6 15.4 18.1 16.7M6.1 7.1C4.3 8.4 3.3 10.4 3 12C3.5 14.8 6.8 19 12 19C13.4 19 14.7 18.7 15.8 18.1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 12C3.8 8.5 7.2 5 12 5C16.8 5 20.2 8.5 21 12C20.2 15.5 16.8 19 12 19C7.2 19 3.8 15.5 3 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className={styles.inputContainer}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6C10.2 11 10 11.5 10 12C10 13.1 10.9 14 12 14C12.5 14 13 13.8 13.4 13.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 5.2C10.6 5 11.3 5 12 5C17.2 5 20.5 9.2 21 12C20.7 13.7 19.6 15.4 18.1 16.7M6.1 7.1C4.3 8.4 3.3 10.4 3 12C3.5 14.8 6.8 19 12 19C13.4 19 14.7 18.7 15.8 18.1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 12C3.8 8.5 7.2 5 12 5C16.8 5 20.2 8.5 21 12C20.2 15.5 16.8 19 12 19C7.2 19 3.8 15.5 3 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <label className={styles.terms}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) =>
                setAcceptTerms(event.target.checked)
              }
            />

            <span className={styles.checkmark}>
              <svg viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span>
              I agree to the{" "}
              <Link href="/terms">Terms & Conditions</Link>{" "}
              and <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className={styles.registrationButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M4 10H16M11 5L16 10L11 15"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className={styles.loginPrompt}>
          Already have an account?{" "}
          <Link href="/sign-in">Sign in</Link>
        </div>
      </section>
    </main>
  );
}