import { FC } from 'react';

import { PaperProps, Text } from '@mantine/core';

import { Surface } from '@/components';

import classes from './ActionButton.module.css';

type ActionButtonProps = PaperProps & {
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
    <Surface {...others} className={classes.wrapper} data-primary={asPrimary}>
      <Icon size={24} />
      <Text mt={4} className={classes.label}>
        {label}
      </Text>
    </Surface>
  );
}
