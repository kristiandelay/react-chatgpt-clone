import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from './middleware/logger'
import rootReducer from './redux/reducers'

import chatReducer from './redux/chatSlice';

export default function customStore(preloadedState) {
  const middleware = [loggerMiddleware, thunkMiddleware];

  const store = configureStore({
    reducer: {
      root: rootReducer,
      chats: chatReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middleware),
    preloadedState,
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./redux/reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}