import React, { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from './src/navigation/NavigationContainer';
import { getDBConnection } from "services/database/db";

export default function App() {
  useEffect(() => {
    const init = async () => {
      await getDBConnection();
    };

    init();
  }, []);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
