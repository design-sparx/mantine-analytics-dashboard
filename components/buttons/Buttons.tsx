import { Button, ButtonProps } from '@mantine/core';

type ButtonsProps = ButtonProps;

/**
 * For more docs see - https://mantine.dev/core/button/
 * @param others
 * @constructor
 */
const Buttons = ({ ...others }: ButtonsProps) => {
  return (
    <Button variant="filled" {...others}>
      {others.children || 'Button'}
    </Button>
  );
};

export default Buttons;
