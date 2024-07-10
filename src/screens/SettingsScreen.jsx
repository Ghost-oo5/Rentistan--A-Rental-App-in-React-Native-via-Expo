import React from 'react';
import { View, Text, Switch } from 'react-native';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <View>
      <Text>Settings</Text>
      <View>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;
