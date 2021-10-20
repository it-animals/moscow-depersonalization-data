import React from "react";
import { Route, Switch } from "react-router-dom";
import { MainPage } from "./ui/pages/MainPage";
import { ErrorPage } from "./ui/pages/ErrorPage";
import { NotFoundPage } from "./ui/pages/NotFoundPage";
import { UnauthorizedPage } from "./ui/pages/UnauthorizedPage";
import { ForbiddenPage } from "./ui/pages/ForbiddenPage";

function App() {
  return (
    <>
      <Switch>
        <Route path={"/"} exact component={MainPage} />
        <Route path={"/error"} component={ErrorPage} />
        <Route path={"/404"} component={NotFoundPage} />
        <Route path={"/403"} component={ForbiddenPage} />
        <Route path={"/401"} component={UnauthorizedPage} />
      </Switch>
    </>
  );
}

export default App;