import * as React from 'react';
import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';
import { ConnectedRouter } from 'connected-react-router';
import { Provider as ReduxProvider } from 'react-redux';
import 'babel-polyfill';

import { App } from 'components';
import { configureStore } from './store/rootStore';

const { store, history } = configureStore(window.__INITIAL_STATE__);

loadableReady(() => {
    hydrate(
        <ReduxProvider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </ReduxProvider>,
        // eslint-disable-next-line no-undef
        document.getElementById('mount')
    );
});
