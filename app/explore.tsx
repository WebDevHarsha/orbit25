import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import { Pressable, SafeAreaView, Text, View } from 'react-native'
import timelineData from '../assets/json/timeline.json'

interface TimelineItem {
  date: string
  title: string
  description: string
  image: string
}

// Image mapping using require() - the correct approach for React Native
const imageMap: { [key: string]: any } = {
  'img1.jpg': require('../assets/images/img1.jpg'),
  'img2.jpg': require('../assets/images/img2.jpg'),
  'img3.jpg': require('../assets/images/img3.jpg'),
  'img4.jpg': require('../assets/images/img4.jpg'),
  'img5.jpg': require('../assets/images/img5.jpg'),
  'img6.jpg': require('../assets/images/img6.jpg'),
  'img7.jpg': require('../assets/images/img7.jpg'),
  'img8.jpg': require('../assets/images/img8.jpg'),
  'img9.jpg': require('../assets/images/img9.jpg'),
  'img10.jpg': require('../assets/images/img10.jpg'),
  'img11.jpg': require('../assets/images/img11.jpg'),
  'img12.jpg': require('../assets/images/img12.jpg'),
  'img13.jpg': require('../assets/images/img13.jpg'),
  'img14.jpg': require('../assets/images/img14.jpg'),
  'img15.jpg': require('../assets/images/img15.jpg'),
  'img16.jpg': require('../assets/images/img16.jpg'),
  'img17.jpg': require('../assets/images/img17.jpg'),
  'img18.jpg': require('../assets/images/img18.jpg'),
  'img19.jpg': require('../assets/images/img19.jpg'),
  'img20.jpg': require('../assets/images/img20.jpg'),
  'img21.jpg': require('../assets/images/img21.jpg'),
  'img22.jpg': require('../assets/images/img22.jpg'),
  'img23.jpg': require('../assets/images/img23.jpg'),
  'img24.jpg': require('../assets/images/img24.jpg'),
  'img25.jpg': require('../assets/images/img25.jpg'),
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const TimelineItemComponent = React.memo(
  ({ item, index }: { item: TimelineItem; index: number }) => {
    const [expanded, setExpanded] = useState(false)
    const [imageError, setImageError] = useState(false)

    const imageSource = imageMap[item.image]

    return (
      <View className="px-6 mb-6">
        <View className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <View className="h-48 overflow-hidden bg-gray-800">
            {imageSource && !imageError ? (
              <Image
                source={imageSource}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                onError={(error) => {
                  console.log(`Image error for ${item.image}:`, error)
                  setImageError(true)
                }}
              />
            ) : (
              <View className="w-full h-full bg-gray-700 justify-center items-center">
                <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm mt-2">
                  {imageSource ? 'Loading failed' : 'Image not found'}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">{item.image}</Text>
              </View>
            )}
          </View>

          <View className="p-5">
            <Text className="text-gray-400 text-sm mb-2">
              {formatDate(item.date)}
            </Text>

            <Text className="text-white text-lg font-semibold mb-3 leading-6">
              {item.title}
            </Text>

            <Text
              className="text-gray-300 text-sm leading-6"
              numberOfLines={expanded ? undefined : 3}
            >
              {item.description}
            </Text>

            {item.description.length > 150 && (
              <Pressable
                onPress={() => setExpanded(!expanded)}
                className="mt-3"
              >
                <View className="flex-row items-center">
                  <Text className="text-white text-sm font-medium mr-2">
                    {expanded ? 'Show Less' : 'Read More'}
                  </Text>
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    )
  }
)

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="time" size={24} color="#FFFFFF" />
          <Text className="text-white text-2xl font-semibold ml-3">
            ISS Timeline
          </Text>
        </View>
        <Text className="text-gray-400 text-base leading-6">
          Key milestones in the International Space Station's journey
        </Text>
      </View>

      <FlashList
        data={timelineData as TimelineItem[]}
        renderItem={({ item, index }) => (
          <TimelineItemComponent item={item} index={index} />
        )}
        keyExtractor={(item, index) => `timeline-${index}-${item.date}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  )
}
