import { ActionIcon, ActionIconProps, rem } from '@mantine/core';
import {
  IconMessage,
  IconNotification,
  IconSettingsCog,
} from '@tabler/icons-react';

type ActionButtonProps = {
  iconSize?: number;
  orientation?: 'vertical' | 'horizontal';
} & ActionIconProps;

/**
 * For more docs see - https://mantine.dev/core/action-icon/#actionicongroup
 */
const ActionButton = ({
  iconSize,
  orientation,
  ...others
}: ActionButtonProps) => {
  return (
    <ActionIcon.Group orientation={orientation}>
      <ActionIcon variant="default" size="lg" aria-label="Messages" {...others}>
        <IconMessage size={iconSize || rem(14)} stroke={1.5} />
      </ActionIcon>

      <ActionIcon
        variant="default"
        size="lg"
        aria-label="Notifications"
        {...others}
      >
        <IconNotification size={iconSize || rem(14)} stroke={1.5} />
      </ActionIcon>

      <ActionIcon variant="default" size="lg" aria-label="Settings" {...others}>
        <IconSettingsCog size={iconSize || rem(14)} stroke={1.5} />
      </ActionIcon>
    </ActionIcon.Group>
  );
};

export default ActionButton;
