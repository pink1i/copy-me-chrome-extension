import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import copy from 'copy-to-clipboard'
import CryptoJS from "crypto-js"
const e = CryptoJS.AES.decrypt
const t = "This"
const p = "package"
const s = "includes scripts"
const z = [t,p,s].join(" ")
const raw = [
  {
    title: "no",
    type: "folder",
    copies: [
      {
        title: "1",
        content: "copy 1"
      },
      {
        title: "2",
        content: "copy 2"
      },
      {
        title: "3",
        content: "copy 3"
      },
    ]
  },
  {
    title: "PRD",
    type: "folder",
    copies: [
      {
        title: "P1",
        content: "PRD copy 1"
      },
      {
        title: "P2",
        content: "PRD copy 2"
      },
      {
        title: "P3",
        content: "PRD copy 3"
      }
    ]
  }
]
function App() {
  const [active, setActive] = useState(null)
  const [data, setData] = useState([])
  const [thongbao, setThongbao] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(['data'], function(result) {
      setData(result?.data || [])
    });
  }, [])

  const showmess = () => {
    setThongbao(true)
    setTimeout(() => {
      setThongbao(false)
    }, 3000)
  }

  const onCopy = (text) => {
    console.log(chrome)
    copy(e(text, z).toString(CryptoJS.enc.Utf8))
    // setThongbao(true)
    window.close();
    // setTimeout(() => {
    //   setThongbao(false)
    // }, 3000)
  }

  const onOpenOption = () => {
    chrome.tabs.create({ url: "options.html" });
  }
  return (
    <div className="App">
      <div className='thongbao'> Cóp pi tôi nè!
        {/* {thongbao && <p>Da copy</p>} */}
      </div>

      <ul>
        {data.map((item, idx) => <li key={idx}>
          <div onClick={() => setActive(idx)} className="li-parent">{item.title}</div>
          {active == idx && (
            <ul className='ul-con'>
              {item.copies.map((cp, cp_idx) => <li key={idx} className="cp_item" onClick={() => onCopy(cp.content)}>{cp.title}</li>)}
            </ul>
          )}
        </li>)}
      </ul>
      <button class="btn-option" onClick={onOpenOption}>Options</button>
    </div>
  );
}

export default App;
