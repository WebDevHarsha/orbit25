import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'

interface Astronaut {
  craft: string
  name: string
}

interface AstronautData {
  people: Astronaut[]
  number: number
  message: string
}

export default function AstronautsScreen() {
  const [astronautData, setAstronautData] = useState<AstronautData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAstronauts = async () => {
    try {
      const response = await fetch('http://api.open-notify.org/astros.json')
      const data = await response.json()

      if (data.message === 'success') {
        setAstronautData(data)
        setError(null)
      } else {
        setError('Failed to fetch astronaut data')
      }
    } catch (err) {
      setError('Failed to fetch astronaut data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchAstronauts()
  }

  useEffect(() => {
    fetchAstronauts()
  }, [])

  // Group astronauts by spacecraft
  const groupedAstronauts = astronautData?.people.reduce(
    (groups, astronaut) => {
      const craft = astronaut.craft
      if (!groups[craft]) {
        groups[craft] = []
      }
      groups[craft].push(astronaut)
      return groups
    },
    {} as Record<string, Astronaut[]>
  )

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white text-lg mt-4">Loading Astronauts</Text>
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
            onPress={fetchAstronauts}
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
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="people" size={24} color="#FFFFFF" />
            <Text className="text-white text-2xl font-semibold ml-3">
              Astronauts in Space
            </Text>
          </View>
          <Text className="text-gray-400 text-base leading-6">
            {astronautData?.number} people currently in space
          </Text>
        </View>

        {/* Stats Card */}
        <View className="px-6 mb-6">
          <View className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-400 text-sm mb-1">
                  Total Astronauts
                </Text>
                <Text className="text-white text-3xl font-bold">
                  {astronautData?.number}
                </Text>
              </View>
              <View className="bg-green-500/20 p-3 rounded-full">
                <Ionicons name="rocket" size={24} color="#10B981" />
              </View>
            </View>
          </View>
        </View>

        {/* Spacecraft Groups */}
        {groupedAstronauts &&
          Object.entries(groupedAstronauts).map(([craft, astronauts]) => (
            <View key={craft} className="px-6 mb-6">
              <Text className="text-white text-lg font-medium mb-4">
                {craft}
              </Text>

              <View className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                {astronauts.map((astronaut, index) => (
                  <View
                    key={`${astronaut.name}-${index}`}
                    className={`p-4 ${index !== astronauts.length - 1 ? 'border-b border-gray-800' : ''}`}
                  >
                    <View className="flex-row items-center">
                      <View className="bg-blue-500/20 p-2 rounded-full mr-3">
                        <Ionicons name="person" size={16} color="#3B82F6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-medium">
                          {astronaut.name}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                          Crew Member
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

        {/* Info Section */}
        <View className="px-6 pb-6">
          <Text className="text-white text-lg font-medium mb-4">
            About This Data
          </Text>
          <View className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <Text className="text-gray-300 text-sm leading-6">
              Real-time data from the Open Notify API showing all astronauts
              currently aboard spacecraft in Earth orbit and beyond. This
              includes crew members on the International Space Station and other
              active missions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
