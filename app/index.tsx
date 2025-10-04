import ISSViewer from '@/components/ISSViewer'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Animation values
  const headerOpacity = useSharedValue(0)
  const cardOpacity = useSharedValue(0)
  const floatingY = useSharedValue(-10)

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Animate entrance
    headerOpacity.value = withSpring(1, { damping: 15, stiffness: 100 })
    cardOpacity.value = withDelay(
      300,
      withSpring(1, { damping: 15, stiffness: 100 })
    )

    // Floating animation
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000 }),
        withTiming(-15, { duration: 2000 })
      ),
      -1,
      true
    )

    return () => clearInterval(timer)
  }, [])

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }))

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: floatingY.value }],
  }))

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Animated.View style={headerAnimatedStyle} className="px-6 pt-8 pb-6">
          <View className="items-center mb-6">
            <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
              ISS Explorer
            </Text>
            <Text className="text-blue-400 text-lg font-medium mb-1">
              NASA App Challenge 2025
            </Text>
            <Text className="text-gray-400 text-center text-base leading-6 max-w-sm">
              Experience the International Space Station like never before
            </Text>
          </View>

          {/* Live Time Display */}
          <View className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-2xl border border-blue-500/20 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse" />
                <Text className="text-green-400 text-sm font-semibold">
                  LIVE
                </Text>
              </View>
              <Text className="text-white text-lg font-mono">
                {currentTime.toLocaleTimeString()}
              </Text>
            </View>
            <Text className="text-gray-300 text-xs mt-1">
              Current Mission Time • Earth Orbit
            </Text>
          </View>
        </Animated.View>

        {/* ISS 3D Viewer - Enhanced */}
        <Animated.View style={cardAnimatedStyle} className="mx-4 mb-8">
          <View className="bg-gray-900/50 rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur-xl">
            <View className="p-4 border-b border-gray-700/50">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="cube-outline" size={24} color="#60A5FA" />
                  <Text className="text-white text-lg font-semibold ml-3">
                    3D Station Model
                  </Text>
                </View>
                <View className="bg-blue-500/20 px-3 py-1 rounded-full">
                  <Text className="text-blue-300 text-xs font-medium">
                    INTERACTIVE
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ height: 300 }}>
              <ISSViewer />
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions Grid */}
        <View className="px-6 mb-8">
          <Text className="text-white text-xl font-semibold mb-6">Explore</Text>

          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              className="w-[48%] bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-6 rounded-2xl border border-blue-500/30 mb-4"
              onPress={() => router.push('/iss-location')}
              activeOpacity={0.8}
            >
              <Ionicons name="location" size={32} color="#60A5FA" />
              <Text className="text-white text-lg font-semibold mt-3 mb-1">
                Track ISS
              </Text>
              <Text className="text-gray-400 text-sm leading-5">
                Real-time location tracking
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[48%] bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-6 rounded-2xl border border-purple-500/30 mb-4"
              onPress={() => router.push('/astronauts')}
              activeOpacity={0.8}
            >
              <Ionicons name="people" size={32} color="#C084FC" />
              <Text className="text-white text-lg font-semibold mt-3 mb-1">
                Crew Info
              </Text>
              <Text className="text-gray-400 text-sm leading-5">
                Meet the astronauts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[48%] bg-gradient-to-br from-green-900/40 to-green-800/40 p-6 rounded-2xl border border-green-500/30 mb-4"
              onPress={() => router.push('/nasa-apod')}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={32} color="#4ADE80" />
              <Text className="text-white text-lg font-semibold mt-3 mb-1">
                NASA Photos
              </Text>
              <Text className="text-gray-400 text-sm leading-5">
                Picture of the day
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[48%] bg-gradient-to-br from-orange-900/40 to-orange-800/40 p-6 rounded-2xl border border-orange-500/30 mb-4"
              onPress={() => router.push('/explore')}
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={32} color="#FB923C" />
              <Text className="text-white text-lg font-semibold mt-3 mb-1">
                Timeline
              </Text>
              <Text className="text-gray-400 text-sm leading-5">
                Mission history
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Insight */}
        <View className="px-6 pb-8">
          <View className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 p-6 rounded-2xl border border-indigo-500/20">
            <View className="flex-row items-start">
              <Ionicons name="bulb" size={28} color="#818CF8" />
              <View className="ml-4 flex-1">
                <Text className="text-indigo-300 text-lg font-semibold mb-2">
                  Did You Know?
                </Text>
                <Text className="text-gray-300 text-base leading-6">
                  The ISS travels at 17,500 mph, completing one orbit around
                  Earth every 90 minutes. That's 16 sunrises and sunsets every
                  day!
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
