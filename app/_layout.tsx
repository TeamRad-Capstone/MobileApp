import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
    const [loaded, error] = useFonts({
        'Agbalumo': require('@/assets/fonts/Agbalumo-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="register"
                options={{headerShown: false}}
            />
        </Stack>
    )
}
