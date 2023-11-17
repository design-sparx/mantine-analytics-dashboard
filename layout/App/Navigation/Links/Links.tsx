import {useState} from 'react';
import {
  Box,
  Collapse,
  Group,
  MantineTheme,
  rem,
  Text,
  UnstyledButton,
  useMantineTheme,
  MantineThemeOther
} from '@mantine/core';
import {IconCalendarStats, IconChevronLeft, IconChevronRight} from '@tabler/icons-react';
import Link from "next/link";
import {useRouter} from "next/navigation";
import classes from "./Links.module.css";

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: {
    label: string;
    link: string
  }[];
}

export function LinksGroup({icon: Icon, label, initiallyOpened, link, links}: LinksGroupProps) {
  const theme = useMantineTheme()
  const router = useRouter()
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = IconChevronRight;

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component={Link}
      className={classes.link}
      href={link.link}
      key={link.label}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={
          (evt) => {
            setOpened((o) => !o);
            link && (router.push(link || "#"))
          }
        }
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{display: 'flex', alignItems: 'center'}}>
            <Icon size={18}/>
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

const mockdata = {
  label: 'Releases',
  icon: IconCalendarStats,
  links: [
    {label: 'Upcoming releases', link: '/'},
    {label: 'Previous releases', link: '/'},
    {label: 'Releases schedule', link: '/'},
  ],
};

export function NavbarLinksGroup() {
  return (
    <Box
      style={(theme: MantineTheme) => ({
        minHeight: rem(220),
        padding: theme.spacing.md,
        backgroundColor: theme.white,
      })}
    >
      <LinksGroup {...mockdata} />
    </Box>
  );
}
