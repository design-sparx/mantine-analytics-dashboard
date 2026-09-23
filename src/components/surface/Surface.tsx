'use client';

import { ReactNode, forwardRef } from 'react';

import {
  Box,
  BoxProps,
  PaperProps,
  createPolymorphicComponent,
} from '@mantine/core';

export type CardFeel = 'flat' | 'elevated' | 'bordered' | 'glassmorphism';

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
      // Generate classes based on feel and static appearance config
      const getCardClasses = () => {
        const classes = [];

        // Base card class
        classes.push('surface-card');

        // Feel-specific classes
        switch (feel || 'elevated') {
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

        // Compact mode disabled
        // classes.push('surface-compact');

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
