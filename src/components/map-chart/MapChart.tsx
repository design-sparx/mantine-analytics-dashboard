'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {
  ActionIcon,
  Group,
  Paper,
  PaperProps,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { csv } from 'd3-fetch';
import { scaleLinear } from 'd3-scale';
import sortBy from 'lodash/sortBy';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

import { Surface } from '@/components';
import WorldCountriesMap from '@public/mocks/WorldAtlasCountries.json';

const geoUrl = WorldCountriesMap;

type MapChartProps = PaperProps;

const MapChart = ({ ...others }: MapChartProps) => {
  const theme = useMantineTheme();
  const [data, setData] = useState<any>([]);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    csv('/data.csv').then((cities: any) => {
      const sortedCities = sortBy(cities, (o) => -o.population);
      setMaxValue(sortedCities[0].population);
      setData(sortedCities);
    });
  }, []);

  const popScale = useMemo(
    () => scaleLinear().domain([0, maxValue]).range([0, 24]),
    [maxValue],
  );

  return (
    <Surface {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Real time
        </Text>
        <ActionIcon variant="subtle">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>
      {/*@ts-ignore*/}
      <ComposableMap projectionConfig={{ rotate: [-10, 0, 0] }}>
        {/*@ts-ignore*/}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              // @ts-ignore
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={theme.colors[theme.primaryColor][1]}
              />
            ))
          }
        </Geographies>
        {data.map(({ city_code, lng, lat, population }: any) => {
          return (
            // @ts-ignore
            <Marker key={city_code} coordinates={[lng, lat]}>
              <circle
                fill={theme.colors[theme.primaryColor][7]}
                stroke="#FFF"
                r={popScale(population)}
              />
            </Marker>
          );
        })}
      </ComposableMap>
    </Surface>
  );
};

export default MapChart;
