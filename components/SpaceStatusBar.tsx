import React, { useEffect } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SpaceStatusBarProps {
  title?: string
  showLiveIndicator?: boolean
}

export default function SpaceStatusBar({
  title = 'NASA Explorer',
  showLiveIndicator = true,
}: SpaceStatusBarProps) {
  const insets = useSafeAreaInsets()
  const liveOpacity = useSharedValue(1)

  useEffect(() => {
    if (showLiveIndicator) {
      liveOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      )
    }
  }, [showLiveIndicator])

  const liveAnimatedStyle = useAnimatedStyle(() => ({
    opacity: liveOpacity.value,
  }))

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{title}</Text>
          {showLiveIndicator && (
            <View style={styles.liveContainer}>
              <Animated.View style={[styles.liveDot, liveAnimatedStyle]} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.time}>
            {new Date().toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Bottom Border */}
      <View style={styles.bottomBorder} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    position: 'relative',
    zIndex: 1000,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60A5FA',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 1,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#334155',
    marginHorizontal: 20,
  },
})
