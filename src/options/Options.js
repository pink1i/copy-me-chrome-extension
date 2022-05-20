import logo from '../logo.svg';
import './Options.css';
import { Modal, Button, Table } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import classNames from "classnames"
import 'bootstrap/dist/css/bootstrap.min.css';
import CryptoJS from "crypto-js"
const e = CryptoJS.AES.encrypt
const d = CryptoJS.AES.decrypt
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
function Options() {
  const [data, setData] = useState([])
  const [active, setActive] = useState(null)
  const [copyIdx, setCopyIdx] = useState(null)
  const [input, setInput] = useState(null);
  const [copycontent, setCopyContent] = useState(null);
  const [copyname, setCopyName] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    chrome.storage.local.get(['data'], function(result) {
      setData(result?.data || [])
    });
  }, [])


  useEffect(() => {
    if (data) {
      chrome.storage.local.set({data: data});
    }
  }, [data]);

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput(value)
  }
  const onChangeName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCopyName(value)
  }
  const onChangeCopy = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCopyContent(value)
  }

  const onCancel = () => {
    setCopyIdx(null)
    setInput(null)
  }

  const onSave = () => {
    const newdata = data.map((i, gidx) => {
      if (gidx == active) {
        return {...i, copies: i.copies.map((j, cix) => {
          if(cix == copyIdx) { return {...j, content: e(input, z).toString()}}
          return j
        })}
      }
      return i
    })
    console.log("new data", newdata)
    setData(newdata)
    onCancel()
  }

  const onCreateGroup = () => {
    const result = window.prompt("Nhap ten group")
    if (result.length === 0) return
    const newdata = [...data, {
      title: result,
      type: "folder",
      copies: []
    }]
    setData(newdata)
  }

  const onRemoveGroup = () => {
    const newdata = data.filter((el, idx) => idx !== active)
    setData(newdata)
    setActive(null)
  }

  const onEditGroup = () => {
    const result = window.prompt("Nhap ten group", data[active].title)
    const newdata = data.map((el, idx) => {
      if (idx == active) return {...el, title: result}
      return el
    })
    setData(newdata)
  }

  const addCopy = () => {
    setShow(true)
  }

  const handleSaveCopy = () => {
    const copy = {
      title: copyname,
      content: e(copycontent, z).toString()
    }
    const newData = data.map((el, idx) => {
      if (idx == active) {
        return {...el, copies: [...el.copies, copy]}
      }
      return el
    })
    setData(newData)
    setShow(false)
    setCopyContent(null)
    setCopyName(null)
  }

  const onImportJson = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      // console.log("e.target.result", JSON.parse(e.target.result));
      // debugger
      // console.log()
      // const jsonData = src2json(e.target.result);
      const jsonData = JSON.parse(e.target.result);
      console.log(jsonData)
      setData(jsonData)
    };
  };

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "result.json";

    link.click();

  };

  const showText = (text) => {
    console.log(text, z)
    window.alert(d(text, z).toString(CryptoJS.enc.Utf8))
  }


  const renderList = (cidx) => {
    if (cidx == null) return
    const copies = data[cidx]?.copies
    return <Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Data</th>
        <th>Tool</th>
      </tr>
    </thead>
    <tbody>
      {
        copies.map((item, idx) => <tr key={idx} className="item-copy-table">
          <td>{idx}</td>
          <td>{item.title}</td>
          <td>{copyIdx == idx ? (<input name="copy" defaultValue={d(item.content, z).toString(CryptoJS.enc.Utf8)} onChange={onChange}/>) : (<span className='item-copy-title'>***</span>) }</td>
          <td>
            {copyIdx == idx && <Button className='item-copy-btn' onClick={() => onCancel()}>Cancel</Button>}
            {copyIdx == idx && <Button className='item-copy-btn' onClick={() => onSave()}>save</Button>}
            <Button className='item-copy-btn' onClick={() => showText(item.content)}>Show</Button>
            <Button className='item-copy-btn' onClick={() => setCopyIdx(idx)}>edit</Button>
            <Button className='item-copy-btn'>Xoa</Button>
          </td>
        </tr>)
      }
    </tbody>
  </Table>
  }
  return (
    <div className="App">
      <div className='import-container'>
        <span>Please choose json file</span>
        <input className="border" type="file" onChange={onImportJson} />

      </div>
      <div className='container1'>
        <div className='groups'>
          {
            data.map((item, idx) => <div key={idx} className={classNames("item-copy", {"active-group": active === idx})} onClick={() => setActive(idx)}>
              <span >{item.title}</span>
            </div>)
          }
          <div className='group-btns'>
            <Button onClick={() => onCreateGroup()}>+</Button>
            {active !== null && <Button className='item-copy-btn' onClick={() => onRemoveGroup()}>-</Button>}
            {active !== null && <Button className='item-copy-btn' onClick={() => onEditGroup()}>Edit</Button>}
          </div>
        </div>
        <div className='items'>
        {renderList(active)}
        {active !== null && <Button className='item-copy-btn' onClick={addCopy}>Add copy</Button>}
        </div>

      </div>
      <div className='container2'>
        <Button onClick={exportData}>Export Data</Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Copy detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>name</div>
            <input name="name" onChange={onChangeName}/>
          </div>
          <div>
            <div>noi dung</div>
            <input name="content" onChange={onChangeCopy}/>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveCopy}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Options;
