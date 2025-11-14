import { DateTimePicker, DateTimePickerProps } from '@mantine/dates';

type DateTimeFieldProps = DateTimePickerProps;

/**
 * For more docs see - https://mantine.dev/dates/date-time-picker/
 * @param others
 * @constructor
 */
const DateTimeField = ({ ...others }: DateTimeFieldProps) => {
  return (
    <DateTimePicker
      label="Pick date and time"
      placeholder="Pick date and time"
      {...others}
    />
  );
};

export default DateTimeField;
