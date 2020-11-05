import { render } from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById('app')!;

function renderApp() {
  render(<App />, rootElement);
}

renderApp();

serviceWorker.unregister();

if (module.hot) {
  module.hot.accept('./App', renderApp);
}
