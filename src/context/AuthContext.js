import { createContext, useContext, useEffect, useState } from "react";
import { Auth, DataStore } from "aws-amplify";
import { Courier } from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbCourier, setDbCourier] = useState(null);
  const [loading, setLoading] = useState(true);

  //comes from CurrentAuthenticatedUser//
  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  }, []);

  //to prevent pooping of profile screen everytym on refresh//

  // useEffect(() => {
  //   if (!sub) {
  //     return;
  //   }

  //   DataStore.query(Courier, (courirer) => courirer.sub("eq", sub)).then(
  //     (courirers) => setDbCourier(courirers[0])
  //   );
  //   setLoading(false);
  // }, [sub]);
  useEffect(() => {
    if (!sub) {
      return;
    }
    DataStore.query(Courier, (courier) => courier.sub("eq", sub)).then(
      (couriers) => {
        setDbCourier(couriers[0]);
        setLoading(false);
      }
    );
  }, [sub]);



  console.log(dbCourier);

useEffect(() => {
 if(!dbCourier){
  return
 }

 const subscription=DataStore.observe(Courier,dbCourier.id).subscribe(msg=>{
  if(msg.opType==="UPDATED"){
    setDbCourier(msg.element);
  }
 })

 return ()=> subscription.unsubscribe();
}, [dbCourier])




  return (
    <AuthContext.Provider
      value={{ authUser, dbCourier, sub, setDbCourier, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

//instead of importing useContext everyTym ,just send it as://
export const useAuthContext = () => useContext(AuthContext);
