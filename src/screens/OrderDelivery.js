import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {Ionicons} from "@expo/vector-icons";

import MapView from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useOrderContext } from "../context/OrderContext";
import BottomSheetDetails from "./BottomSheetDetails";
import CustomMarker from "../components/CustomMarker";
import { DataStore } from "aws-amplify";
import { Courier } from "../models";
import { useAuthContext } from "../context/AuthContext";
const OrderDelivery = () => {
  const { fetchOrder, order, user } = useOrderContext();
  const {dbCourier}=useAuthContext();

  const navigation = useNavigation();

  const mapRef = useRef();
  const restaurantLocation = {
    latitude: order?.Restaurant?.lat,
    longitude: order?.Restaurant?.lng,
  };

  const userLocation = {
    latitude: user?.lat,
    longitude: user?.lng,
  };

  const ORDER_STATUSES = {
    READY_FOR_PICKUP: "READY_FOR_PICKUP",
    ACCEPTED: "ACCEPTED",
    PICKED_UP: "PICKED_UP",
  };

  const { height, width } = useWindowDimensions();
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalminutes, setTotalMinutes] = useState(0);
  const [totalkm, setTotalKm] = useState(0);

  const route = useRoute();
  const id = route.params?.id;

  useEffect(() => {
    fetchOrder(id);
  }, [id]);


useEffect(() => {
 if(!driverLocation){
  return;
 }

 DataStore.save(Courier.copyOf(dbCourier,(updated)=>{
  updated.lat=driverLocation.latitude,
  updated.lng=driverLocation.longitude
 }))
}, [ ])




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

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 50,
      },
      //to keep track of location and update it as it move//
      (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );

    return foregroundSubscription;
  }, []);

  if (!driverLocation || !order || !user) {
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
    <View style={styles.container}>
      <MapView
        ref={mapRef}
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
        <MapViewDirections
          origin={driverLocation}
          destination={
            //now when order is collected show driver path from
            // restaurant to user to deliver//
            order.status === "ACCEPTED" ? restaurantLocation : userLocation
          }
          strokeWidth={10}
          strokeColor="#3FC060"
          apikey="AIzaSyDsFVwUif85ZWxgXvxlVhq_qYQvHrprOqE"
          //if driver accepted the order then show path from driver
          //to restaurant//
          waypoints={
            order.status === "READY_FOR_PICKUP" ? [restaurantLocation] : []
          }
          onReady={(result) => {
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />

        <CustomMarker data={order.Restaurant} type="RESTAURANT" />
        <CustomMarker data={user} type="USER" />
      </MapView>

      <BottomSheetDetails totalminutes={totalminutes} totalkm={totalkm} mapRef={mapRef} driverLocation={driverLocation}/>

      {order.status === "READY_FOR_PICKUP" && (
        <Ionicons
          name="arrow-back-circle"
          onPress={() => {
            navigation.goBack();
          }}
          size={45}
          color="black"
          style={{ position: "absolute", top: 40, left: 15 }}
        />
      )}
    </View>
  );
};

export default OrderDelivery;

const styles = StyleSheet.create({
  navigationIcon: {
    marginHorizontal: 30,
  },

  container: {
    backgroundColor: "lightblue",
    flex: 1,
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
