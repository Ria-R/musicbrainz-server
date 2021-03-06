/*
 * @flow
 * Copyright (C) 2018 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import React from 'react';

import FieldErrors from './FieldErrors';
import FormRow from './FormRow';
import FormLabel from './FormLabel';

type InputOnChange = (SyntheticEvent<HTMLInputElement>) => void;

type InputProps = {
  defaultValue?: string,
  +id: string,
  +name: string,
  onChange?: InputOnChange,
  +required: boolean,
  +size: ?number,
  +type: string,
  value?: string,
};

type CommonProps = {
  +field: ReadOnlyFieldT<?string>,
  +label: string,
  +required?: boolean,
  +size?: number,
  +type?: string,
};

export type Props =
  | $ReadOnly<{
      ...CommonProps,
      onChange: InputOnChange,
      uncontrolled?: false,
    }>
  | $ReadOnly<{
      ...CommonProps,
      uncontrolled: true,
    }>;

const FormRowText = (props: Props) => {
  const field = props.field;
  const required = props.required ?? false;

  const inputProps: InputProps = {
    id: 'id-' + field.html_name,
    name: field.html_name,
    required: required,
    size: props.size,
    type: props.type ?? 'text',
  };

  const inputValue = field.value ?? '';

  if (props.uncontrolled) {
    inputProps.defaultValue = inputValue;
  } else {
    inputProps.onChange = props.onChange;
    inputProps.value = inputValue;
  }

  return (
    <FormRow>
      <FormLabel forField={field} label={props.label} required={required} />
      <input {...inputProps} />
      <FieldErrors field={field} />
    </FormRow>
  );
};

export default FormRowText;
