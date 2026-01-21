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
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconPalette } from '@tabler/icons-react';

import { SystemNotificationBanner, ThemeCustomizer } from '@/components';
import {
  generateContentStyles,
  generateHeaderStyles,
  generateSidebarStyles,
  useThemeCustomizer,
} from '@/contexts/theme-customizer';

import FooterNav from './components/Footer';
import HeaderNav from './components/Header';
import SidebarNav from './components/Sidebar';
import layoutClasses from './MainLayout.module.css';

type Props = {
  children: ReactNode;
};

export function MainLayout({ children }: Props) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure();

  const {
    config,
    isCustomizerOpen,
    openCustomizer,
    closeCustomizer,
    toggleSidebarVisibility,
    showSidebar,
    hideSidebar,
  } = useThemeCustomizer();

  // Generate dynamic styles based on theme config
  const sidebarStyles = generateSidebarStyles(config.layout.sidebar);
  const headerStyles = generateHeaderStyles(config.layout.header);
  const contentStyles = generateContentStyles(config.layout.content);

  // Determine if sidebar should overlay (mobile or overlay setting enabled)
  const shouldOverlay = mobile_match || config.layout.sidebar.overlay;

  // Calculate main content margin based on sidebar
  const getMainMargin = () => {
    // If overlay mode or mobile, don't apply margin
    if (shouldOverlay) return 0;

    // If sidebar is hidden, no margin needed
    if (!config.layout.sidebar.visible) return 0;

    const width = config.layout.sidebar.width;
    return config.layout.sidebar.position === 'right'
      ? { marginRight: width }
      : { marginLeft: width };
  };

  // Determine if sidebar should be visible
  const isSidebarVisible = () => {
    // If sidebar is set to hidden in config, don't show
    if (!config.layout.sidebar.visible) return false;

    // On mobile with overlay, only show if mobile menu is opened
    if (mobile_match) return mobileOpened;

    // On desktop, show if visible in config
    return true;
  };

  // Show overlay backdrop when sidebar overlays content
  const showOverlay = shouldOverlay && isSidebarVisible() && !mobile_match;

  const handleSidebarToggle = () => {
    if (mobile_match) {
      // Mobile: toggle mobile menu
      toggleMobile();
    } else {
      // Desktop: toggle sidebar visibility in theme config
      toggleSidebarVisibility();
    }
  };

  const handleSidebarClose = () => {
    if (mobile_match) {
      closeMobile();
    } else {
      hideSidebar();
    }
  };

  return (
    <Box className={layoutClasses.layoutRoot}>
      {/* Overlay backdrop */}
      {showOverlay && (
        <Box className={layoutClasses.overlay} onClick={handleSidebarClose} />
      )}

      {/* Mobile Overlay */}
      {mobile_match && mobileOpened && (
        <Box className={layoutClasses.overlay} onClick={closeMobile} />
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
            toggleMobile={toggleMobile}
            sidebarVisible={config.layout.sidebar.visible}
            onSidebarToggle={handleSidebarToggle}
            onSidebarShow={showSidebar}
            headerVariant={config.layout.header.variant}
          />
        </Container>
      </Box>

      {/* Sidebar */}
      {isSidebarVisible() && (
        <Box
          className={layoutClasses.sidebar}
          data-variant={config.layout.sidebar.variant}
          data-position={config.layout.sidebar.position}
          data-overlay={shouldOverlay}
          style={{
            ...sidebarStyles,
            width: config.layout.sidebar.width,
            [config.layout.sidebar.position]: 0,
            zIndex: shouldOverlay ? 102 : 101,
            direction:
              config.layout.sidebar.position === 'left' ? 'ltr' : 'rtl',
            transform:
              mobile_match && !mobileOpened
                ? `translateX(${
                    config.layout.sidebar.position === 'right'
                      ? '100%'
                      : '-100%'
                  })`
                : 'translateX(0)',
          }}
        >
          <SidebarNav
            onClose={handleSidebarClose}
            showCloseButton={config.layout.sidebar.overlay || mobile_match}
          />
        </Box>
      )}

      {/* Main Content */}
      <Box
        className={layoutClasses.main}
        data-sidebar-position={config.layout.sidebar.position}
        data-header-position={config.layout.header.position}
        data-overlay={shouldOverlay}
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
          {/* System Notification Banner */}
          <SystemNotificationBanner layout="main" mb="md" />
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
      <ThemeCustomizer opened={isCustomizerOpen} onClose={closeCustomizer} />

      {/* Floating Action Button for Theme Customizer */}
      {!isCustomizerOpen && (
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
      )}
    </Box>
  );
}
