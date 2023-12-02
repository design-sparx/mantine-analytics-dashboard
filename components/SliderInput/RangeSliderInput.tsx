'use client';

import { RangeSlider, RangeSliderProps } from '@mantine/core';

type RangeSliderInputProps = RangeSliderProps;

/**
 * For more docs see - https://mantine.dev/core/slider/
 * @param others
 * @constructor
 */
const RangeSliderInput = ({ ...others }) => {
  return (
    <RangeSlider
      color="blue"
      marks={[
        { value: 0, label: 'xs' },
        { value: 25, label: 'sm' },
        { value: 50, label: 'md' },
        { value: 75, label: 'lg' },
        { value: 100, label: 'xl' },
      ]}
      {...others}
    />
  );
};

export default RangeSliderInput;
