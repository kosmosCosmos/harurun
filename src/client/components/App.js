import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const AppComponent = (props) => (
  <MuiThemeProvider>
    <div>
      <AppBar
        title="48系番组直播间"
      />
      {props.children}
    </div>
  </MuiThemeProvider>
);

export default AppComponent;
