import * as React from 'react';
import {AppNavigator} from './src/app.navigator.tsx';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <AppNavigator />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default App;
