import * as Utils from "../utils";
import { TextField, type TextFieldProps } from "@mui/material";
import type { ProfileData } from "../types";

export function Field(props: TextFieldProps) {
  return <TextField size="small" fullWidth {...props} />;
}

export function PasswordField({
  name = "password",
  label = "Пароль",
  current = false,
}: {
  name?: string;
  label?: string;
  current?: boolean;
}) {
  return (
    <Field
      name={name}
      label={label}
      type="password"
      required
      autoComplete={current ? "current-password" : "new-password"}
      slotProps={{
        htmlInput: current
          ? {}
          : {
              minLength: Utils.limits.passwordMin,
              maxLength: Utils.limits.passwordMax,
            },
      }}
    />
  );
}

export function ProfileFields({ value }: { value?: ProfileData }) {
  return (
    <>
      <Field
        name="username"
        label="Имя пользователя"
        defaultValue={value?.username}
        required
        autoComplete="username"
        slotProps={{
          htmlInput: {
            minLength: Utils.limits.usernameMin,
            maxLength: Utils.limits.usernameMax,
          },
        }}
      />
      <Field
        name="firstName"
        label="Имя"
        defaultValue={value?.firstName}
        required
        autoComplete="given-name"
        slotProps={{ htmlInput: { maxLength: Utils.limits.nameMax } }}
      />
      <Field
        name="lastName"
        label="Фамилия"
        defaultValue={value?.lastName}
        autoComplete="family-name"
        slotProps={{ htmlInput: { maxLength: Utils.limits.nameMax } }}
      />
      <Field
        name="phone"
        label="Телефон"
        defaultValue={value?.phone}
        type="tel"
        autoComplete="tel"
        slotProps={{ htmlInput: { maxLength: Utils.limits.phoneMax } }}
      />
      <EmailField defaultValue={value?.email} />
    </>
  );
}

export function EmailField({ defaultValue }: { defaultValue?: string }) {
  return (
    <Field
      name="email"
      label="Электронная почта"
      type="email"
      required
      autoComplete="email"
      defaultValue={defaultValue}
      slotProps={{ htmlInput: { maxLength: Utils.limits.emailMax } }}
    />
  );
}

export function CodeField() {
  return (
    <Field
      name="code"
      label="Код подтверждения"
      required
      autoComplete="one-time-code"
      slotProps={{
        htmlInput: {
          inputMode: "numeric",
          pattern: "[0-9]{6}",
          maxLength: Utils.limits.confirmationCodeLength,
          minLength: Utils.limits.confirmationCodeLength,
        },
      }}
    />
  );
}
