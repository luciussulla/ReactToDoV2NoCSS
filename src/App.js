import './App.css'
import {useState, useEffect} from 'react'
import List from './components/List'
import Alert from './components/Alert'

const getLocalStorage = ()=> {
  let list = window.localStorage.getItem('list')
  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [alert, setAlert] = useState({show:false, msg:'blbl', type:'success'})

  const handleSubmit = (e)=> {
    e.preventDefault()
    console.log("handle sbtmi")
    if(!name) {
      // warning if no value provided
      // display alert
      showAlert(true, 'danger', 'please enter value')
    }
    else if (name && isEditing) {
      // editing section
      const newList = list.map(item=>{
        if(item.id===editId) {
          item.title=name
        }
        return item
      })
      setList(newList) 
      setEditId(null)
      setName('')
      setIsEditing(false)
      showAlert(true, 'value changes', 'success')

    } else {
      // create new item and show alert
      const newItem = {id: new Date().getTime().toLocaleString(), title: name}
      setList([...list, newItem])
      setName('')
      showAlert(true, 'success', 'new Item added')
    }
  }

  const handleChange = (e) => {
    setName(e.target.value)
  }

  const showAlert = (show=false, type="", msg="") => {
    setAlert({show, type, msg})
  }

  const clearList = ()=> {
    setList([])
    showAlert(true, 'danger', 'emptying list')
  }

  const removeItem = (id)=> {
    showAlert(true, 'danger', 'item removed')
    setList(list.filter(item => item.id !== id))
  }

  const editItem = (id) => {
    const specificItem = list.find(item=>item.id===id)
    setIsEditing(true)
    setEditId(id)
    setName(specificItem.title)
  }

  useEffect(()=> {
    window.localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <div className="App">
      <section> 
        
        <form className="grocery-form" onSubmit={handleSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
          <h3>Grocery bud</h3>
          <div className="form-control">
            <input type="text" className="grocery" value={name} onChange={handleChange}/>
            <button type="submit" className="submit-btn">
              {isEditing ? 'edit' : 'submit'}
            </button>
          </div>
        </form>  
        {list.length > 0 && (
          <div className="grocery-container">
            <List items={list} removeItem={removeItem} editItem={editItem}/>
            <button className="clear-btn" onClick={clearList}>
              clear items
            </button>
          </div>
        )} 
      </section>
    </div>
  );
}

export default App;
