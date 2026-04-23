import { StyleSheet, Text, TouchableOpacity, Image, View, Platform } from 'react-native';
import { vh, vw } from 'react-native-expo-viewport-units';
import gooogleSignin from "../assets/googleg.png";

export default function GoogleAuthButtonDummy({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={gooogleSignin} style={{ height: 23, width: 23 }} />
        <Text style={styles.text}>Sign in with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f2f2f2",
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    borderRadius: vh(1.5),
    width: vw(65),
  },
  text: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "black",
    textAlign: "center",
    marginLeft: 10,
  },
});
