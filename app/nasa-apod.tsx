import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'

interface APODData {
  copyright?: string
  date: string
  explanation: string
  hdurl?: string
  media_type: 'image' | 'video'
  service_version: string
  title: string
  url: string
}

export default function NASAAPODScreen() {
  const [apodData, setApodData] = useState<APODData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const fetchAPOD = async () => {
    try {
      setLoading(true)
      setError(null)
      setImageError(false)
      setImageLoading(true)

      const apiKey = process.env.EXPO_PUBLIC_NASA_API_KEY || 'DEMO_KEY'
      const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`

      console.log('Fetching APOD from:', url.replace(apiKey, 'HIDDEN_KEY'))

      const response = await fetch(url)
      const data = await response.json()

      console.log('APOD API Response:', {
        status: response.status,
        hasError: !!data.error,
        mediaType: data.media_type,
        hasUrl: !!data.url,
        urlLength: data.url?.length,
        title: data.title,
        date: data.date,
      })

      if (__DEV__) {
        console.log('Full APOD image URL:', data.url)
      }

      if (data.error) {
        setError(data.error.message || 'Failed to fetch NASA APOD')
      } else {
        setApodData(data)
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('APOD fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAPOD()
  }, [])

  // Reset image states when APOD data changes
  useEffect(() => {
    if (apodData) {
      setImageLoading(true)
      setImageError(false)
    }
  }, [apodData?.url])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white text-lg mt-4">
            Loading Picture of the Day
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !apodData) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
          <Text className="text-white text-xl font-medium mt-4 mb-2">
            Connection Failed
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            {error || 'No data available'}
          </Text>

          <Pressable
            onPress={fetchAPOD}
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-gray-400 text-sm mb-1">
            {formatDate(apodData.date)}
          </Text>
          <Text className="text-white text-2xl font-semibold leading-8 mb-2">
            {apodData.title}
          </Text>
          {apodData.copyright && (
            <View className="flex-row items-center">
              <Ionicons name="camera-outline" size={16} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-2">
                {apodData.copyright.trim()}
              </Text>
            </View>
          )}
        </View>

        {/* Image */}
        {apodData.media_type === 'image' ? (
          <View className="mx-6 mb-6">
            <View className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 relative">
              {/* Loading State */}
              {imageLoading && (
                <View className="absolute inset-0 bg-gray-800 justify-center items-center z-10">
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text className="text-white text-sm mt-2">
                    Loading image...
                  </Text>
                </View>
              )}

              {/* Error State */}
              {imageError && (
                <View className="w-full h-64 bg-gray-800 justify-center items-center">
                  <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-400 text-sm mt-2">
                    Failed to load image
                  </Text>
                  <Pressable
                    onPress={() => {
                      setImageError(false)
                      setImageLoading(true)
                    }}
                    className="mt-2 bg-gray-700 px-3 py-1 rounded"
                  >
                    <Text className="text-white text-xs">Retry</Text>
                  </Pressable>
                </View>
              )}

              {/* Actual Image */}
              {!imageError && (
                <Image
                  source={{ uri: apodData.url }}
                  style={{ width: '100%', height: 256 }}
                  contentFit="cover"
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                  onLoadStart={() => {
                    setImageLoading(true)
                    setImageError(false)
                    console.log('APOD image loading started:', apodData.url)
                  }}
                  onLoad={() => {
                    setImageLoading(false)
                    console.log('APOD image loaded successfully')
                  }}
                  onError={(error) => {
                    setImageLoading(false)
                    setImageError(true)
                    console.log(
                      'APOD image error:',
                      error,
                      'URL:',
                      apodData.url
                    )
                  }}
                />
              )}
            </View>

            {/* Image Info */}
            <View className="mt-3 px-2">
              <Text className="text-gray-500 text-xs">
                Source: {apodData.url}
              </Text>
              {apodData.hdurl && (
                <Text className="text-gray-500 text-xs mt-1">
                  HD version available
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View className="mx-6 mb-6">
            <View className="bg-gray-900 h-64 rounded-xl border border-gray-800 justify-center items-center">
              <Ionicons name="play-circle-outline" size={64} color="#9CA3AF" />
              <Text className="text-white text-lg font-medium mt-4">
                Video Content
              </Text>
              <Text className="text-gray-400 text-sm">
                Available on NASA website
              </Text>
            </View>
          </View>
        )}

        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-medium mb-4">
            Description
          </Text>
          <View className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <Text className="text-gray-300 text-sm leading-6">
              {apodData.explanation}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
