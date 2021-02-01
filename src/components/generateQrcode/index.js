import React, {Component} from "react";
import QRCode from "qrcode";
import {TextField, Slider, Avatar, Button} from 'react95'
import './style.css';
import {ThemeProvider} from 'styled-components';
import original from "react95/dist/themes/original";
import copy from 'copy-to-clipboard';
import store from 'store';
import operationsPlugin from 'store/plugins/operations';

store.addPlugin(operationsPlugin);

function generate(value, opt) {
  if (!value) {
    value = 'none'
  }
  return QRCode.toDataURL(value, {...opt, margin: 1});
}

class GenerateQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      qrCodeImg: '',
      width: 200,
    };

    this.handleChange = this.handleChange.bind(this);
    this.resize = this.resize.bind(this);
    this.action = this.action.bind(this);
  }

  resize(event, value) {
    this.setState({
      width: value
    });
  }

  handleChange(event) {
    const {value} = event.target;
    const {width} = this.state;
    generate(value, {width})
      .then(url => {
        this.setState({
          qrCodeImg: url
        })
      })
      .catch(err => {
        console.error(err)
      });
    this.setState({value});
  }

  componentDidMount() {
    const {value, width} = this.state;
    generate(value, {width})
      .then(url => {
        this.setState({
          qrCodeImg: url
        })
      })
      .catch(err => {
        console.error(err)
      });
  }

  async action(action) {
    const {value, qrCodeImg} = this.state;
    switch (action) {
      case 'copy':
        copy(value);
        break;
      case 'copy-qrcode':
        const base64Response = await fetch(`${qrCodeImg}`);
        const blob = await base64Response.blob();
        const item = new window.ClipboardItem({"image/png": blob});
        navigator.clipboard.write([item]);
        break;
      case 'download-qrcode':
        window.location.href = qrCodeImg;
        const a = document.createElement("a");
        a.href = qrCodeImg;
        a.download = `${value}.png`;
        a.click();
        break;
      case 'collect':
        const last = store.get('collection')
        if (last && Array.isArray(last)) {
          if (!last.find(it => it === value)) {
            last.push(value);
            store.set('collection', last)
          }
        } else {
          store.set('collection', [value]);
        }
        break;
      case 'clear':
        this.setState({
          value: '',
        });
        const { width} = this.state;
        generate('http', {width})
          .then(url => {
            this.setState({
              qrCodeImg: url
            })
          })
          .catch(err => {
            console.error(err)
          });
    }
  }

  render() {
    const {qrCodeImg, value, width} = this.state;
    return (
      <ThemeProvider theme={original}>

        <div className='generate-qr-code-c'>
          <div className='generate-qr-code-c-left'>
            <TextField multiline rows={10} value={value} onChange={this.handleChange} fullWidth placeholder="请输入链接..."/>
            <div className='generate-qr-code-c-left-action'>
              <Button onClick={() => this.action('clear')}>清空</Button>
              <Button onClick={() => this.action('collect')}>收藏链接</Button>
              <Button onClick={() => this.action('copy')}>复制链接</Button>
              <Button onClick={() => this.action('copy-qrcode')}>复制二维码</Button>
              <Button onClick={() => this.action('download-qrcode')}>下载二维码</Button>
            </div>
          </div>
          <div className='generate-qr-code-c-right'>
            <div className='generate-qr-code-resize'>
              <div className="generate-qr-code-resize-slide">
                <Slider
                  size='280px'
                  min={100}
                  max={300}
                  step={25}
                  defaultValue={200}
                  marks={[
                    {value: 300, label: '300px'},
                    {value: 250, label: '250px'},
                    {value: 200, label: '200px'},
                    {value: 150, label: '150px'},
                    {value: 100, label: '150px'},
                  ]}
                  onChange={this.resize}
                  orientation='vertical'
                />
              </div>
              <div className="generate-qr-code-resize-code">
                <Avatar size={width} src={qrCodeImg} square />
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default GenerateQrcode;
