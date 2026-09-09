import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

import { useUserStore } from "@/store/userStore";

const ACTIVE_COLOR = "#2563EB";
const INACTIVE_COLOR = "#737373";
const TAB_BACKGROUND = "#FFFFFF";

function AndroidTabs({ isAdmin }) {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,

        tabBarStyle: {
          backgroundColor: TAB_BACKGROUND,
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
          height: 65,
          paddingTop: 6,
          paddingBottom: 8,
          elevation: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Add Property",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={"add-circle"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function IosTabs({ isAdmin }) {
  return (
    <NativeTabs
      backgroundColor={TAB_BACKGROUND}
      tintColor={ACTIVE_COLOR}
      iconColor={{
        default: INACTIVE_COLOR,
        selected: ACTIVE_COLOR,
      }}
      labelStyle={{
        color: INACTIVE_COLOR,
      }}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "house",
            selected: "house.fill",
          }}
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="create" hidden={!isAdmin}>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "plus.circle",
            selected: "plus.circle.fill",
          }}
        />
        <NativeTabs.Trigger.Label>
          Add Property
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="saved">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "heart",
            selected: "heart.fill",
          }}
        />
        <NativeTabs.Trigger.Label>Saved</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "person",
            selected: "person.fill",
          }}
        />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function TabLayout() {
  const isAdmin = useUserStore((state) => state.isAdmin);

  return Platform.OS === "android" ? (
    <AndroidTabs isAdmin={isAdmin} />
  ) : (
    <IosTabs isAdmin={isAdmin} />
  );
}