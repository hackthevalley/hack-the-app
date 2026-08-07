/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik, Field } from "formik";
import toast from "react-hot-toast";
import { CgMail, CgLock } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

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

interface LoginProps {
  next: string;
}

interface FieldProps {
  field: any;
  form: any;
}

export default function Login({ next }: LoginProps) {
  const navigate = useNavigate();
  const { login } = useUser();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values: any) => {
        const loadingToast = toast.loading("Signing in...");
        try {
          // Send as form-urlencoded data as backend expects OAuth2PasswordRequestForm
          const formData = new URLSearchParams();
          formData.append("username", values.email);
          formData.append("password", values.password);

          const response = await axiosInstance.post(
            "/account/sessions",
            formData.toString(),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          toast.dismiss(loadingToast);
          try {
            await login(response.data.access_token);
            toast.success("Signed in");
            navigate(next);
          } catch (err: any) {
            toast.error(err.message);
          }
        } catch (err: any) {
          toast.dismiss(loadingToast);
          if (err.response?.data?.detail) {
            toast.error(err.response.data.detail);
          } else {
            toast.error("Unexpected error. Try again later.");
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="email" validate={validateRequiredEmail}>
            {({ field, form }: FieldProps) => (
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
                  {form.errors.email}
                </ChakraField.ErrorText>
              </ChakraField.Root>
            )}
          </Field>
          <Field name="password" validate={validateRequiredPassword}>
            {({ field, form }: FieldProps) => (
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
                  {form.errors.password}
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
