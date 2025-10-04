import React, { useEffect } from 'react'
import { Dimensions, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

// Memoized Star component for better performance
const Star = React.memo(({ delay = 0 }: { delay?: number }) => {
  const twinkle = useSharedValue(0.3)

  useEffect(() => {
    twinkle.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1500 + delay * 100,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0.3, {
          duration: 1500 + delay * 100,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      true
    )
  }, [delay])

  const starStyle = useAnimatedStyle(() => ({
    opacity: twinkle.value,
  }))

  return (
    <Animated.View
      className="absolute w-0.5 h-0.5 bg-white rounded-full"
      style={[
        starStyle,
        {
          left: Math.random() * width,
          top: Math.random() * height,
        },
      ]}
    />
  )
})

interface SpaceBackgroundProps {
  starCount?: number
  animated?: boolean
}

export default function SpaceBackground({
  starCount = 80,
  animated = true,
}: SpaceBackgroundProps) {
  return (
    <View className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Nebula-like gradient overlay */}
      <View className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-purple-900/20" />

      {/* Animated Stars */}
      {animated &&
        [...Array(starCount)].map((_, i) => <Star key={i} delay={i} />)}

      {/* Static Stars for performance */}
      {!animated &&
        [...Array(starCount)].map((_, i) => (
          <View
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
            style={{
              left: Math.random() * width,
              top: Math.random() * height,
            }}
          />
        ))}

      {/* Large decorative elements */}
      <View className="absolute top-20 right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      <View className="absolute bottom-40 left-8 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
      <View className="absolute top-1/2 left-1/3 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl" />
    </View>
  )
}
