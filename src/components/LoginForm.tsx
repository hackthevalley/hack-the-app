import { Form, Formik, Field, type FieldProps } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import { CgMail, CgLock } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { createSession } from "../api/authApi";

import {
  Field as ChakraField,
  Input,
  InputGroup,
  Button,
} from "@chakra-ui/react";

import {
  validateRequiredEmail,
  validateRequiredPassword,
} from "../utils/validators";
import { useUser } from "./Authentication";

interface LoginFormProps {
  next: string;
}

interface LoginValues {
  email: string;
  password: string;
}

export default function LoginForm({ next }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useUser();

  return (
    <Formik<LoginValues>
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Signing in...");
        try {
          // Send as form-urlencoded data as backend expects OAuth2PasswordRequestForm
          const session = await createSession(values.email, values.password);
          toast.dismiss(loadingToast);
          try {
            await login(session.access_token);
            toast.success("Signed in");
            navigate(next);
          } catch (error: unknown) {
            toast.error(
              error instanceof Error ? error.message : "Unable to sign in"
            );
          }
        } catch (error: unknown) {
          toast.dismiss(loadingToast);
          if (axios.isAxiosError<{ detail?: string }>(error) && error.response?.data?.detail) {
            toast.error(error.response.data.detail);
          } else {
            toast.error("Unexpected error. Try again later.");
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="email" validate={validateRequiredEmail}>
            {({ field, form }: FieldProps<string, LoginValues>) => (
              <ChakraField.Root
                invalid={Boolean(form.errors.email && form.touched.email)}
              >
                <ChakraField.Label htmlFor="email">
                  Email address
                </ChakraField.Label>
                <InputGroup startElement={<CgMail />}>
                  <Input {...field} id="email" type="email" autoFocus required />
                </InputGroup>
                <ChakraField.ErrorText>
                  {typeof form.errors.email === "string" ? form.errors.email : undefined}
                </ChakraField.ErrorText>
              </ChakraField.Root>
            )}
          </Field>
          <Field name="password" validate={validateRequiredPassword}>
            {({ field, form }: FieldProps<string, LoginValues>) => (
              <ChakraField.Root
                mt={4}
                invalid={Boolean(
                  form.errors.password && form.touched.password
                )}
              >
                <ChakraField.Label htmlFor="password">
                  Password
                </ChakraField.Label>
                <InputGroup startElement={<CgLock />}>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    required
                  />
                </InputGroup>
                <ChakraField.ErrorText>
                  {typeof form.errors.password === "string" ? form.errors.password : undefined}
                </ChakraField.ErrorText>
              </ChakraField.Root>
            )}
          </Field>
          <Button
            mt={5}
            type="submit"
            loading={isSubmitting}
            loadingText="Signing in"
          >
            Sign In
          </Button>
        </Form>
      )}
    </Formik>
  );
}
