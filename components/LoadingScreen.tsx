import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

interface LoadingScreenProps {
  message?: string
  subtitle?: string
}

export default function LoadingScreen({
  message = 'Loading...',
  subtitle = 'Preparing your NASA experience',
}: LoadingScreenProps) {
  const rotation = useSharedValue(0)
  const scale = useSharedValue(0.8)
  const opacity = useSharedValue(0.5)

  useEffect(() => {
    // Rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    )

    // Pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(0.8, { duration: 1000 })
      ),
      -1,
      true
    )

    // Opacity animation
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <View style={styles.container}>
      {/* Animated Background Stars */}
      <View style={styles.starsContainer}>
        {[...Array(30)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * 400,
                top: Math.random() * 800,
                opacity: Math.random() * 0.8 + 0.2,
                transform: [{ scale: Math.random() * 0.5 + 0.5 }],
              },
            ]}
          />
        ))}
      </View>

      {/* Loading Icon */}
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Text style={styles.icon}>🛰️</Text>
      </Animated.View>

      {/* Loading Text */}
      <View style={styles.textContainer}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                opacity: opacity.value,
                transform: [{ scale: scale.value }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1426',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  iconContainer: {
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  message: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#60A5FA',
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#60A5FA',
  },
})
