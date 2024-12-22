const express = require('express');
const fs = require('fs');
const app = new express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const filePath = './hospitals.json';

// Read hospitals data
const getHospitalsData = (callback) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, JSON.parse(data));
    }
  });
};

// GET all hospitals
app.get('/hospitals', (req, res) => {
    getHospitalsData((err, data) => {
      if (err) {
        res.status(500).send('Error reading hospital data');
      } else {
        res.json(data);
      }
    });
  });

// Write hospitals data
const writeHospitalsData = (data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', callback);
};

// POST a new hospital
app.post('/hospitals', (req, res) => {
    const newHospital = req.body;
  
    getHospitalsData((err, data) => {
      if (err) {
        res.status(500).send('Error reading hospital data');
      } else {
        data.push(newHospital);  
        writeHospitalsData(data, (err) => {
          if (err) {
            res.status(500).send('Error saving hospital data');
          } else {
            res.status(201).send('Hospital added successfully');
          }
        });
      }
    });
  });
  

// PUT update a hospital
app.put('/hospitals/:id', (req, res) => {
  const hospitalId = parseInt(req.params.id);
  const updatedHospital = req.body;

  getHospitalsData((err, data) => {
    if (err) {
      res.status(500).send('Error reading hospital data');
    } else {
      const index = data.findIndex(hospital => hospital.id === hospitalId);
      if (index !== -1) {
        data[index] = { id: hospitalId, ...updatedHospital };
        writeHospitalsData(data, (err) => {
          if (err) {
            res.status(500).send('Error saving hospital data');
          } else {
            res.send('Hospital updated successfully');
          }
        });
      } else {
        res.status(404).send('Hospital not found');
      }
    }
  });
});

// DELETE a hospital
app.delete('/hospitals/:id', (req, res) => {
  const hospitalId = parseInt(req.params.id);

  getHospitalsData((err, data) => {
    if (err) {
      res.status(500).send('Error reading hospital data');
    } else {
      const updatedData = data.filter(hospital => hospital.id !== hospitalId);
      if (updatedData.length === data.length) {
        res.status(404).send('Hospital not found');
      } else {
        writeHospitalsData(updatedData, (err) => {
          if (err) {
            res.status(500).send('Error saving hospital data');
          } else {
            res.send('Hospital deleted successfully');
          }
        });
      }
    }
  });
});




app.listen(3000, () => {
  console.log(`Server is running on PORT 3000`);
});
