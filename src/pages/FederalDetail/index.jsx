import { Redirect, Route, Switch } from 'react-router-dom';
import FederalDetailShow from './detail';
import FederalDetail from './show';
import Tmp from './tmp'

function FederalDetailAll() {
  
  return (
    <Switch>
      <Route path="/federalDetail/detail" component={FederalDetailShow} />
      <Route path="/federalDetail/show" component={FederalDetail} />
      <Route path="/federalDetail/tmp" component={Tmp} />

      <Redirect to="/federalDetail/show" />
    </Switch>
  );
}

export default FederalDetailAll;
