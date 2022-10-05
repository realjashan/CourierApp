import { createContext, useContext, useEffect, useState } from "react";
import {  DataStore } from "aws-amplify";
import {   Order, OrderDish, User } from "../models";
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();


  useEffect(() => {
    if (!order) {
      return;
    }

   const subscription= DataStore.observe(Order, order.id).subscribe(({opType,element}) => {
     if(opType ==="UPDATE"){
      console.log(element.id);
    

      
    
     }
    });

  return ()=>subscription.unsubscribe();
  }, [order?.id]);


  const AcceptOrder = () => {
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "ACCEPTED";
        updated.Courier = dbCourier;
      })
    ).then(setOrder);
  };

  const pickUpOrder = () => {
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "PICKED_UP";
      })
    ).then(setOrder);
  };

  const completeOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "COMPLETED";
      })
    );
    setOrder(updatedOrder);
  };

  const fetchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }

    const fetchedOrder = await DataStore.query(Order, id);
    setOrder(fetchedOrder);

    DataStore.query(User, fetchedOrder.userID).then(setUser);

    DataStore.query(OrderDish, (od) => od.orderID("eq", fetchedOrder.id)).then(
      setDishes
    );
  };



  return (
    <OrderContext.Provider
      value={{
        AcceptOrder,
        order,
        fetchOrder,
        user,
        dishes,
        completeOrder,
        pickUpOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
