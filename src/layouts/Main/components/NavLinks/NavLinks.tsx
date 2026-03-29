import { useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Box,
  Collapse,
  Group,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronRight } from '@tabler/icons-react';
import * as _ from 'lodash';
import { usePathname, useRouter } from 'next/navigation';

import classes from './NavLinks.module.css';

interface LinksGroupProps {
  icon?: any;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: {
    label: string;
    link: string;
  }[];
  closeSidebar: () => void;
  isMini?: boolean;
  badge?: string;
}

export function LinksGroup(props: LinksGroupProps) {
  const {
    icon: Icon,
    label,
    initiallyOpened,
    link,
    links,
    closeSidebar,
    isMini,
    badge,
  } = props;
  const router = useRouter();
  const pathname = usePathname();
  const theme = useMantineTheme();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const [_currentPath, setCurrentPath] = useState<string | undefined>();
  const ChevronIcon = IconChevronRight;
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const LinkItem = ({ link }: { link: { label: string; link: string } }) => {
    const isActive = link.link.toLowerCase() === pathname;
    return (
      <Text
        className={classes.link}
        onClick={() => {
          router.push(link.link);
          // Only close sidebar on mobile screens or when in overlay mode
          if (tablet_match) {
            closeSidebar();
          }
        }}
        data-active={isActive || undefined}
        data-mini={isMini}
        style={
          isActive
            ? {
                backgroundColor: theme.colors[theme.primaryColor][6],
                color: 'white',
              }
            : undefined
        }
      >
        {link.label}
      </Text>
    );
  };

  const items = (hasLinks ? links : []).map((link) =>
    isMini ? (
      <Menu.Item key={`menu-${link.label}`}>
        <LinkItem link={link} />
      </Menu.Item>
    ) : (
      <LinkItem key={link.label} link={link} />
    ),
  );

  const handleMainButtonClick = () => {
    if (hasLinks) {
      // If it has nested links, just toggle the collapse
      setOpened((o) => !o);
    } else if (link) {
      // If it's a direct link, navigate and close sidebar only on mobile
      router.push(link);
      if (tablet_match) {
        closeSidebar();
      }
    }
  };

  const handleMiniButtonClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    if (hasLinks) {
      // For mini mode with nested links, just toggle
      setOpened((o) => !o);
    } else if (link) {
      // For mini mode with direct link, navigate and close only on mobile
      router.push(link);
      if (tablet_match) {
        closeSidebar();
      }
    }
  };

  const content: React.ReactElement = useMemo(() => {
    let view: React.ReactElement;
    if (isMini) {
      view = (
        <>
          <Menu
            position="right-start"
            withArrow
            arrowPosition="center"
            trigger="hover"
            openDelay={100}
            closeDelay={400}
          >
            <Menu.Target>
              <UnstyledButton
                onClick={handleMiniButtonClick}
                className={classes.control}
                data-active={opened || undefined}
                data-mini={isMini}
              >
                <Tooltip
                  label={label}
                  position="right"
                  transitionProps={{ duration: 0 }}
                >
                  <Icon size={24} />
                </Tooltip>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
          </Menu>
        </>
      );
    } else {
      view = (
        <>
          <UnstyledButton
            onClick={handleMainButtonClick}
            className={classes.control}
            data-active={opened || undefined}
            data-mini={isMini}
            style={
              opened && !hasLinks && link?.toLowerCase() === pathname
                ? {
                    backgroundColor: theme.colors[theme.primaryColor][6],
                    color: 'white',
                  }
                : undefined
            }
          >
            <Group justify="space-between" gap={0}>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Icon size={18} />
                {!isMini && (
                  <Group gap="xs" ms="md">
                    <Box>{label}</Box>
                    {badge && (
                      <Badge
                        size="xs"
                        variant={
                          opened && link?.toLowerCase() === pathname
                            ? 'white'
                            : 'light'
                        }
                      >
                        {badge}
                      </Badge>
                    )}
                  </Group>
                )}
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
          {hasLinks ? (
            <Collapse in={opened} className={classes.linksInner}>
              {items}
            </Collapse>
          ) : null}
        </>
      );
    }

    return view;
  }, [
    hasLinks,
    isMini,
    items,
    label,
    link,
    opened,
    pathname,
    theme.colors,
    theme.primaryColor,
    badge,
  ]);

  useEffect(() => {
    const paths = pathname.split('/');
    setOpened(paths.includes(label.toLowerCase()));
    setCurrentPath(_.last(paths)?.toLowerCase() || undefined);
  }, [pathname, label]);

  return <>{content}</>;
}
