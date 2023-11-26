"use client";

import {
  Box,
  BoxProps,
  createPolymorphicComponent,
  PaperProps,
} from "@mantine/core";
import { forwardRef, ReactNode } from "react";

type SurfaceProps = ({ children: ReactNode } & BoxProps) | PaperProps;

const Surface = createPolymorphicComponent<"div", SurfaceProps>(
  forwardRef<HTMLDivElement, SurfaceProps>(({ ...others }, ref) => (
    <Box component="div" {...others} ref={ref}>
      {others.children}
    </Box>
  )),
);

export default Surface;
