import { Ionicons } from '@expo/vector-icons'
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer'
import { Drawer } from 'expo-router/drawer'
import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import './globals.css'

function CustomDrawerContent(props: any) {
  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Drawer Header */}
        <View
          style={{
            paddingTop: 60, // Extra padding to avoid status bar collision
            paddingHorizontal: 20,
            paddingBottom: 30,
            borderBottomWidth: 1,
            borderBottomColor: '#1F1F1F',
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name="rocket" size={28} color="#FFFFFF" />
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 20,
                fontWeight: '700',
                marginLeft: 12,
                letterSpacing: 0.5,
              }}
            >
              ISS Explorer
            </Text>
          </View>
          <Text
            style={{
              color: '#9CA3AF',
              fontSize: 14,
              lineHeight: 20,
              marginLeft: 40,
            }}
          >
            NASA App Challenge 2025
          </Text>
        </View>

        {/* Drawer Items */}
        <DrawerItemList {...props} />

        {/* Footer */}
        <View
          style={{
            padding: 20,
            paddingTop: 30,
            borderTopWidth: 1,
            borderTopColor: '#1F1F1F',
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: '#6B7280',
              fontSize: 12,
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            Built for Space Exploration{'\n'}
            Powered by NASA APIs
          </Text>
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#000000" translucent={false} />
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#000000',
            width: 320,
          },
          drawerActiveTintColor: '#FFFFFF',
          drawerInactiveTintColor: '#9CA3AF',
          drawerActiveBackgroundColor: '#1F1F1F',
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 16,
            letterSpacing: 0.3,
          },
          headerStyle: {
            backgroundColor: '#000000',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#1F1F1F',
            height: 80,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            letterSpacing: 0.5,
            marginLeft: 8,
          },
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
          drawerItemStyle: {
            borderRadius: 12,
            marginHorizontal: 20,
            marginVertical: 3,
            paddingVertical: 6,
            paddingHorizontal: 12,
          },
          drawerContentContainerStyle: {
            paddingTop: 0,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'ISS Explorer',
            title: 'ISS Explorer',
            drawerIcon: ({ color }) => (
              <Ionicons name="planet-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="explore"
          options={{
            drawerLabel: 'Timeline',
            title: 'ISS Timeline',
            drawerIcon: ({ color }) => (
              <Ionicons name="time-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="iss-location"
          options={{
            drawerLabel: 'Location',
            title: 'ISS Location',
            drawerIcon: ({ color }) => (
              <Ionicons name="location-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="nasa-apod"
          options={{
            drawerLabel: 'Picture of the Day',
            title: 'NASA APOD',
            drawerIcon: ({ color }) => (
              <Ionicons name="image-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="astronauts"
          options={{
            drawerLabel: 'Astronauts',
            title: 'Astronauts in Space',
            drawerIcon: ({ color }) => (
              <Ionicons name="people-outline" size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
