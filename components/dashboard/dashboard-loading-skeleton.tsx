import { ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LoadingAnimation } from '../animations/loading-animation';

export const DashboardLoadingSkeleton = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView className='flex-col gap-3 bg-white p-3'>
          <Text className='self-center text-2xl font-light tracking-wide text-slate-900'>
            Leistungen diesen Monat
          </Text>
          <View className='w-100 h-28 rounded-xl bg-slate-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 rounded bg-slate-700' />
                  <View className='h-8 w-1/2 rounded bg-slate-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-slate-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-orange-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-orange-700' />
                  <View className='h-8 w-1/2 rounded bg-orange-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/4 rounded bg-orange-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-orange-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-orange-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-orange-700' />
                  <View className='h-8 w-1/2 rounded bg-orange-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/4 rounded bg-orange-700' />
                  <View className='h-5 w-1/4 rounded bg-orange-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-orange-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-blue-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-blue-700' />
                  <View className='h-8 w-1/2 rounded bg-blue-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/4 rounded bg-blue-700' />
                  <View className='h-5 w-1/4 rounded bg-blue-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-blue-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-green-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-green-700' />
                  <View className='h-8 w-1/2 rounded bg-green-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/4 rounded bg-green-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-green-700' />
            </LoadingAnimation>
          </View>
          <Text className='self-center text-2xl font-light tracking-wide text-slate-900'>
            Aufgaben
          </Text>
          <View className='w-100 h-28 rounded-xl bg-blue-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-blue-700' />
                  <View className='h-8 w-1/2 rounded bg-blue-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/4 rounded bg-blue-700' />
                  <View className='h-5 w-1/4 rounded bg-blue-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-blue-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-green-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-green-700' />
                  <View className='h-8 w-1/2 rounded bg-green-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/4 rounded bg-green-700' />
                  <View className='h-5 w-1/4 rounded bg-green-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-green-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-red-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-red-700' />
                  <View className='h-8 w-1/2 rounded bg-red-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/4 rounded bg-red-700' />
                  <View className='h-5 w-1/4 rounded bg-red-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-red-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-yellow-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-yellow-700' />
                  <View className='h-8 w-1/2 rounded bg-yellow-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/4 rounded bg-yellow-700' />
                  <View className='h-5 w-1/4 rounded bg-yellow-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-yellow-700' />
            </LoadingAnimation>
          </View>
          <Text className='self-center text-2xl font-light tracking-wide text-slate-900'>
            Berichte
          </Text>
          <View className='w-100 h-28 rounded-xl bg-blue-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-blue-700' />
                  <View className='h-8 w-1/2 rounded bg-blue-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-blue-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-blue-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-blue-700' />
                  <View className='h-8 w-1/2 rounded bg-blue-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-blue-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-blue-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-blue-700' />
                  <View className='h-8 w-1/2 rounded bg-blue-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-blue-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-blue-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-blue-700' />
                  <View className='h-8 w-1/2 rounded bg-blue-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                  <View className='h-5 w-1/5 rounded bg-blue-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-blue-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-yellow-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-yellow-700' />
                  <View className='h-8 w-1/2 rounded bg-yellow-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-yellow-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-yellow-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-yellow-700' />
                  <View className='h-8 w-1/2 rounded bg-yellow-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-yellow-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-yellow-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-yellow-700' />
                  <View className='h-8 w-1/2 rounded bg-yellow-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-yellow-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-yellow-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-yellow-700' />
                  <View className='h-8 w-1/2 rounded bg-yellow-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-yellow-700' />
            </LoadingAnimation>
          </View>
          <View className='w-100 h-28 rounded-xl bg-yellow-300 p-5'>
            <LoadingAnimation className='h-full flex-row items-center'>
              <View className='h-full flex-grow flex-col'>
                <View className='mb-2 flex-row items-center gap-2'>
                  <View className='h-8 w-8 bg-yellow-700' />
                  <View className='h-8 w-1/2 rounded bg-yellow-700' />
                </View>
                <View className='h-3'></View>
                <View className='flex-row items-center gap-4'>
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                  <View className='h-5 w-1/5 rounded bg-yellow-700' />
                </View>
              </View>
              <View className='h-12 w-12 rounded bg-yellow-700' />
            </LoadingAnimation>
          </View>
          <View className='h-4' />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
