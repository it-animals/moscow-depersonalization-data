import React from "react";
import { Route, Switch } from "react-router-dom";
import { PackagePage } from "./ui/pages/PackagePage";
import { ErrorPage } from "./ui/pages/ErrorPage";
import { NotFoundPage } from "./ui/pages/NotFoundPage";
import { UnauthorizedPage } from "./ui/pages/UnauthorizedPage";
import { ForbiddenPage } from "./ui/pages/ForbiddenPage";
import { ViewDocumentPage } from "./ui/pages/ViewDocumentPage";
import { PackageListPage } from "./ui/pages/PackageListPage";
import { LoadPage } from "./ui/pages/LoadPage";
import { InitialFileViewPage } from "./ui/pages/InitialFileViewPage";
import { CompareViewPage } from "./ui/pages/CompareViewPage";

function App() {
  return (
    <>
      <Switch>
        <Route path={"/"} exact component={PackageListPage} />
        <Route path={"/load/"} exact component={LoadPage} />
        <Route path={"/package/:packageId"} component={PackagePage} />
        <Route
          path={"/compare/:packageId/:id/:image"}
          component={CompareViewPage}
        />
        <Route
          path={"/view/:packageId/:id/:image"}
          component={ViewDocumentPage}
        />
        <Route
          path={"/initial/:packageId/:id/:image"}
          component={InitialFileViewPage}
        />
        <Route path={"/error"} component={ErrorPage} />
        <Route path={"/404"} component={NotFoundPage} />
        <Route path={"/403"} component={ForbiddenPage} />
        <Route path={"/401"} component={UnauthorizedPage} />
      </Switch>
    </>
  );
}

export default App;
