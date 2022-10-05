import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { Courier, TransportationModes } from "../models";
import { useAuthContext } from "../context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const Profile = () => {
  const navigation = useNavigation();

  const { sub, setDbCourier, dbCourier } = useAuthContext();

  const [name, setName] = useState(dbCourier?.name || "");
 
  const [loading, setLoading] = useState("");
  const [transportationMode, setTransportationMode] = useState(
    TransportationModes.DRIVING
  );

  const updateCourier = async () => {
    try {
      const courier = await DataStore.save(
        Courier.copyOf(dbCourier, (updated) => {
          updated.name = name,
          updated.transportationMode = transportationMode;
        })
      );
      setDbCourier(courier);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  // const createCourier = async () => {
  //   try {
  //     const courier = await DataStore.save(
  //       new Courier({
  //         name,
  //         transportationMode,
  //         sub,
  //       })
  //     );
  //     setDbCourier(courier);
  //     console.log(courier);
  //   } catch (e) {
  //     Alert.alert("Error", e.message);
  //   }
  // };

  const createCourier = async () => {
    try {
      const courier = await DataStore.save(
        new Courier({
          name,
          sub,
          transportationMode,
        })
      );
      setDbCourier(courier);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const onSave = async () => {
    if (dbCourier) {
      await updateCourier();
    } else {
      await createCourier();
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            setTransportationMode(TransportationModes.BICYCLING);
          }}
          style={{
            margin: 10,
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "gray",
            backgroundColor:
              transportationMode === TransportationModes.BICYCLING
                ? "#3FC060"
                : "white",
          }}
        >
          <MaterialIcons name="pedal-bike" size={40} color={"black"} />
        </Pressable>
        <Pressable
          onPress={() => {
            setTransportationMode(TransportationModes.DRIVING);
          }}
          style={{
            margin: 10,
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "gray",
            backgroundColor:
              transportationMode === TransportationModes.DRIVING
                ? "#3FC060"
                : "white",
          }}
        >
          <FontAwesome5 name="car" size={40} color="black" />
        </Pressable>
      </View>
      <Button onPress={onSave} title={!dbCourier ? "Save" : "Update"} />
      <Text
        onPress={() => {
          Auth.signOut(), setLoading(true);
        }}
        style={{ textAlign: "center", color: "red", margin: 10 }}
      >
        {loading ? <Text> Signing Out....</Text> : <Text> Sign Out</Text>}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
