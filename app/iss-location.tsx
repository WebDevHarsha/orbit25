import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'

interface ISSPosition {
  latitude: number
  longitude: number
  timestamp: number
}

const MapView = ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ISS Location</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          background: #000;
        }
        #map { 
          height: 100vh; 
          width: 100vw; 
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${latitude}, ${longitude}], 3);
        
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Esri'
        }).addTo(map);
        
        var issIcon = L.divIcon({
          className: 'iss-icon',
          html: '<div style="background: #3B82F6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px #3B82F6;"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        
        L.marker([${latitude}, ${longitude}], {icon: issIcon})
          .addTo(map)
          .bindPopup('International Space Station<br>Current Position');
      </script>
    </body>
    </html>
  `

  return (
    <WebView
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  )
}

export default function ISSLocationScreen() {
  const [position, setPosition] = useState<ISSPosition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchISSPosition = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://api.open-notify.org/iss-now.json')
      const data = await response.json()

      if (data.message === 'success') {
        setPosition({
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
          timestamp: data.timestamp,
        })
      } else {
        setError('Failed to fetch ISS position')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchISSPosition()
    const interval = setInterval(fetchISSPosition, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white text-lg mt-4">Loading ISS Position</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
          <Text className="text-white text-xl font-medium mt-4 mb-2">
            Connection Failed
          </Text>
          <Text className="text-gray-400 text-center mb-6">{error}</Text>

          <Pressable
            onPress={fetchISSPosition}
            className="bg-white px-6 py-3 rounded-lg"
          >
            <Text className="text-black font-medium">Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="location" size={24} color="#FFFFFF" />
          <Text className="text-white text-2xl font-semibold ml-3">
            ISS Current Location
          </Text>
        </View>
        <Text className="text-gray-400 text-base">
          Live tracking of the International Space Station
        </Text>
      </View>

      {/* Position Stats */}
      <View className="px-6 mb-4">
        <View className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-gray-400 text-sm mb-1">Latitude</Text>
              <Text className="text-white text-lg font-semibold">
                {position?.latitude.toFixed(4)}°
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-sm mb-1">Longitude</Text>
              <Text className="text-white text-lg font-semibold">
                {position?.longitude.toFixed(4)}°
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-sm mb-1">Updated</Text>
              <Text className="text-white text-lg font-semibold">Live</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Map */}
      <View className="flex-1 mx-6 mb-6">
        <View className="flex-1 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {position && (
            <MapView
              latitude={position.latitude}
              longitude={position.longitude}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
