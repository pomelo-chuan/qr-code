import React, {useState} from 'react';
import QRCode from 'qrcode';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './qrcode.less';

const protocolList = [
  'https://',
  'http://',
  'ws://',
  'wss://',
];

function QrCode() {
  const [qrcode, setQrcode] = useState();
  const [protocol, setProtocol] = useState('https://');
  const [qrcodeImg, setQrocdeImg] = useState();

  const handleInput = (e) => {
    const {value} = e.target;
    setQrcode(value);
    generateQrcode()
  };

  const generateQrcode = () => {
    QRCode.toDataURL(protocol + qrcode, function (err, url) {
      setQrocdeImg(url)
    });
  }

  const handleSelectProtocol = e => {
    const {value} = e.target;
    setProtocol(value);
    generateQrcode();
  }

  return <div>
    <ul onClick={e => {
      setQrcode(e.target.innerHTML)
      generateQrcode()
    }}
    >
      <li>qr.shouqianba.com/</li>
      <li>qr-wap-pay.iwosai.com/</li>
    </ul>
    <div className='textarea-row'>
      <select value={protocol} onChange={handleSelectProtocol}>
        {protocolList.map(it => (
          <option value={it} key={it}>{it}</option>
        ))}
      </select>

      <textarea
        value={qrcode}
        className='qrcode-textarea'
        onChange={handleInput}
        placeholder='请输入网址（协议无需输入）'
      />

      <button
        onClick={() => {
          navigator.clipboard.readText()
            .then(text => {
              const textWithoutProtocol = text.replace(/(^\w+:|^)\/\//, '');
              setQrcode((qrcode || '') + textWithoutProtocol);
              generateQrcode();
            })
            .catch(err => {
              console.error('Failed to read clipboard contents: ', err);
            });
        }}
      >
        粘贴剪贴板
      </button>

      <button
        onClick={() => {
          setQrcode('')
          generateQrcode()
        }}
      >
        清除输入框
      </button>
    </div>

    {(qrcodeImg && qrcode) &&
    <>
      <img src={qrcodeImg}/>

      <button
        onClick={async () => {
          const base64Response = await fetch(qrcodeImg);
          const blob = await base64Response.blob();
          const item = new window.ClipboardItem({"image/png": blob});
          navigator.clipboard.write([item]);
        }}
      >
        复制二维码
      </button>
    </>
    }

    {qrcode &&
    <>
      <p>{protocol + qrcode}</p>
      <CopyToClipboard text={protocol + qrcode}>
        <button>
          复制链接
        </button>
      </CopyToClipboard>
    </>
    }
  </div>
}

export default QrCode;
