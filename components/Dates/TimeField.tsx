'use client';

import { TimeInputProps } from '@mantine/dates';

type TimeFieldProps = TimeInputProps;

/**
 * For more docs see - https://mantine.dev/dates/time-input/
 * @param others
 * @constructor
 */
const TimeField = ({ ...others }: TimeFieldProps) => {
  return <TimeField label="Pick time" placeholder="Pick time" {...others} />;
};

export default TimeField;
