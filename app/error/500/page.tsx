"use client"

import {Button, Group, Stack, Text, Title} from '@mantine/core';
import {IconHome2, IconRefresh} from "@tabler/icons-react";
import {useRouter} from "next/navigation";
import {PATH_ERROR} from "@/routes";
import classes from "./page.module.css"
import {Metadata} from "next";

const metadata: Metadata = {
  title: "Server Error | DesignSparx",
  description: "Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!",
};

function Error500() {
  const router = useRouter()

  return (
    <>
      <Stack>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>Sorry, unexpected error..</Title>
        <Text fz="md" ta="center" className={classes.description}>
          Our servers could not handle your request. Don't worry, our development team was already
          notified. Try refreshing the page.
        </Text>
        <Group justify="center" mt="md">
          <Button size="md" leftSection={<IconRefresh size={18}/>} onClick={() => router.push(PATH_ERROR.error500)}>
            Refresh Page
          </Button>
          <Button size="md" leftSection={<IconHome2 size={18}/>} onClick={() => router.push('/')}>
            Take me to home page
          </Button>
        </Group>
      </Stack>
    </>
  );
}

export default Error500
