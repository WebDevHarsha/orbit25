import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useRef, useState } from 'react'
import { Animated, Dimensions, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import timelineData from '../assets/json/timeline.json'

const { height } = Dimensions.get('window')

interface TimelineItem {
  date: string
  title: string
  description: string
  image: string
}

// Static image mapping
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

const ITEM_HEIGHT = 320 // estimated height per item (adjust if needed)

const TimelineItemComponent = ({ item }: { item: TimelineItem }) => {
  const [imageError, setImageError] = useState(false)

  const imageSource = imageMap[item.image]

  return (
    <View className="mb-8 relative px-6" style={{ minHeight: ITEM_HEIGHT }}>
      <View className="flex-row">
        <View style={{ width: 56 }} className="items-center">
          {/* spacer for the single moving dot; per-item markers removed */}
        </View>

        <View className="flex-1">
          <View className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <View className="h-48 overflow-hidden bg-gray-800">
              {imageSource && !imageError ? (
                <Image
                  source={imageSource}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <View className="w-full h-full bg-gray-700 justify-center items-center">
                  <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-400 text-sm mt-2">
                    {imageSource ? 'Loading failed' : 'Image not found'}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {item.image}
                  </Text>
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

              <Text className="text-gray-300 text-sm leading-6">
                {item.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default function ExploreScreen() {
  const scrollY = useRef(new Animated.Value(0)).current

  const contentHeight = Math.max(1, timelineData.length * ITEM_HEIGHT)
  const maxScroll = Math.max(1, contentHeight - height)

  // SPEED_FACTOR: >1 = faster (dot reaches end sooner), <1 = slower
  const SPEED_FACTOR = 0.47
  const effectiveMaxScroll = Math.max(1, maxScroll / SPEED_FACTOR)

  // Dot travel range (px)
  const DOT_START = 40
  const DOT_END = Math.max(40, height - 300)

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-6  pb-4">
        <Text className="text-gray-400 text-base leading-6">
          Key milestones in the ISS's journey
        </Text>
      </View>

      <View className="flex-1 relative">
        {/* Continuous timeline line */}
        <View className="absolute left-10 top-0 bottom-0 w-1 bg-blue-700 opacity-60 z-10" />

        <Animated.ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20, paddingBottom: 80 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={16}
        >
          {timelineData.map((item: TimelineItem, index: number) => (
            <TimelineItemComponent key={index} item={item} />
          ))}

          <View className="items-center mt-12 mb-8 px-6">
            <View className="w-8 h-8 bg-blue-500 rounded-full border-4 border-gray-900 shadow-lg" />
            <Text className="text-base text-gray-500 mt-4 font-medium">
              Timeline Complete
            </Text>
          </View>
        </Animated.ScrollView>

        {/* Moving dot (explicit styles so it's always visible) */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: 36,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#60A5FA', // blue-400
              borderWidth: 2,
              borderColor: '#000',
              zIndex: 20,
              elevation: 6,
            },
            {
              top: scrollY.interpolate({
                inputRange: [0, effectiveMaxScroll],
                // use DOT_START/DOT_END and the SPEED_FACTOR via effectiveMaxScroll
                outputRange: [DOT_START, DOT_END],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </View>
    </SafeAreaView>
  )
}
