import React from 'react';

import { ActionIcon, ColorSwatch, SimpleGrid, Tooltip } from '@mantine/core';

import { COLOR_SCHEMES, PrimaryColor } from '@/contexts/theme-customizer';

interface ColorPickerProps {
  value: PrimaryColor;
  onChange: (color: PrimaryColor) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <SimpleGrid cols={6} spacing="xs">
      {Object.entries(COLOR_SCHEMES).map(([key, colorInfo]) => (
        <Tooltip key={key} label={colorInfo.name} position="top">
          <ActionIcon
            variant={value === key ? 'filled' : 'subtle'}
            size="lg"
            radius="md"
            onClick={() => onChange(key as PrimaryColor)}
            style={{
              backgroundColor: value === key ? colorInfo.color : 'transparent',
              border: `2px solid ${
                value === key ? colorInfo.color : 'transparent'
              }`,
            }}
          >
            <ColorSwatch color={colorInfo.color} size={18} />
          </ActionIcon>
        </Tooltip>
      ))}
    </SimpleGrid>
  );
};
