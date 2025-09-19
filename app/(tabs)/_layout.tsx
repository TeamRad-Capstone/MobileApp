import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#83884E",
          position: "absolute",
          borderTopWidth: 0,
          height: 50,
          margin: 30,
          borderRadius: 50,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="(profile)/edit"
        options={{
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="(profile)/stats"
        options={{
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="(profile)/transferred"
        options={{
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          href: "/(tabs)/profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: "Search",
          href: "/(tabs)/search",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(search)/[book]"
        options={{
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="recommednations"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shelves"
        options={{
          headerShown: false,
          title: "Shelves",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          headerShown: false,
          title: "Goals",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="check" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(goals)/current"
        options={{
          headerShown: false,
          href: null,
        }}
      />
    </Tabs>
  );
}
