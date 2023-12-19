import './index.css';
import App from './App';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewFill from './routes/newFill';
import Graphs from './routes/graphs';
import Home from './routes/home';
import Fills from './routes/fills';
import Fill from './routes/fill';

// https://reactrouter.com/docs/en/v6/getting-started/tutorial
// https://mui.com/getting-started/installation/

const container = document.getElementById('root');
const root = createRoot(container as Element);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="newFill" element={<NewFill />} />
        <Route path="fills" element={<Fills />}>
          <Route
            index
            element={
              <main className={`fillElementContent`}>
                {/* <p>Select a fill</p> */}
              </main>
            }
          />
          <Route path=":fillId" element={<Fill />} />
        </Route>
        <Route path="graphs" element={<Graphs />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
