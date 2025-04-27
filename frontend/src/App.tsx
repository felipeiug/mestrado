import Clarity from '@microsoft/clarity';
import { AppThemeProvider, KeyEventHandler, StartApi } from './context';
import { AppRoutes } from './routes';

function App() {
  const id = import.meta.env.VITE_CLARITY_ID;
  if (id) Clarity.init(id);

  return (
    <AppThemeProvider>
      <KeyEventHandler>
        <StartApi>
          <AppRoutes />
        </StartApi>
      </KeyEventHandler>
    </AppThemeProvider>
  )
}

export default App
