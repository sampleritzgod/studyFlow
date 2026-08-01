import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type Common = {
  label: string;
  name: string;
  hint?: string;
};

export type TextFieldProps = Common &
  Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "id"> & {
    as?: "input";
  };

export type TextAreaFieldProps = Common &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "id"> & {
    as: "textarea";
  };

export type SelectFieldProps = Common &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "id"> & {
    as: "select";
    children: ReactNode;
  };

export type FieldProps = TextFieldProps | TextAreaFieldProps | SelectFieldProps;

export function Field(props: FieldProps) {
  const { label, name, hint } = props;

  let control: ReactNode;

  if (props.as === "textarea") {
    const rest = omitCommon(props);
    control = <textarea className="field-textarea" id={name} name={name} {...rest} />;
  } else if (props.as === "select") {
    const { children, ...rest } = omitCommon(props);
    control = (
      <select className="field-input" id={name} name={name} {...rest}>
        {children}
      </select>
    );
  } else {
    const { type = "text", ...rest } = omitCommon(props);
    control = <input className="field-input" id={name} name={name} type={type} {...rest} />;
  }

  return (
    <label className="field" htmlFor={name}>
      <span className="field-label">{label}</span>
      {control}
      {hint ? <span className="muted">{hint}</span> : null}
    </label>
  );
}

function omitCommon<T extends FieldProps>(props: T) {
  const copy = { ...props } as Record<string, unknown>;
  delete copy.label;
  delete copy.name;
  delete copy.hint;
  delete copy.as;
  return copy as Omit<T, "label" | "name" | "hint" | "as">;
}
