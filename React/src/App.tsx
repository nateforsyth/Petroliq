import './App.css';
import { Link, Outlet } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className={`mainHeaderContainer paddingLeftOvr`}>
          <h1 className={`mainHeader`}>PetrolIQ</h1>
        </div>
      </header>
      <div className="appWrapper">
        <nav className={`mainNav paddingLeftOvr paddingRightOvr`}>
          <Link className={`mainNavElements`} to="home"><h4 className="navHeader">Home</h4></Link>
          <Link className={`mainNavElements`} to="newFill"><h4 className="navHeader">New Fill</h4></Link>
          <Link className={`mainNavElements`} to="fills"><h4 className="navHeader">Fills</h4></Link>
          <Link className={`mainNavElements`} to="graphs"><h4 className="navHeader">Graphs</h4></Link>
        </nav>
        <div className="contentWrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
