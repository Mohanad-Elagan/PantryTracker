import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { db } from '../src/firebaseConfig';
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

const PantryItemForm = ({ item, onUpdate }) => {
  const [name, setName] = useState(item?.name || '');
  const [quantity, setQuantity] = useState(item?.quantity || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (item) {
      await updateDoc(doc(db, "pantryItems", item.id), { name, quantity });
    } else {
      await addDoc(collection(db, "pantryItems"), { name, quantity });
    }
    onUpdate();
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "pantryItems", item.id));
    onUpdate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        {item ? 'Update' : 'Add'}
      </Button>
      {item && (
        <Button onClick={handleDelete} variant="contained" color="secondary">
          Delete
        </Button>
      )}
    </form>
  );
};

export default PantryItemForm;