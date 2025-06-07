'use client';

import { ReactNode, forwardRef } from 'react';

import {
  Box,
  BoxProps,
  PaperProps,
  createPolymorphicComponent,
} from '@mantine/core';

import { useAppearanceConfig } from '@/contexts/theme-customizer';

export type CardFeel = 'flat' | 'elevated' | 'bordered';

type SurfaceProps = {
  children: ReactNode;
  feel?: CardFeel;
  hover?: boolean; // Enable hover effects
} & BoxProps &
  PaperProps;

const Surface = createPolymorphicComponent<'div', SurfaceProps>(
  // eslint-disable-next-line react/display-name
  forwardRef<HTMLDivElement, SurfaceProps>(
    ({ children, feel, hover = false, className, ...others }, ref) => {
      const appearance = useAppearanceConfig();

      // Generate classes based on feel and appearance config
      const getCardClasses = () => {
        const classes = [];

        // Base card class
        classes.push('surface-card');

        // Feel-specific classes
        switch (feel || appearance.cardFeel || 'elevated') {
          case 'flat':
            classes.push('surface-flat');
            break;
          case 'bordered':
            classes.push('surface-bordered');
            break;
          case 'glassmorphism':
            classes.push('surface-glassmorphism');
            break;
          case 'elevated':
          default:
            classes.push('surface-elevated');
            break;
        }

        // Hover effect
        if (hover) {
          classes.push('surface-hover');
        }

        // Compact mode
        if (appearance.compact) {
          classes.push('surface-compact');
        }

        return classes.join(' ');
      };

      const combinedClassName = [getCardClasses(), className]
        .filter(Boolean)
        .join(' ');

      return (
        <Box
          component="div"
          className={combinedClassName}
          {...others}
          ref={ref}
        >
          {children}
        </Box>
      );
    },
  ),
);

Surface.displayName = 'Surface';

export default Surface;
