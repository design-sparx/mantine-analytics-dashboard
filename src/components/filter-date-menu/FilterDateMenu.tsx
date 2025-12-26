import { Button, Menu } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

const FilterDateMenu = () => {
  return (
    <Menu shadow="md" width={120}>
      <Menu.Target>
        <Button variant="subtle" rightSection={<IconChevronDown size={14} />}>
          Today: July 25
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Today</Menu.Item>
        <Menu.Item>Yesterday</Menu.Item>
        <Menu.Item>Last 7 days</Menu.Item>
        <Menu.Item>Last 30 days</Menu.Item>
        <Menu.Item>This month</Menu.Item>
        <Menu.Item>Last month</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterDateMenu;
