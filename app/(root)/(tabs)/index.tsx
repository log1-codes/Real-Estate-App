import FeaturedCard from '@/components/FeaturedCard';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types';
import { useUser } from '@clerk/expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message;

    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
    ) {
        return error.message;
    }

    return fallback;
};

const normalizeProperties = (data: Property[] | null): Property[] => {
    if (!Array.isArray(data)) return [];

    return data.filter((property) => property && property.id);
};

export default function HomeScreen() {
    const { user } = useUser();
    const router = useRouter();

    const [featured, setFeatured] = useState<Property[]>([]);
    const [recommended, setRecommended] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [featuredError, setFeaturedError] = useState<string | null>(null);
    const [recommendedError, setRecommendedError] = useState<string | null>(null);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        setFeaturedError(null);
        setRecommendedError(null);

        try {
            const [featuredResponse, recommendedResponse] = await Promise.allSettled([
                supabase
                    .from('properties')
                    .select('*')
                    .eq('is_featured', true)
                    .order('created_at', { ascending: false }),

                supabase
                    .from('properties')
                    .select('*')
                    .eq('is_featured', false)
                    .order('created_at', { ascending: false }),
            ]);

            if (featuredResponse.status === 'fulfilled') {
                const { data, error } = featuredResponse.value;

                if (error) {
                    setFeatured([]);
                    setFeaturedError(getErrorMessage(error, 'Unable to load featured properties.'));
                } else {
                    setFeatured(normalizeProperties(data as Property[] | null));
                }
            } else {
                setFeatured([]);
                setFeaturedError(
                    getErrorMessage(
                        featuredResponse.reason,
                        'Unable to load featured properties.'
                    )
                );
            }

            if (recommendedResponse.status === 'fulfilled') {
                const { data, error } = recommendedResponse.value;

                if (error) {
                    setRecommended([]);
                    setRecommendedError(
                        getErrorMessage(error, 'Unable to load recommended properties.')
                    );
                } else {
                    setRecommended(normalizeProperties(data as Property[] | null));
                }
            } else {
                setRecommended([]);
                setRecommendedError(
                    getErrorMessage(
                        recommendedResponse.reason,
                        'Unable to load recommended properties.'
                    )
                );
            }
        } catch (error) {
            console.error('Error while fetching properties:', error);

            setFeatured([]);
            setRecommended([]);
            setFeaturedError('Unable to load featured properties.');
            setRecommendedError('Unable to load recommended properties.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProperties();
        }, [fetchProperties])
    );

    const hasAnyError = featuredError || recommendedError;

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <FlatList
                data={recommended}
                keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
                            <Image
                                source={require('../../../assets/images/kribb.png')}
                                style={{ width: 90, height: 36 }}
                                resizeMode="contain"
                            />

                            <View className="items-end">
                                <Text>Welcome</Text>
                                <Text className="text-gray-900 text-base font-bold">
                                    {user?.firstName ?? 'user'}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.06,
                                shadowRadius: 6,
                                elevation: 2,
                            }}
                            onPress={() => router.push('/(root)/(tabs)/search')}
                        >
                            <Ionicons name="search-outline" size={18} color="#9CA3AF" />

                            <Text className="text-gray-400 text-sm flex-1">
                                Search properties, cities...
                            </Text>

                            <TouchableOpacity
                                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center"
                                onPress={() =>
                                    router.push('/(root)/(tabs)/search?openFilters=true')
                                }
                            >
                                <Ionicons name="options-outline" size={15} color="white" />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        {hasAnyError ? (
                            <View className="mx-5 mb-5 rounded-2xl bg-red-50 px-4 py-3">
                                <Text className="text-red-700 font-semibold mb-1">
                                    Something went wrong
                                </Text>

                                {featuredError ? (
                                    <Text className="text-red-500 text-sm">{featuredError}</Text>
                                ) : null}

                                {recommendedError ? (
                                    <Text className="text-red-500 text-sm">
                                        {recommendedError}
                                    </Text>
                                ) : null}

                                <TouchableOpacity
                                    className="self-start mt-3 bg-red-600 rounded-xl px-4 py-2"
                                    onPress={fetchProperties}
                                >
                                    <Text className="text-white font-semibold">Try again</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        <View className="mb-6">
                            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                                Featured
                            </Text>

                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#2563EB"
                                    className="py-10"
                                />
                            ) : featuredError ? (
                                <View className="px-5 py-6">
                                    <Text className="text-gray-400">
                                        Featured properties are unavailable right now.
                                    </Text>
                                </View>
                            ) : featured.length > 0 ? (
                                <FlatList
                                    data={featured}
                                    keyExtractor={(item, index) =>
                                        item?.id?.toString() ?? index.toString()
                                    }
                                    renderItem={({ item }) => (
                                        <FeaturedCard property={item} />
                                    )}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 20 }}
                                />
                            ) : (
                                <View className="px-5 py-6">
                                    <Text className="text-gray-400">
                                        No featured properties found.
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                            Recommended
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View className="px-5">
                        <PropertyCard property={item} />
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center py-10 px-5">
                            <Text className="text-gray-400 text-center">
                                {recommendedError
                                    ? 'Recommended properties are unavailable right now.'
                                    : 'No properties found.'}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}