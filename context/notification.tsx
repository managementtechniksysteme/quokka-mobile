import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react';
import { Snackbar } from 'react-native-paper';
import { Text } from 'react-native';
import colors from 'tailwindcss/colors';

const DEFAULT_DURATION = 5000;

type NotificationType = 'default' | 'success' | 'info' | 'warning' | 'danger';

export type NotificationContext = {
  showNotification: (
    message: string,
    type: NotificationType,
    duration?: number
  ) => void;
};

const NotificationContext = createContext<NotificationContext>(
  {} as NotificationContext
);

export function useNotification() {
  return useContext(NotificationContext);
}

type NotificationProviderProps = {
  children?: ReactNode;
};

export function Provider({ children }: NotificationProviderProps) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('default');
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [visible, setVisible] = useState(false);

  const classNameReducer = (state, action) => {
    switch (action.type) {
      case 'success':
        return { background: colors.green['600'], foreground: colors.white };
      case 'info':
        return { background: colors.sky['600'], foreground: colors.white };
      case 'warning':
        return {
          background: colors.yellow['400'],
          foreground: colors.slate['900'],
        };
      case 'danger':
        return { background: colors.red['600'], foreground: colors.white };
      default:
        return { background: colors.slate['700'], foreground: colors.white };
    }
  };

  const [styleState, dispatchStyleAction] = useReducer(classNameReducer, {
    background: colors.slate['700'],
    foreground: colors.white,
  });

  const showNotification = (
    message: string,
    type: NotificationType,
    duration: number = DEFAULT_DURATION
  ) => {
    dispatchStyleAction({ type: type });
    setMessage(message);
    setType(type);
    setVisible(true);
    setDuration(duration);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
      }}
    >
      {children}
      <Snackbar
        className='rounded-3xl'
        style={{ backgroundColor: styleState.background }}
        visible={visible && !!message.length}
        duration={duration}
        onDismiss={() => setVisible(false)}
      >
        <Text style={{ color: styleState.foreground }}>{message}</Text>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
