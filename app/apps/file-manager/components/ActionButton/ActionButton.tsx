import { FC } from 'react';

import { Text, UnstyledButton, UnstyledButtonProps } from '@mantine/core';

import classes from './ActionButton.module.css';

type ActionButtonProps = UnstyledButtonProps & {
  icon: FC<any>;
  label: string;
  asPrimary?: boolean;
};

export function ActionButton({
  icon: Icon,
  label,
  asPrimary = false,
  ...others
}: ActionButtonProps) {
  return (
    <UnstyledButton
      {...others}
      className={classes.wrapper}
      data-primary={asPrimary}
    >
      <Icon size={24} />
      <Text mt={4} className={classes.label}>
        {label}
      </Text>
    </UnstyledButton>
  );
}
