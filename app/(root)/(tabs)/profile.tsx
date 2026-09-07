import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const { signOut } = useAuth();
  const handleSignout = async ()=>{
    try {
      await signOut();
      router.replace("/sign-in")
    } catch (error) {
      console.error("Error signing out", error);
      
    }
  }
  return (
    <SafeAreaView>
      <View>
        <Text>Profile</Text>
        <TouchableOpacity onPress={handleSignout}>
          <Text>SignOut</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  )
}