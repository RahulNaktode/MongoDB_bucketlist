import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'

function App() {

  const [bucketList, setBucketList] = useState([]);
  const [newBucketList, setnewBucketList] = useState({
    name: "",
    description: "",
    priority: 0,
  })

  const loadBucketList = async () => {
    const reaponse = await axios.get(`${import.meta.env.VITE_API_URL}/bucketlists`);

    setBucketList(reaponse.data.data);
  }

  const markAsComplete = async (id) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/bucketlists/${id}/complete`);

    loadBucketList();
  }

  const addBucketList = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/bucketlists`,
      newBucketList
    );

    loadBucketList();
    setnewBucketList({name:"", description:"", priority: 0})
  }

  useEffect(() => {
    loadBucketList();
  }, [])
  const isFormValid = newBucketList.name.trim() && newBucketList.description.trim() && newBucketList.priority > 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1>BucketList 🪣</h1>
      
      <div>
        {bucketList && bucketList.length > 0 ? (
          bucketList.map((listItem) => {
            const {_id, name, description, isComplete} = listItem;
            
            return (
              <div className='card' key={_id}>
                <h3><span>{isComplete ? '✅' : "⌛"}</span>
                  {name}</h3>
                <p>{description}</p>
                {!isComplete && (
                  <button onClick={() => markAsComplete(_id)}>Mark As Completed</button>
                )} 
              </div>
            )
          })
        ) : (
          <div className='card' style={{ textAlign: 'center', color: '#999' }}>
            <p>No bucket list items yet. Create one to get started!</p>
          </div>
        )}
      </div>

      <div className='form-container' style={{ marginTop: '2rem' }}>
        <h1>Add new Bucket list item</h1>
        <input 
          type="text" 
          placeholder='Enter Bucket Item Name' 
          onChange={(e) => setnewBucketList({...newBucketList, name: e.target.value})}
          value={newBucketList.name}
        />

        <input 
          type="text" 
          placeholder='Add description' 
          onChange={(e) => setnewBucketList({...newBucketList, description: e.target.value})}
          value={newBucketList.description}
        />

        <input 
          type="number" 
          placeholder='Priority (1-10)' 
          min="1" 
          max="10"
          onChange={(e) => setnewBucketList({...newBucketList, priority: e.target.value})}
          value={newBucketList.priority}
        />

        <button onClick={addBucketList} disabled={!isFormValid}>Add Item</button>
      </div>
    </div>
  )
}

export default App
