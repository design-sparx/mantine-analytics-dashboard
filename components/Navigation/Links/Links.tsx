import { useEffect, useState } from 'react';
import {
  Box,
  Collapse,
  Group,
  MantineTheme,
  rem,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconCalendarStats, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as _ from 'lodash';
import classes from './Links.module.css';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: {
    label: string;
    link: string;
  }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  link,
  links,
}: LinksGroupProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const [currentPath, setCurrentPath] = useState<string | undefined>();
  const ChevronIcon = IconChevronRight;

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component={Link}
      className={classes.link}
      href={link.link}
      key={link.label}
      data-active={link.label.toLowerCase() === currentPath || undefined}
    >
      {link.label}
    </Text>
  ));

  useEffect(() => {
    const paths = pathname.split('/');
    setOpened(paths[1].toLowerCase() === label.toLowerCase());
    setCurrentPath(_.last(paths)?.toLowerCase() || undefined);
  }, [pathname, label]);

  return (
    <>
      <UnstyledButton
        onClick={() => {
          setOpened((o) => !o);
          link && router.push(link || '#');
        }}
        className={classes.control}
        data-active={opened || undefined}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Icon size={18} />
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? `rotate(90deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
