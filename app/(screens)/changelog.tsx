import {ScrollView, Text, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "expo-router";
import {ReactNode, useEffect} from "react";
import {ChangelogHeader} from "../../components/changelog/ChangelogHeader";
import {ChangelogEntry} from "../../components/changelog/ChangelogEntry";

export default function ChangelogScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView className='h-full bg-white p-3 '>
          <Text className='font-bold text-2xl'>Quokka Mobile Versionshinweise</Text>


          <ChangelogHeader>v0.1.1-80325d5 (22.04.2023)</ChangelogHeader>

          <ChangelogEntry>
            Felder bei der Fahrtenbuch Eingabe werden nun automatisch basierend auf vorhandenden Werten ausgefüllt.
          </ChangelogEntry>
          <ChangelogEntry>
            Versionshinweise wurden implementiert. Diese sind durch Drücken auf die Versionsnummer im Menü aufrufbar.
          </ChangelogEntry>


          <ChangelogHeader>v0.1.0-ef7dcb2 (21.04.2023)</ChangelogHeader>

          <ChangelogEntry>
            Initiale Version mit Support für automatische Updates.
          </ChangelogEntry>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}