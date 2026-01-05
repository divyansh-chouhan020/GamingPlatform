import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Box, Typography, Link } from "@mui/material";
import Cookies from "js-cookie";

import Layout from "@/components/common/layoutComponent";
import AuthLayout from "@/components/common/authLayout";
import { InputField, Button, Toast, Loader } from "@/components/common/uiComponents";
import { login } from "@/redux/slices/authSlice";
import { authAPI } from "@/services/api";
import { setTheme } from "@/redux/slices/themeSlice";

const INITIAL_FORM = {
  name: "",
  email: "",
  age: "",
  dob: "",
  password: "",
  confirmPassword: "",
};

const USER_TYPES = {
  USER: "user",
  DEVELOPER: "developer",
};

const FORM_FIELDS = [
  { key: "name", label: "Name", type: "text", placeholder: "Enter your name" },
  { key: "email", label: "Email", type: "email", placeholder: "Enter your email" },
  { key: "age", label: "Age", type: "number", placeholder: "Enter your age" },
  { key: "dob", label: "Date of Birth", type: "date", labelProps: { shrink: true } },
  { key: "password", label: "Password", type: "password", placeholder: "Enter your password", helperText: "Minimum 8 characters" },
  { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password" },
];

const validateForm = (form) => {
  if (!form.name || !form.email || !form.password) {
    return "Some fields are missing";
  }
  if (form.password !== form.confirmPassword) {
    return "Passwords do not match";
  }
  if (form.password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (form.age && (form.age < 12 || form.age > 60)) {
    return "Age must be between 12 and 60";
  }
  return null;
};

export default function SignUpPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(USER_TYPES.USER);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    dispatch(setTheme(Cookies.get("theme") || "dark"));
  }, [dispatch]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSignUp = async () => {
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: userType,
        ...(form.age && { age: parseInt(form.age) }),
        ...(form.dob && { dob: form.dob }),
      };

      const response = await authAPI.signup(payload);

      if (!response?.success || !response?.token) {
        throw new Error(response?.message || "Signup failed");
      }

      dispatch(login({
        token: response.token,
        role: response.data?.role || userType,
      }));

      router.push("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  const isUser = userType === USER_TYPES.USER;

  return (
    <>
      <Head>
        <title>Sign Up | CyberArena</title>
      </Head>

      <Layout>
        {loading && <Loader fullscreen />}

        <AuthLayout>
          <Box display="flex" flexDirection="column" gap="20px" width="100%">
            <Typography
              variant="h4"
              className="gaming-title"
              sx={{
                fontFamily: "'Jersey 10', sans-serif",
                fontWeight: 400,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {isUser ? "SignUp for the Adventure" : "Create Developer Account"}
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: "16px" }}>
              Create your account to get started
            </Typography>

            <Box display="flex" gap="12px" mb="8px">
              {Object.entries(USER_TYPES).map(([key, value]) => (
                <Button
                  key={value}
                  label={key.charAt(0) + key.slice(1).toLowerCase()}
                  variant={userType === value ? "primary" : "secondary"}
                  onClick={() => setUserType(value)}
                  sx={{ flex: 1 }}
                />
              ))}
            </Box>

            {FORM_FIELDS.map(({ key, label, type, placeholder, helperText, labelProps }) => (
              <InputField
                key={key}
                label={label}
                type={type}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                helperText={helperText}
                InputLabelProps={labelProps}
              />
            ))}

            <Button
              label={loading ? "Creating Account..." : `Create ${isUser ? "User" : "Developer"} Account`}
              onClick={handleSignUp}
              disabled={loading}
              sx={{ marginTop: "8px" }}
            />

            <Box textAlign="center" mt="8px">
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </AuthLayout>

        {error && (
          <Toast
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}
      </Layout>
    </>
  );
}