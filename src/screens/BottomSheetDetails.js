import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import { useOrderContext } from "../context/OrderContext";


const STATUS_TO_TITLE={
  READY_FOR_PICKUP:"Accept Order",
  ACCEPTED:"Collect Order",
  PICKED_UP:"Complete Delivery",


}

const BottomSheetDetails = (props) => {
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const bottomSheetRef = useRef(null);
  const {
    AcceptOrder,

    order,
    user,
    dishes,
    completeOrder,
    pickUpOrder,
  } = useOrderContext();

  const { totalkm, totalminutes ,mapRef,driverLocation} = props;

  const isdriverclose = totalkm <= 1;

  const navigation = useNavigation();

  const onButtonPressed = async () => {

const {status}=order;

    if (status === "READY_FOR_PICKUP") {
      bottomSheetRef.current.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      AcceptOrder();
    }

    if (status === "ACCEPTED") {
      bottomSheetRef.current.collapse();
      pickUpOrder();
    }

    if (status === "PICKED_UP") {
      await completeOrder();
      bottomSheetRef.current.collapse();
      navigation.goBack();
    }
  };

  const isButtonDisable = () => {
    if (order.status === "READY_FOR_PICKUP") {
      return false;
    }

    //this means drive is close to restaurant//
    if (order.status === "ACCEPTED" && isdriverclose) {
      return false;
    }
    //this means driver is close to the user
    if (order.status === "PICKED_UP" && isdriverclose) {
      return false;
    } else {
      return true;
    }
  };



  

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "gray", width: 100 }}
    >
      <View style={styles.handleIndicatorContainer}>
        <Text style={{ fontSize: 25 }}>{totalminutes.toFixed(0)} min</Text>

        <FontAwesome5
          name="shopping-bag"
          size={25}
          color="#3FC060"
          style={styles.navigationIcon}
        />
        <Text style={{ fontSize: 25 }}>{totalkm.toFixed(2)} km</Text>
      </View>

      <View style={{ paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 25, paddingVertical: 20 }}>
          {order.Restaurant.name}
        </Text>

        <View style={styles.shoppingStore}>
          <Fontisto name="shopping-store" size={22} color="gray" />

          <Text style={styles.userAddress}>{order.Restaurant.address}</Text>
        </View>

        <View style={styles.shoppingMarkerIconContainer}>
          <FontAwesome5 name="map-marker-alt" size={30} color="gray" />

          <Text style={styles.userAddress}>{user?.address}</Text>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderColor: "lightgray",
            paddingTop: 10,
          }}
        >
          {dishes?.map((Dishitem) => (
            <Text style={styles.orderText} key={Dishitem.id}>
              {Dishitem.Dish.name} -{Dishitem.quantity}
            </Text>
          ))}
        </View>
      </View>

      <Pressable
        style={{
          ...styles.button,
          backgroundColor: isButtonDisable() ? "gray" : "#3FC060",
        }}
        onPress={onButtonPressed}
        disabled={isButtonDisable()}
      >
        <Text style={styles.buttonText}>{STATUS_TO_TITLE[order.status]}</Text>
      </Pressable>
    </BottomSheet>
  );
};

export default BottomSheetDetails;

const styles = StyleSheet.create({
  navigationIcon: {
    marginHorizontal: 30,
  },

  
  handleIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    paddingVertical: 15,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "500",
  },
  button: {
    marginTop: "auto",
    marginVertical: 30,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  orderText: {
    fontSize: 18,
    color: "gray",
    fontWeight: "500",
    marginBottom: 5,
  },

  shoppingMarkerIconContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  userAddress: {
    fontSize: 20,
    color: "gray",
    fontWeight: "500",
    marginLeft: 15,
  },
  shoppingStore: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
 
});
