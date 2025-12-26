import { Button, ButtonProps } from '@mantine/core';

type ButtonsProps = { orientation?: 'horizontal' | 'vertical' } & ButtonProps;

/**
 * For more docs see - https://mantine.dev/core/button/#buttongroup
 * @param orientation
 * @param others
 * @constructor
 */
const Buttons = ({ orientation, ...others }: ButtonsProps) => {
  return (
    <Button.Group orientation={orientation}>
      <Button variant="default" {...others}>
        First
      </Button>
      <Button variant="default" {...others}>
        Second
      </Button>
      <Button variant="default" {...others}>
        Third
      </Button>
    </Button.Group>
  );
};

export default Buttons;
