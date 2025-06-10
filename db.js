// db.js
const fs = require('fs/promises');

const DB_FILE = "./data/db.json";

async function readCustomersFromFile(filePath = DB_FILE) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function getCustomerById(filePath = DB_FILE, id) {
  try {
    const customers = await readCustomersFromFile(filePath);
    return customers.find(customer => customer.id === id);
  } catch (error) {
    console.error('An error occurred while retrieving the customer:', error);
    throw error;
  }
}

async function writeCustomerToFile(filePath = DB_FILE, customerData) {
  try {
    const customers = await readCustomersFromFile(filePath);
    const isDuplicate = customers.some(c => c.name === customerData.name);

    if (isDuplicate) {
      // Em vez de apenas logar, lançar erro customizado
      const error = new Error('This name is already registered.');
      error.code = 'DUPLICATE_NAME';
      throw error;
    }

    const lastId = customers.reduce((max, c) => Math.max(max, c.id || 0), 0);
    const newCustomer = {
      id: lastId + 1,
      ...customerData
    };

    customers.push(newCustomer);
    await fs.writeFile(filePath, JSON.stringify(customers, null, 2));
  } catch (error) {
    throw error; // propagar o erro para ser tratado na rota
  }
}

async function updateCustomerInFile(filePath = DB_FILE, updatedCustomer) {
  try {
    const customers = await readCustomersFromFile(filePath);

    const customerIndex = customers.findIndex(c => c.id === updatedCustomer.id);

    if (customerIndex === -1) {
      console.log(`Customer with ID=${updatedCustomer.id} not found.`);
      return;
    }

    customers[customerIndex] = updatedCustomer;

    await fs.writeFile(filePath, JSON.stringify(customers, null, 2), 'utf-8');
    console.log('Customer updated successfully.');
  } catch (error) {
    console.error('An error occurred while updating the customer:', error);
  }
}


async function deleteCustomerFromFile(filePath = DB_FILE, customerId) {
  try {
    const customers = await readCustomersFromFile(filePath);
    const updatedCustomers = customers.filter(customer => customer.id !== customerId);

    if (customers.length === updatedCustomers.length) {
      console.log('Customer not found. Please check the ID and try again.');
      return;
    }

    const updatedData = updatedCustomers.map(customer => JSON.stringify(customer)).join('\n');
    await fs.writeFile(filePath, updatedData + '\n');
    console.log('Customer successfully deleted.');
  } catch (error) {
    console.log('An error occurred while deleting the customer. Please try again.');
  }
}

module.exports = {
  readCustomersFromFile,
  getCustomerById,
  writeCustomerToFile,
  updateCustomerInFile,
  deleteCustomerFromFile
};
