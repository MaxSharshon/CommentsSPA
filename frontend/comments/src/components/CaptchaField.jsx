import {Button, FormControl, FormErrorMessage, FormLabel, HStack, Image, Input} from "@chakra-ui/react";

const CaptchaField = ({ captchaImage, onRefresh, value, onChange, error}) => {
    return (
        <FormControl isRequired isInvalid={!!error}>
            <FormLabel>CAPTCHA</FormLabel>
            <HStack>
                {captchaImage && <Image src={captchaImage} alt="Captcha" height="50" />}
                <Button size="sm" onClick={onRefresh}>
                    Refresh
                </Button>
            </HStack>
            <Input
                name="captchaCode"
                value={value}
                onChange={onChange}
                mt={2}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    )
}

export default CaptchaField