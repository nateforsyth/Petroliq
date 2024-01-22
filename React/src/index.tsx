import './index.css';
import App from './App';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewFill from './routes/fills/NewFill';
import Graphs from './routes/graphs/Graphs';
import Home from './routes/Home';
import Fills from './routes/fills/Fills';
import Fill from './routes/fills/Fill';
import Account from './routes/admin/Account';
import Dashboard from './routes/admin/Dashboard';
import Profile from './routes/admin/Profile';
import Register from './routes/admin/Register';
import Privacy from './routes/Privacy';

// https://reactrouter.com/docs/en/v6/getting-started/tutorial
// https://mui.com/material-ui/getting-started/installation/

const container = document.getElementById('root');
const root = createRoot(container as Element);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="Home" element={<Home />} />
        <Route path="NewFill" element={<NewFill />} />
        <Route path="Fills" element={<Fills />}>
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
        <Route path="Graphs" element={<Graphs />} />
        <Route path="Account" element={<Account />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Register" element={<Register />} />
        <Route path="Privacy" element={<Privacy />} />
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
