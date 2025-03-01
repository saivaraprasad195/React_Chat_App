import { createContext, useContext, useState } from "react";

const DisplayContext = createContext();

export const DisplayContextProvider = ({ children }) => {
  const [show, setShow] = useState();
  const values = {
    show,
    setShow,
  };

  return (
    <DisplayContext.Provider value={values}>{children}</DisplayContext.Provider>
  );
};

export default useDisplay = () => useContext(DisplayContext);
