import FeaturedCard from '@/components/FeaturedCard';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types';
import { useUser } from '@clerk/expo';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function HomeScreen() {
    const { user } = useUser();
    const router = useRouter();

    const [featured, setFeatured] = useState<Property[]>([])
    const [recommended, setRecommended] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)


    const fetchProperties = async () => {
        try {
            setLoading(true)

            const { data: featuredData } = await supabase.from("properties").select("*").eq("is_featured", true).order("created_at", { ascending: false })
            const { data: recommendedData } = await supabase.from("properties").select("*").eq("is_featured", false).order("created_at", { ascending: false })

            setFeatured(featuredData ?? [])
            setRecommended(recommendedData ?? [])
            setLoading(false)
        } catch (error) {
            console.error("error while fetching properties", error);

        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchProperties();
        }, [])
    )

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <FlatList
                data={recommended}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className=''>
                        {/* header */}
                        <View className='flex-row items-center justify-between px-5 pt-4 pb-5'>
                            <Image
                                source={require("../../../assets/images/kribb.png")}
                                style={{ width: 90, height: 36 }}
                                resizeMode='contain'
                            />
                            <View className='items-end'>
                                <Text>Welcome </Text>
                                <Text className='text-gray-900 text-base font-bold'>
                                    {user?.firstName ?? "user"}
                                </Text>
                            </View>
                        </View>
                        {/* search bar */}
                        <TouchableOpacity
                            className='mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3'
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.06,
                                shadowRadius: 6,
                                elevation: 2
                            }}
                            onPress={() => router.push("/(root)/(tabs)/search")}>
                            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                            <Text className='text-gray-400 text-sm flex-1'>Search properties , cities...</Text>
                            <TouchableOpacity
                                className='w-8 h-8 bg-blue-600 rounded-xl items-center justify-center'
                                onPress={() => router.push("/(root)/(tabs)/search?openFilters=true")}>
                                <Ionicons name='options-outline' size={15} color="white" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        {/* featured section */}
                        <View className='mb-6'>
                            <Text className='text-gray-900 text-lg font-bold px-5 mb-4'>
                                Featured
                            </Text>
                            {loading ? (<ActivityIndicator size="small" color="#2563EB" className='py-10' />) :
                                (
                                    <FlatList
                                        data={featured}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => <FeaturedCard property={item}/>}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 20 }}
                                    />
                                )
                            }


                        </View>
                        <Text className='text-gray-900 text-lg font-bold px-5 mb-4 '>Recommended </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View className='px-5'>
                       <PropertyCard property={item}/>
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View className='items-center py-10'>
                            <Text className='text-gray-400'> No Properties Found </Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    )
}