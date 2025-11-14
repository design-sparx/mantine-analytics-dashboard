'use client';

import { Slider, SliderProps } from '@mantine/core';

type SliderInputProps = SliderProps;

/**
 * For more docs see - https://mantine.dev/core/slider/
 * @param others
 * @constructor
 */
const SliderInput = ({ ...others }) => {
  return (
    <Slider
      color="blue"
      marks={[
        { value: 20, label: '20%' },
        { value: 50, label: '50%' },
        { value: 80, label: '80%' },
      ]}
      {...others}
    />
  );
};

export default SliderInput;
