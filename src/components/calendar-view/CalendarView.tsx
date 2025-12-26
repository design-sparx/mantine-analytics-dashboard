import { Calendar, CalendarProps } from '@mantine/dates';

type CalendarViewProps = CalendarProps;

/**
 * For more docs see - https://mantine.dev/dates/calendar/
 * @param others
 * @constructor
 */
const CalendarView = ({ ...others }: CalendarViewProps) => {
  return <Calendar {...others} />;
};

export default CalendarView;
