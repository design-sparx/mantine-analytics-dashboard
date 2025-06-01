'use client';

import { ReactNode } from 'react';

import {
  ActionIcon,
  Affix,
  Box,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  useDisclosure,
  useLocalStorage,
  useMediaQuery,
  useWindowScroll,
} from '@mantine/hooks';
import { IconPalette } from '@tabler/icons-react';

import { ThemeCustomizer } from '@/components';
import {
  generateContentStyles,
  generateHeaderStyles,
  generateSidebarStyles,
  useThemeCustomizer,
} from '@/contexts/ThemeCustomizerContext';

import FooterNav from './components/Footer';
import HeaderNav from './components/Header';
import SidebarNav from './components/Sidebar';
import layoutClasses from './MainLayout.module.css';

export type SidebarState = 'hidden' | 'mini' | 'full';

type Props = {
  children: ReactNode;
};

export function MainLayout({ children }: Props) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [scroll] = useWindowScroll();

  const {
    config,
    isCustomizerOpen,
    openCustomizer,
    closeCustomizer,
  } = useThemeCustomizer();

  const [sidebarState, setSidebarState] = useLocalStorage<SidebarState>({
    key: 'mantine-nav-state',
    defaultValue: 'full',
  });

  const toggleSidebarState = () => {
    setSidebarState((current) => {
      if (current === 'full') return 'mini';
      if (current === 'mini') return 'hidden';
      return 'full';
    });
  };

  // Generate dynamic styles based on theme config
  const sidebarStyles = generateSidebarStyles(config.layout.sidebar);
  const headerStyles = generateHeaderStyles(config.layout.header);
  const contentStyles = generateContentStyles(config.layout.content);

  // Calculate sidebar width based on state and config
  const getSidebarWidth = () => {
    if (sidebarState === 'hidden') return 0;
    if (sidebarState === 'mini') return 60;
    return config.layout.sidebar.width;
  };

  // Calculate main content margin based on sidebar
  const getMainMargin = () => {
    if (mobile_match || config.layout.sidebar.overlay) return 0;
    const width = getSidebarWidth();
    return config.layout.sidebar.position === 'right'
      ? { marginRight: width }
      : { marginLeft: width };
  };

  // Mobile overlay backdrop
  const showOverlay =
    mobile_match && mobileOpened && config.layout.sidebar.overlay;

  return (
    <Box className={layoutClasses.layoutRoot}>
      {/* Mobile Overlay */}
      {showOverlay && (
        <Box className={layoutClasses.overlay} onClick={toggleMobile} />
      )}

      {/* Header */}
      <Box
        className={layoutClasses.header}
        data-variant={config.layout.header.variant}
        data-position={config.layout.header.position}
        style={{
          ...headerStyles,
          ...getMainMargin(),
          boxShadow: config.layout.header.showShadow
            ? tablet_match
              ? theme.shadows.md
              : theme.shadows.sm
            : 'none',
        }}
      >
        <Container fluid py="sm" px="lg">
          <HeaderNav
            mobileOpened={mobileOpened}
            toggleMobile={toggleMobile}
            sidebarState={sidebarState}
            onSidebarStateChange={toggleSidebarState}
            headerVariant={config.layout.header.variant}
          />
        </Container>
      </Box>

      {/* Sidebar */}
      <Box
        className={layoutClasses.sidebar}
        data-variant={config.layout.sidebar.variant}
        data-position={config.layout.sidebar.position}
        data-state={sidebarState}
        data-mobile-opened={mobileOpened}
        style={{
          ...sidebarStyles,
          width: getSidebarWidth(),
          [config.layout.sidebar.position]: 0,
          transform:
            mobile_match && !mobileOpened
              ? `translateX(${
                config.layout.sidebar.position === 'right' ? '100%' : '-100%'
              })`
              : 'translateX(0)',
        }}
      >
        <SidebarNav
          onClose={toggleMobile}
          sidebarState={sidebarState}
          onSidebarStateChange={setSidebarState}
        />
      </Box>

      {/* Main Content */}
      <Box
        className={layoutClasses.main}
        data-sidebar-position={config.layout.sidebar.position}
        data-header-position={config.layout.header.position}
        style={{
          ...getMainMargin(),
          paddingTop:
            config.layout.header.position === 'fixed'
              ? config.layout.header.height
              : 0,
          minHeight: `calc(100vh - ${rem(60)})`, // Account for footer
        }}
      >
        <Box
          className={layoutClasses.content}
          data-layout={config.layout.content.layout}
          data-padding={config.layout.content.padding}
          style={contentStyles}
        >
          {children}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        className={layoutClasses.footer}
        data-position={config.layout.sidebar.position}
        style={{ ...getMainMargin() }}
      >
        <Container fluid px="lg">
          <FooterNav />
        </Container>
      </Box>

      {/* Theme Customizer Drawer */}
      <ThemeCustomizer
        opened={isCustomizerOpen}
        onClose={closeCustomizer}
      />

      {/* Floating Action Button for Theme Customizer */}
      <Affix position={{ bottom: 80, right: 20 }}>
        <ActionIcon
          size="xl"
          radius="xl"
          variant="filled"
          onClick={openCustomizer}
        >
          <IconPalette size={24} />
        </ActionIcon>
      </Affix>
    </Box>
  );
}
