import React, { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from './src/navigation/NavigationContainer';
import { getDBConnection } from "services/database/db";
import {GestureHandlerRootView,} from "react-native-gesture-handler";

export default function App() {
  useEffect(() => {
    const init = async () => {
      await getDBConnection();
    };

    init();
  }, []);

  return (
    <PaperProvider>
      <GestureHandlerRootView>
        <AppNavigator />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
