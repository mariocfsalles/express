function deleteCustomer(id) {
  if (confirm('Are you sure you want to delete this customer?')) {
    fetch(`/customers/delete/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        location.reload();
      } else {
        alert('Failed to delete customer.');
      }
    });
  }
}
