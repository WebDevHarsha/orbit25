import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, Switch, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Position {
  latitude: number
  longitude: number
}

// Haversine formula to compute distance in kilometers
const haversineKm = (a: Position, b: Position) => {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371 // Earth radius km
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const sinDlat = Math.sin(dLat / 2)
  const sinDlon = Math.sin(dLon / 2)
  const aa =
    sinDlat * sinDlat + sinDlon * sinDlon * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa))
  return R * c
}

export default function ISSNearMeScreen() {
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null)
  const [hasNotificationPermission, setHasNotificationPermission] = useState<
    boolean | null
  >(null)
  const [userPos, setUserPos] = useState<Position | null>(null)
  const [issPos, setIssPos] = useState<Position | null>(null)
  const [loading, setLoading] = useState(true)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [thresholdKm, setThresholdKm] = useState(500) // default proximity threshold

  const pollRef = useRef<number | null>(null)

  useEffect(() => {
    ;(async () => {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync()
      setHasLocationPermission(status === 'granted')

      // Request notifications permission
      const { status: nStatus } = await Notifications.requestPermissionsAsync()
      setHasNotificationPermission(nStatus === 'granted')

      if (status !== 'granted') {
        setLoading(false)
        return
      }

      // get current location
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        })
        setUserPos({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        })
      } catch (e) {
        console.warn('Failed to get location', e)
      }

      setLoading(false)

      // start polling ISS position
      pollISS()
      pollRef.current = setInterval(pollISS, 10000) as unknown as number
    })()

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // if both positions are available and alerts enabled, check distance
    if (userPos && issPos && alertsEnabled) {
      const km = haversineKm(userPos, issPos)
      if (km <= thresholdKm) {
        sendNotification(km)
      }
    }
  }, [userPos, issPos, alertsEnabled, thresholdKm])

  const pollISS = async () => {
    try {
      const res = await fetch('http://api.open-notify.org/iss-now.json')
      const data = await res.json()
      if (data?.message === 'success') {
        const lat = parseFloat(data.iss_position.latitude)
        const lon = parseFloat(data.iss_position.longitude)
        setIssPos({ latitude: lat, longitude: lon })
      }
    } catch (e) {
      console.warn('ISS fetch failed', e)
    }
  }

  const sendNotification = async (distanceKm: number) => {
    // Only send if notification permission was granted
    if (!hasNotificationPermission) return

    // Schedule an immediate local notification
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'ISS Nearby',
          body: `The ISS is ${Math.round(distanceKm)} km away from you. Look up!`,
          data: { near: true },
        },
        trigger: null,
      })
    } catch (e) {
      console.warn('Notification failed', e)
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white text-lg mt-4">Getting ready…</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="location" size={24} color="#FFFFFF" />
          <Text className="text-white text-2xl font-semibold ml-3">
            ISS Near Me
          </Text>
        </View>
        <Text className="text-gray-400 text-base leading-6">
          Get notified when the ISS is near you
        </Text>
      </View>

      <View className="px-6">
        <View className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg">Alerts</Text>
            <Switch value={alertsEnabled} onValueChange={setAlertsEnabled} />
          </View>

          <Text className="text-gray-400 mb-2">
            Proximity threshold: {thresholdKm} km
          </Text>
          <View className="flex-row">
            <Pressable
              onPress={() => setThresholdKm((v) => Math.max(50, v - 50))}
              className="bg-gray-800 px-4 py-2 rounded-md mr-3"
            >
              <Text className="text-white">-50</Text>
            </Pressable>
            <Pressable
              onPress={() => setThresholdKm((v) => v + 50)}
              className="bg-gray-800 px-4 py-2 rounded-md"
            >
              <Text className="text-white">+50</Text>
            </Pressable>
          </View>
        </View>

        <View className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <Text className="text-gray-400 mb-2">Your location</Text>
          {userPos ? (
            <Text className="text-white">
              {userPos.latitude.toFixed(4)}°, {userPos.longitude.toFixed(4)}°
            </Text>
          ) : (
            <Text className="text-red-400">Location not available</Text>
          )}

          <Text className="text-gray-400 mt-4 mb-2">ISS position</Text>
          {issPos ? (
            <Text className="text-white">
              {issPos.latitude.toFixed(4)}°, {issPos.longitude.toFixed(4)}°
            </Text>
          ) : (
            <Text className="text-red-400">ISS position not available</Text>
          )}

          {userPos && issPos && (
            <Text className="text-gray-300 mt-4">
              Distance: {haversineKm(userPos, issPos).toFixed(1)} km
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
