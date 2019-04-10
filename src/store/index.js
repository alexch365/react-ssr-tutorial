import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, createMemoryHistory } from 'history';

import createRootReducer from './rootReducer';
import rootSaga from './rootSaga';

export const isServer = !(
    // eslint-disable-next-line  no-undef
    typeof window !== 'undefined' && window.document && window.document.createElement
);

function getComposeEnhancers() {
    if (process.env.NODE_ENV !== 'production' && !isServer) {
        // eslint-disable-next-line  no-undef, no-underscore-dangle
        return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }

    return compose;
}

export default function configureStore(initialState = {}, url = '/') {
    const history = isServer
        ? createMemoryHistory({ initialEntries: [url] })
        : createBrowserHistory();

    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancers = getComposeEnhancers();
    const middlewares = [
        routerMiddleware(history),
        sagaMiddleware
    ];

    const store = createStore(
        createRootReducer(history),
        initialState,
        composeEnhancers(applyMiddleware(...middlewares))
    );

    if (!isServer) {
        sagaMiddleware.run(rootSaga);
    }

    return { store, history };
}