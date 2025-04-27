import Clarity from '@microsoft/clarity';
import { AppThemeProvider, ErrorProvider, KeyEventHandler, LoadingProvider, StartApi } from './context';
import { AppRoutes } from './routes';

function App() {
  const id = import.meta.env.VITE_CLARITY_ID;
  if (id) Clarity.init(id);

  return (
    <AppThemeProvider>
      <KeyEventHandler>
        <StartApi>
          <ErrorProvider>
            <LoadingProvider>
              <AppRoutes />
            </LoadingProvider>
          </ErrorProvider>
        </StartApi>
      </KeyEventHandler>
    </AppThemeProvider>
  )
}

export default App
