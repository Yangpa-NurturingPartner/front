import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // Router를 가져옵니다
import App from './App';
import store from './redux/store'; // 스토어를 가져옵니다

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter> {/* Router로 감싸기 */}
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);