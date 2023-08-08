import {ReactNode} from "react";
import {Avatar, Group, Text, UnstyledButton, UnstyledButtonProps,} from '@mantine/core';
import {IconChevronRight} from '@tabler/icons-react';
import useStyles from "./UserButton.styles";

type UserProfileButtonProps = {
    image: string;
    name: string;
    email: string;
    icon?: ReactNode;
} & UnstyledButtonProps

const UserProfileButton = ({image, name, email, icon, ...others}: UserProfileButtonProps) => {
    const {classes} = useStyles();

    return (
        <UnstyledButton className={classes.user} {...others}>
            <Group>
                <Avatar src={image} radius="xl"/>

                <div style={{flex: 1}}>
                    <Text size="sm" weight={500}>
                        {name}
                    </Text>

                    <Text size="xs">
                        {email}
                    </Text>
                </div>

                {icon || <IconChevronRight size="0.9rem" stroke={1.5}/>}
            </Group>
        </UnstyledButton>
    );
}

export default UserProfileButton;
