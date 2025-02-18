import React from 'react';
import {Text} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux/store';
import {QueryClient, QueryClientProvider} from 'react-query';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import MovieList from './src/screens/MovieList';
import ShortlistedMovies from './src/screens/ShortlistedMovies';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <Tab.Screen
                name="Movies"
                component={MovieList}
                options={{
                  tabBarLabel: 'Movie List',
                  tabBarIcon: () => <Text>🎬</Text>,
                }}
              />
              <Tab.Screen
                name="Shortlisted"
                component={ShortlistedMovies}
                options={{
                  tabBarLabel: 'Shortlisted',
                  tabBarIcon: () => <Text>❤️</Text>,
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
