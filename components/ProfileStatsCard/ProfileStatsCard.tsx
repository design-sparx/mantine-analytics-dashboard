import React from 'react';
import {Flex, MantineColor, Paper, PaperProps, Progress, Stack, Text, ThemeIcon} from "@mantine/core";

type ProfileStatsCardProps =
    { amount: string; title: string; icon: any, color: MantineColor, progressValue: number }
    & PaperProps

const ProfileStatsCard = ({amount, color, title, icon, progressValue, ...others}: ProfileStatsCardProps) => {
    const Icon = icon;

    return (
        <Paper {...others}>
            <Flex align="center" justify="space-between" mb="md">
                <Stack spacing={2}>
                    <Text size="lg" fw={700} tt="capitalize">{amount}</Text>
                    <Text size="sm" color="dimmed" tt="capitalize">{title}</Text>
                </Stack>
                <ThemeIcon color={color} size="lg" radius="xl">
                    <Icon size={18}/>
                </ThemeIcon>
            </Flex>
            <Progress value={progressValue} color={color} size="sm"/>
        </Paper>
    );
};

export default ProfileStatsCard;