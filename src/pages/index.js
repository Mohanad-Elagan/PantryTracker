import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { db } from '../src/firebaseConfig';
import PantryItemForm from '../components/PantryItemForm';
import CameraCapture from '../components/CameraCapture';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, "pantryItems"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArray = [];
      querySnapshot.forEach((doc) => {
        itemsArray.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArray);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = () => {
    setSelectedItem(null);
  };

  const handleImageUpload = async (url) => {
    try {
      const response = await axios.post('YOUR_GPT_VISION_API_URL', { imageUrl: url });
      const { classification } = response.data;
      await addDoc(collection(db, "classifiedItems"), { imageUrl: url, classification });
    } catch (error) {
      console.error('Error classifying image:', error);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Pantry Items</h1>
      <CameraCapture onUpload={handleImageUpload} />
      <TextField
        label="Search Items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />
      <PantryItemForm item={selectedItem} onUpdate={handleUpdate} />
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity}
            <Button onClick={() => setSelectedItem(item)}>Edit</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;