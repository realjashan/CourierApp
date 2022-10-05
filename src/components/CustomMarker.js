import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Marker } from "react-native-maps";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

const CustomMarker = ({ data, type }) => {
  return (
    <Marker
      coordinate={{
        latitude: data.lat,
        longitude: data.lng,
      }}
      title={data.name}
      description={data.address}
    >
      <View style={styles.marker}>
        {type === "RESTAURANT" ? (
          <Entypo name="shop" size={24} color="white" />
        ) : (
          <MaterialIcons name="restaurant" size={30} color="white" />
        )}
      </View>
    </Marker>
  );
};

export default CustomMarker;

const styles = StyleSheet.create({
    shoppingMarkerIconContainer: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "center",
      },
      marker: {
        backgroundColor: "green",
        padding: 5,
        borderRadius: 20,
      },


});
