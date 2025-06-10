
// routes/customers.js
const db = require('../db');
db.readCustomersFromFile();

const express = require('express');
const router = express.Router();

router.post('/new', async (req, res) => {
  const id = parseInt(req.body.id);
  const customerData = {
    id: !isNaN(id) ? id : undefined,
    name: req.body.name,
    address: req.body.address
  };

  try {
    if (customerData.id) {
      await db.updateCustomerInFile(undefined, customerData);
    } else {
      await db.writeCustomerToFile(undefined, customerData);
    }
    res.redirect('/customers');
  } catch (error) {
    let errorMessage = '';

    if (error.code === 'DUPLICATE_NAME') {
      errorMessage = error.message;
    } else {
      errorMessage = 'Error saving customer. Please try again.';
    }

    res.render('newCustomer', {
      title: customerData.id ? 'Edit Customer' : 'New Customer',
      errorMessage,
      customer: customerData
    });
  }
});


router.get('/new', (req, res) => {
  res.render('newCustomer', { title: 'New Customer', customer: {} });
});


router.get('/new/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("Invalid ID");

  try {
    const customer = await db.getCustomerById(undefined, id);
    if (!customer) return res.status(404).send("Customer not found");

    res.render('newCustomer', { title: 'Edit Customer', customer });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get('/', async (req, res, next) => {
  const customers = await db.readCustomersFromFile();
  res.render('customers', { title: 'Customers', customers });
});


module.exports = router;
