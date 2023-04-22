import { Drawer } from '../../components/navigation/drawer';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { UserDrawerItem } from '../../components/navigation/user-drawer-item';
import { LogoutDrawerItem } from '../../components/navigation/logout-drawer-item';
import * as React from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useUser } from '../../context/user';
import { VersionDrawerItem } from '../../components/navigation/version-drawer-item';
import { UpdateDrawerItem } from '../../components/navigation/update-drawer-item';

export default function Layout() {
  const { can, canAny } = useUser();

  const headerTitles = {
    accounting: {
      index: 'Abrechnung',
      create: 'Abrechnung anlegen',
      edit: 'Abrechnung bearbeiten',
    },
    logbook: {
      index: 'Fahrtenbuch',
      create: 'Fahrt anlegen',
      edit: 'Fahrt bearbeiten',
    },
  };

  const getHeaderTitle = (segment, route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return routeName
      ? headerTitles[segment][routeName]
      : headerTitles[segment]['index'];
  };

  return (
    <Drawer
      initialRouteName='dashboard'
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name='dashboard'
        options={{
          drawerLabel: 'Übersicht',
          title: 'Übersicht',
          drawerIcon: ({ color, size }) => (
            <Feather name='activity' color={color} size={size} />
          ),
          drawerActiveBackgroundColor: '#BBF7D0',
          drawerActiveTintColor: '#15803D',
        }}
      />
      {canAny(['accounting.view.own', 'accounting.view.other']) && (
        <Drawer.Screen
          name='accounting'
          options={({ route }) => {
            const segment = 'accounting';

            return {
              headerTitle: getHeaderTitle(segment, route),
              drawerLabel: 'Abrechnung',
              title: 'Abrechnung',
              drawerIcon: ({ color, size }) => (
                <Feather name='clock' color={color} size={size} />
              ),
              drawerActiveBackgroundColor: '#BBF7D0',
              drawerActiveTintColor: '#15803D',
            };
          }}
        />
      )}
      {canAny(['logbook.view.own', 'logbook.view.other']) && (
        <Drawer.Screen
          name='logbook'
          options={({ route }) => {
            const segment = 'logbook';

            return {
              headerTitle: getHeaderTitle(segment, route),
              drawerLabel: 'Fahrtenbuch',
              title: 'Fahrtenbuch',
              drawerIcon: ({ color, size }) => (
                <Feather name='book' color={color} size={size} />
              ),
              drawerActiveBackgroundColor: '#BBF7D0',
              drawerActiveTintColor: '#15803D',
            };
          }}
        />
      )}
      <Drawer.Screen
        name='changelog'
        options={{
          title: 'Versionshinweise',
          // hide changelogs from here because the version info is clickable
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer>
  );
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      <UserDrawerItem />
      <DrawerItemList {...props} />
      <UpdateDrawerItem />
      <LogoutDrawerItem />
      <VersionDrawerItem />
    </DrawerContentScrollView>
  );
};
