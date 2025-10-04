import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { WebView } from 'react-native-webview'

export default function ISSViewer() {
  const { width, height } = Dimensions.get('window')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  // Animation values
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.8)
  const titleOpacity = useSharedValue(0)
  const starOpacity = useSharedValue(0.5)

  // Sketchfab embed URL with optimized parameters for performance
  const sketchfabUrl =
    'https://sketchfab.com/models/6e289a99dfaa4de3852637696ddaea54/embed?autostart=1&preload=1&ui_theme=dark&ui_color=3B82F6&camera=0'

  useEffect(() => {
    // Animate stars
    starOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      true
    )
  }, [])

  const handleLoadEnd = () => {
    setIsLoading(false)
    // Animate in the content
    opacity.value = withSpring(1, { damping: 15, stiffness: 100 })
    scale.value = withSpring(1, { damping: 15, stiffness: 100 })
    titleOpacity.value = withDelay(200, withSpring(1))
  }

  const handleError = () => {
    setIsLoading(false)
    setLoadError(true)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }))

  const starsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: starOpacity.value,
  }))

  return (
    <View className="flex-1 bg-slate-900 relative">
      {/* Animated Background Stars */}
      <Animated.View className="absolute inset-0" style={starsAnimatedStyle}>
        {[...Array(30)].map((_, i) => (
          <View
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: Math.random() * width,
              top: Math.random() * height,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </Animated.View>

      {/* Loading State */}
      {isLoading && (
        <View className="absolute inset-0 justify-center items-center z-20 bg-slate-900/80 backdrop-blur-sm">
          <View className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 items-center">
            <ActivityIndicator size="large" color="#60A5FA" className="mb-4" />
            <Text className="text-xl font-bold text-white mb-2 tracking-tight">
              Loading ISS Model
            </Text>
            <Text className="text-sm text-slate-400 text-center max-w-xs leading-5">
              Preparing for orbital exploration experience
            </Text>

            {/* Loading Animation Dots */}
            <View className="flex-row mt-6 space-x-1">
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Error State */}
      {loadError && (
        <View className="absolute inset-0 justify-center items-center z-20 bg-slate-900/80 backdrop-blur-sm">
          <View className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 items-center">
            <Text className="text-5xl mb-4">🛰️</Text>
            <Text className="text-xl font-bold text-red-400 mb-2">
              Connection Lost
            </Text>
            <Text className="text-sm text-slate-400 text-center max-w-xs">
              Unable to establish link with ISS model. Please check your
              connection.
            </Text>

            <View className="mt-6 bg-red-500/20 px-4 py-2 rounded-full">
              <Text className="text-red-300 text-xs font-medium">
                🔴 OFFLINE
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* WebView Container */}
      <Animated.View
        className="flex-1 mx-3 my-6 rounded-2xl overflow-hidden border border-slate-700/50"
        style={animatedStyle}
      >
        <WebView
          source={{ uri: sketchfabUrl }}
          className="flex-1 bg-transparent"
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          androidLayerType="hardware"
          mixedContentMode="compatibility"
          originWhitelist={['*']}
          scalesPageToFit={false}
          bounces={false}
          scrollEnabled={false}
        />

        {/* Glass overlay for better aesthetics */}
        <View className="absolute inset-0 border border-slate-600/30 rounded-2xl pointer-events-none" />
      </Animated.View>

      {/* Floating Info Cards */}
      <Animated.View
        className="absolute bottom-20 left-4 bg-black/60 backdrop-blur-xl rounded-xl p-3 border border-slate-600/50"
        style={titleAnimatedStyle}
      >
        <Text className="text-white text-xs font-semibold mb-1">
          Orbital Velocity
        </Text>
        <Text className="text-blue-400 text-lg font-bold">27,600 km/h</Text>
      </Animated.View>

      <Animated.View
        className="absolute bottom-20 right-4 bg-black/60 backdrop-blur-xl rounded-xl p-3 border border-slate-600/50"
        style={titleAnimatedStyle}
      >
        <Text className="text-white text-xs font-semibold mb-1">Altitude</Text>
        <Text className="text-green-400 text-lg font-bold">408 km</Text>
      </Animated.View>
    </View>
  )
}
