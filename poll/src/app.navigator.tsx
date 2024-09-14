import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {EventsScreen} from './screens/events/events.screen.tsx';
import {PollScreen} from './screens/poll/poll.screen.tsx';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {CreateUserScreen} from './screens/init/createUser.screen.tsx';
import {NavigationType, RootStackParamList} from './navigation.type.ts';
import {UserProfileScreen} from './screens/profile/profile.screen.tsx';
import {useHasHydrated, useUser} from './store/user/hook.ts';
import {OnboardScreen} from './screens/init/onboard.screen.tsx';
import {LoginScreen} from './screens/init/login.screen.tsx';
import {
  faFeather,
  faHand,
  faList,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {MineScreen} from './screens/mine/mine.screen.tsx';
import {MyApplicationsScreen} from './screens/mine/myApplications/myApplications.screen.tsx';
import {MyEventsScreen} from './screens/mine/myEvents/myEvents.screen.tsx';
import {ApplicationScreen} from './screens/mine/application.screen.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#34495e',
      }}>
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          headerTitle: 'Events',
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesomeIcon
                icon={faList}
                color={focused ? '#34495e' : '#ccc'}
                size={20}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Mine"
        component={MineScreen}
        options={{
          headerTitle: 'My events / applications',
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesomeIcon
                icon={faFeather}
                color={focused ? '#34495e' : '#ccc'}
                size={20}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Poll"
        component={PollScreen}
        options={{
          headerTitle: 'Poll',
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesomeIcon
                icon={faHand}
                color={focused ? '#34495e' : '#ccc'}
                size={20}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          headerTitle: 'Profile',
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesomeIcon
                icon={faUser}
                color={focused ? '#34495e' : '#ccc'}
                size={20}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const user = useUser();
  const _hasHydrated = useHasHydrated();

  const [initialRouteName, setInitialRouteName] = useState<
    keyof RootStackParamList | undefined
  >(undefined);

  useEffect(() => {
    if (!_hasHydrated) {
      return;
    } else {
      if (user.name !== undefined) {
        setInitialRouteName('Home');
      } else {
        setInitialRouteName('Onboard');
      }
    }
  }, [_hasHydrated, user]);

  if (!_hasHydrated || !initialRouteName) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{headerShown: true}}>
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen name="CreateUser" component={CreateUserScreen} />
        <Stack.Screen
          name="Onboard"
          component={OnboardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MyApplications" component={MyApplicationsScreen} />
        <Stack.Screen name="Application" component={ApplicationScreen} />
        <Stack.Screen name="MyEvents" component={MyEventsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function useAppNavigation() {
  return useNavigation<NavigationType>();
}
