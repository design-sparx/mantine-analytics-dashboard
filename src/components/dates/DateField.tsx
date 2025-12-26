'use client';

import { useState } from 'react';

import { DateInput, DatePickerInputProps } from '@mantine/dates';

type DateFieldProps = DatePickerInputProps;

/**
 * For more docs see - https://mantine.dev/dates/date-input/
 * @param others
 * @constructor
 */
const DateField = ({ ...others }: DateFieldProps) => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    // @ts-ignore
    <DateInput label="Pick date" placeholder="Pick date" {...others} />
  );
};

export default DateField;
