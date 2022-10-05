import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { User } from "../models";

const OrderItem = ({ order }) => {
  const navigation = useNavigation();
const [user,setUser]=useState();
  //in backend we have given order the relation to restaurant but
  //for user its user to order relation so user have to fetched
  //as//

useEffect(() => {
 DataStore.query(User,order.userID).then(setUser)
},  [])



  return (
    <Pressable
      onPress={() => {
        navigation.navigate("OrdersDeliveryScreen", {
          id: order.id,
        });
      }}
      style={{
        flexDirection: "row",
        borderColor: "#3FC060",
        borderWidth: 2,
        margin: 10,
        borderRadius: 12,
      }}
    >
      <Image
        source={{ uri: order.Restaurant.image }}
        style={{ height: "100%", width: "25%", borderRadius: 10 }}
      />
      <View style={{ marginLeft: 10, width: "65%", paddingVertical: 5 }}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>
          {order.Restaurant.name}
        </Text>
        <Text style={{ color: "gray" }}>{order.Restaurant.address}</Text>

        <Text style={{ marginTop: 10 }}>Delivery Details:</Text>

        <Text style={{ color: "gray" }}>{user?.name}</Text>
        <Text style={{ color: "gray" }}>{user?.address}</Text>
      </View>

      <View
        style={{
          backgroundColor: "#3FC060",
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Entypo
          name="check"
          size={30}
          color="white"
          style={{ marginLeft: "auto" }}
        />
      </View>
    </Pressable>
  );
};

export default OrderItem;

const styles = StyleSheet.create({});
