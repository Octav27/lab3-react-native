import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase } from "../db";

export default function RootLayoutNav() {
    useEffect(() => {
        initDatabase();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="add-recipe" options={{ title: 'Add Personal Recipe', presentation: 'modal' }} />
            <Stack.Screen name="recipe/[id]" options={{ title: 'Recipe Details' }} />
            <Stack.Screen name="local-recipe/[id]" options={{ title: 'Personal Recipe' }} />
        </Stack>
    );
}
