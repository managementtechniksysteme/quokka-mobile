import { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

type ServerErrors<T> = {
  [input in keyof T]: string[];
};

export const setServerErrors = <T extends FieldValues>(
  errors: ServerErrors<T>,
  setError: UseFormSetError<T>
) => {
  Object.keys(errors).map((input) =>
    errors[input as keyof T].map((message) =>
      setError(input as FieldPath<T>, { type: 'server', message: message })
    )
  );
};
