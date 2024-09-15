import { Button, Linking, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { AccessToken, LoginButton, LoginResult } from 'react-native-fbsdk-next';

export default function TabOneScreen() {

  const onLoginFinished = async (err: Record<string, unknown>, result: LoginResult) => {
    const data = await AccessToken.getCurrentAccessToken();
    const accessToken = data?.accessToken.toString();
    fetch(`https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${accessToken}`).then(res => res.json()).then(userData => {
      console.log(userData)
    })

  }

  return (
    <View style={styles.container}>
      <Link push href="/home/hello" style={{color: "white", fontWeight: "bold", marginVertical: 10}} >
        Hello!!!!
      </Link>
      <LoginButton onLoginFinished={onLoginFinished} onLogoutFinished={() => console.log("User logged out")} />
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
