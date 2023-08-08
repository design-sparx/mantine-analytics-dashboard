import {ActionIcon, Group, TextInput} from "@mantine/core";
import {IconBell, IconFlag, IconMessageCircle, IconPower, IconSearch} from "@tabler/icons-react";
import {LanguagePicker} from "@/components";

const ICON_SIZE = 18;

const HeaderNav = () => {
    return (
        <Group position="apart">
            <TextInput placeholder="search" icon={<IconSearch size={ICON_SIZE}/>} sx={{width: 400}}/>
            <Group>
                <LanguagePicker type="collapsed"/>
                <ActionIcon>
                    <IconMessageCircle size={ICON_SIZE}/>
                </ActionIcon>
                <ActionIcon>
                    <IconBell size={ICON_SIZE}/>
                </ActionIcon>
                <ActionIcon>
                    <IconPower size={ICON_SIZE}/>
                </ActionIcon>
            </Group>
        </Group>
    );
};

export default HeaderNav;
