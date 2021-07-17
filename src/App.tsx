import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Install from "./pages/Install";
import Page from "./pages/Page";
import Home from "./pages/Home";
import Basic from "./templates/Basic";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact children={WithBasicTemplate(<Home />)} />
        <Route path="/install" exact children={WithBasicTemplate(<Install />)} />
        <Route path="/:id" children={WithBasicTemplate(<Page />)} />
      </Switch>
    </Router>
  );
}

function WithBasicTemplate(children: JSX.Element) {
  return <Basic>{children}</Basic>;
}

export default App;
