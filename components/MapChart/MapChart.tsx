import React, {useEffect, useMemo, useState} from "react";
import {ComposableMap, Geographies, Geography, Marker} from "react-simple-maps";
import {csv} from "d3-fetch";
import {scaleLinear} from "d3-scale";
import sortBy from "lodash/sortBy";
import {ActionIcon, Group, Paper, PaperProps, Text, useMantineTheme} from "@mantine/core";
import {IconDotsVertical} from "@tabler/icons-react";

const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

type MapChartProps = PaperProps

const MapChart = ({...others}: MapChartProps) => {
    const theme = useMantineTheme()
    const [data, setData] = useState<any>([]);
    const [maxValue, setMaxValue] = useState(0);

    useEffect(() => {
        csv("/data.csv").then((cities: any) => {
            const sortedCities = sortBy(cities, (o) => -o.population);
            setMaxValue(sortedCities[0].population);
            setData(sortedCities);
        });
    }, []);

    const popScale = useMemo(
        () => scaleLinear().domain([0, maxValue]).range([0, 24]),
        []
    );

    return (
        <Paper {...others}>
            <Group position="apart" mb="md">
                <Text size="lg" fw={600}>Real time</Text>
                <ActionIcon>
                    <IconDotsVertical size={18}/>
                </ActionIcon>
            </Group>
            <ComposableMap projectionConfig={{rotate: [-10, 0, 0]}}>
                <Geographies geography={geoUrl}>
                    {({geographies}) =>
                        geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo} fill={theme.colors[theme.primaryColor][1]}/>
                        ))
                    }
                </Geographies>
                {data.map(({city_code, lng, lat, population}: any) => {
                    return (
                        <Marker key={city_code} coordinates={[lng, lat]}>
                            <circle fill={theme.colors[theme.primaryColor][7]} stroke="#FFF" r={popScale(population)}/>
                        </Marker>
                    );
                })}
            </ComposableMap>
        </Paper>
    );
};

export default MapChart;
