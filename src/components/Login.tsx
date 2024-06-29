/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik, Field } from "formik";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { CgMail, CgLock } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
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
          const response = await axiosInstance.post(
            "/api/account/auth/token/create/basic",
            { email: values.email, password: values.password }
          );
          const jwt = response.data;
          toast.dismiss(loadingToast);
          try {
            await login(jwt.token);
            toast.success("Signed in");
            navigate(next);
          } catch (err: any) {
            toast.error(err.message);
          }
        } catch (err: any) {
          toast.dismiss(loadingToast);
          if (err.status === 400 && err.data && err.data.nonFieldErrors) {
            toast.error(err.data.nonFieldErrors[0]);
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
              <FormControl isInvalid={form.errors.email && form.touched.email}>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CgMail />
                  </InputLeftElement>
                  <Input {...field} type="email" autoFocus isRequired />
                </InputGroup>
                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="password" validate={validateRequiredPassword}>
            {({ field, form }: FieldProps) => (
              <FormControl
                mt={4}
                isInvalid={form.errors.password && form.touched.password}
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CgLock />
                  </InputLeftElement>
                  <Input {...field} type="password" isRequired />
                </InputGroup>
                <FormErrorMessage>{form.errors.password}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={5}
            type="submit"
            isLoading={isSubmitting}
            loadingText="Signing in"
          >
            Sign In
          </Button>
        </Form>
      )}
    </Formik>
  );
}

Login.propTypes = {
  next: PropTypes.string,
};
