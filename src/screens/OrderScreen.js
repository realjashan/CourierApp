import {
  ActivityIndicator,
 
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";

import OrderItem from "../components/OrderItem";
import MapView, { Marker } from "react-native-maps";
 
import { DataStore } from "aws-amplify";
import { Order } from "../models";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import CustomMarker from "../components/CustomMarker";
import * as Location from "expo-location";
 

const OrderScreen = () => {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["12%", "95%"], []);

  const { height, width } = useWindowDimensions();
  const [orders, setOrders] = useState([]);

  const [driverLocation, setDriverLocation] = useState(null);

  const fetchOrders = () => {
    DataStore.query(Order, (o) => o.status("eq", "READY_FOR_PICKUP")).then(
      setOrders
    );
  };
  useEffect(() => {
    fetchOrders();
    const subscription = DataStore.observe(Order).subscribe((msg) => {
      if (msg.opType === "UPDATE") {
        fetchOrders();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        console.log("Nonono");
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  if (!driverLocation) {
    return (
      <ActivityIndicator
        size={"large"}
        color="gray"
        style={{
          alignItems: "center",

          marginVertical: 300,
        }}
      />
    );
  }

  return (
    <View style={{ backgroundColor: "lightblue", flex: 1 }}>
      <MapView
        style={{
          height,
          width,
        }}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        followsUserLocation
      >
        {orders.map((order) => (
          <CustomMarker
            data={order.Restaurant}
            type="RESTAURANT"
            key={order.id}
          />
        ))}
      </MapView>

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", paddingBottom: 5 }}>
            You're Online
          </Text>
          <Text style={{ color: "gray" }}>
            Available Orders:{orders.length}
          </Text>
        </View>

        <BottomSheetFlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  marker: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 20,
  },
});
