import * as React from "react";

import AppContainer from "./components/appContainer/AppContainer";
import IAppProps from "./IAppProps";

const App: React.FunctionComponent<IAppProps> = (props) => {
  let htmlElement: JSX.Element =
    <AppContainer />;

  return htmlElement;
}

export default App;
