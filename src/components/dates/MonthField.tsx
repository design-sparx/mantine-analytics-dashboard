'use client';

import { useState } from 'react';

import { MonthPickerInput, MonthPickerInputProps } from '@mantine/dates';

type MonthFieldProps = MonthPickerInputProps;

/**
 * For more docs see - https://mantine.dev/dates/month-picker-input/
 * @param others
 * @constructor
 */
const MonthField = ({ ...others }: MonthFieldProps) => {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <MonthPickerInput
      label="Pick date"
      placeholder="Pick date"
      value={value}
      // @ts-ignore
      onChange={setValue}
      {...others}
    />
  );
};

export default MonthField;
