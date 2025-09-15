import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'
import AuthContextProvider from './Context/Authentication/AuthenticationContext.jsx'
import { Provider } from 'react-redux'
import { store } from './libs/store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthContextProvider>
          < App />
        </AuthContextProvider>  
      </Provider>
    </QueryClientProvider>

  </>,
)
