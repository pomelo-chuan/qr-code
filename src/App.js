import React, {Component} from 'react';
import GenerateQrcode from './components/generateQrcode';
import {createGlobalStyle, ThemeProvider} from 'styled-components';
import Collection from './components/collection';
import {styleReset} from 'react95';
import original from "react95/dist/themes/original";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }

  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }

  body {
    font-family: 'ms_sans_serif';
  }

  ${styleReset}
`;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.setOpen = this.setOpen.bind(this);
  }


  setOpen(bool) {
    this.setState({
      open: bool
    })
  }

  render() {
    return (
      <div style={{backgroundColor: 'rgb(198, 198, 198)'}}>
        <GlobalStyles/>
        <ThemeProvider theme={original}>
          <GenerateQrcode/>
          <Collection/>
        </ThemeProvider>
      </div>
    )
  }
}

export default App;
