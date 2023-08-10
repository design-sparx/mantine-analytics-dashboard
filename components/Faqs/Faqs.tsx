import {Container, Accordion, useMantineTheme, Title} from '@mantine/core';

const placeholder =
    'It can’t help but hear a pin drop from over half a mile away, so it lives deep in the mountains where there aren’t many people or Pokémon.It was born from sludge on the ocean floor. In a sterile environment, the germs within its body can’t multiply, and it dies.It has no eyeballs, so it can’t see. It checks its surroundings via the ultrasonic waves it emits from its mouth.';

const Faqs = () => {
    const theme = useMantineTheme()

    return (
        <Container fluid>
            <Title order={3} mb="md">
                Frequently Asked Questions
            </Title>

            <Accordion
                variant="filled"
                radius="md"
                styles={{
                    item: {
                        backgroundColor: '#fff',

                        '&[data-active]': {
                            backgroundColor: theme.colors[theme.primaryColor][0],
                        },
                    },
                    control: {
                        '&[data-active]': {
                            color: theme.colors[theme.primaryColor][9],
                        },
                    },
                    label: {
                        fontWeight: 600,
                    },
                    panel: {
                        fontSize: theme.fontSizes.sm
                    }
                }}
            >
                <Accordion.Item value="reset-password">
                    <Accordion.Control>How can I reset my password?</Accordion.Control>
                    <Accordion.Panel>{placeholder}</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="another-account">
                    <Accordion.Control>Can I create more that one account?</Accordion.Control>
                    <Accordion.Panel>{placeholder}</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="newsletter">
                    <Accordion.Control>How can I subscribe to monthly newsletter?</Accordion.Control>
                    <Accordion.Panel>{placeholder}</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="credit-card">
                    <Accordion.Control>Do you store credit card information securely?</Accordion.Control>
                    <Accordion.Panel>{placeholder}</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="payment">
                    <Accordion.Control>What payment systems to you work with?</Accordion.Control>
                    <Accordion.Panel>{placeholder}</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
}

export default Faqs;