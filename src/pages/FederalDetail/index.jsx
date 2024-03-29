import { Redirect, Route, Switch } from 'react-router-dom';
import FederalDetailShow from './detail';
import FederalDetail from './show';

function FederalDetailAll() {
  
  return (
    <Switch>
      <Route path="/federalDetail/detail" component={FederalDetailShow} />
      <Route path="/federalDetail/show" component={FederalDetail} />
      <Redirect to="/federalDetail/show" />
    </Switch>
  );
}

export default FederalDetailAll;
