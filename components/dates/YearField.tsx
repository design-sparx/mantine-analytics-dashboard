'use client';

import { useState } from 'react';

import { YearPickerInput, YearPickerInputProps } from '@mantine/dates';

type YearFieldProps = YearPickerInputProps;

/**
 * For more docs see - https://mantine.dev/dates/year-picker-input/
 * @param others
 * @constructor
 */
const YearField = ({ ...others }: YearFieldProps) => {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <YearPickerInput
      label="Pick date"
      placeholder="Pick date"
      value={value}
      // @ts-ignore
      onChange={setValue}
      {...others}
    />
  );
};

export default YearField;
