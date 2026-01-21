// script.js
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('title').textContent.toLowerCase();

  let customers = JSON.parse(localStorage.getItem('customers')) || [];
  let invoices = JSON.parse(localStorage.getItem('invoices')) || [];

  function saveData() {
      localStorage.setItem('customers', JSON.stringify(customers));
      localStorage.setItem('invoices', JSON.stringify(invoices));
  }

  function renderCustomers(filter = null) {
      const tbody = document.querySelector('#customer-table tbody');
      if (!tbody) return;

      tbody.innerHTML = '';

      const data = filter || customers;

      data.forEach((cust) => {
          const index = customers.indexOf(cust);
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${cust.name}</td>
              <td>${cust.company}</td>
              <td>${cust.email}</td>
              <td>${cust.mobile}</td>
              <td class="status-cell" data-index="${index}">
                  <span class="status-text status-${cust.status.toLowerCase()}">${cust.status}</span>
                  <select class="status-select" style="display:none;">
                      <option value="Active" ${cust.status === 'Active' ? 'selected' : ''}>Active</option>
                      <option value="Inactive" ${cust.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                  </select>
              </td>
              <td class="actions">
                  <span class="edit-icon" data-index="${index}">✏️</span>
                  <span class="delete-icon" data-index="${index}">🗑️</span>
              </td>
          `;
          tbody.appendChild(tr);
      });
  }

  function renderInvoices(filter = null) {
      const tbody = document.querySelector('#invoice-table tbody');
      if (!tbody) return;

      tbody.innerHTML = '';

      const data = filter || invoices;

      data.forEach((inv) => {
          const index = invoices.indexOf(inv);
          let statusClass = '';
          if (inv.paymentStatus === 'Paid') statusClass = 'paid';
          else if (inv.paymentStatus === 'Partially paid') statusClass = 'partially';
          else if (inv.paymentStatus === 'Unpaid') statusClass = 'unpaid';

          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${inv.number}</td>
              <td>${inv.customer}</td>
              <td>${inv.date}</td>
              <td>${inv.dueDate}</td>
              <td class="status-cell" data-index="${index}">
                  <span class="status-text status-${statusClass}">${inv.paymentStatus}</span>
                  <select class="status-select" style="display:none;">
                      <option value="Paid" ${inv.paymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
                      <option value="Partially paid" ${inv.paymentStatus === 'Partially paid' ? 'selected' : ''}>Partially paid</option>
                      <option value="Unpaid" ${inv.paymentStatus === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
                  </select>
              </td>
              <td class="actions">
                  <span class="edit-icon" data-index="${index}">✏️</span>
                  <span class="delete-icon" data-index="${index}">🗑️</span>
              </td>
          `;
          tbody.appendChild(tr);
      });
  }

  function populateCustomersSelect() {
      const select = document.getElementById('customer-select');
      if (!select) return;
      select.innerHTML = '';
      customers.forEach(cust => {
          const option = document.createElement('option');
          option.value = cust.name;
          option.textContent = cust.name;
          select.appendChild(option);
      });
  }

  function filterCustomers() {
      const search = document.getElementById('customer-search').value.toLowerCase();
      const status = document.getElementById('status-filter').value;

      const filtered = customers.filter(cust => {
          const matchesSearch = 
              cust.name.toLowerCase().includes(search) || 
              cust.company.toLowerCase().includes(search) ||
              cust.email.toLowerCase().includes(search);
          const matchesStatus = status === 'Status' || cust.status === status;
          return matchesSearch && matchesStatus;
      });

      renderCustomers(filtered);
  }

  function filterInvoices() {
      const search = document.getElementById('invoice-search').value.toLowerCase();
      const status = document.getElementById('payment-filter').value;

      const filtered = invoices.filter(inv => {
          const matchesSearch = 
              inv.number.toLowerCase().includes(search) || 
              inv.customer.toLowerCase().includes(search);
          const matchesStatus = status === 'Payment status' || inv.paymentStatus === status;
          return matchesSearch && matchesStatus;
      });

      renderInvoices(filtered);
  }

  if (page === 'customer') {
      renderCustomers();

      const modal = document.getElementById('customer-modal');
      const form = document.getElementById('customer-form');
      const title = document.getElementById('modal-title');
      const addBtn = document.getElementById('add-customer-btn');
      const cancelBtn = document.querySelector('.cancel-btn');
      let editIndex = -1;

      addBtn.addEventListener('click', () => {
          title.textContent = 'Add Customer';
          form.reset();
          editIndex = -1;
          modal.style.display = 'flex';
      });

      cancelBtn.addEventListener('click', () => {
          modal.style.display = 'none';
      });

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          const customer = {
              name: document.getElementById('name').value,
              company: document.getElementById('company').value,
              email: document.getElementById('email').value,
              mobile: document.getElementById('mobile').value,
              address: document.getElementById('address').value,
              status: 'Active' // Default status
          };
          if (editIndex === -1) {
              customers.push(customer);
          } else {
              customers[editIndex] = customer;
          }
          saveData();
          renderCustomers();
          modal.style.display = 'none';
      });

      document.querySelector('#customer-table').addEventListener('click', (e) => {
          if (e.target.classList.contains('edit-icon')) {
              editIndex = e.target.dataset.index;
              const cust = customers[editIndex];
              document.getElementById('name').value = cust.name;
              document.getElementById('company').value = cust.company;
              document.getElementById('email').value = cust.email;
              document.getElementById('mobile').value = cust.mobile;
              document.getElementById('address').value = cust.address;
              title.textContent = 'Edit Customer';
              modal.style.display = 'flex';
          } else if (e.target.classList.contains('delete-icon')) {
              const deleteModal = document.getElementById('delete-modal');
              const deleteBtn = document.querySelector('.delete-btn');
              const cancelDelete = document.querySelector('.cancel-btn');
              const closeX = document.querySelector('.close-x');

              deleteModal.style.display = 'flex';
              const index = e.target.dataset.index;

              deleteBtn.onclick = () => {
                  customers.splice(index, 1);
                  saveData();
                  renderCustomers();
                  deleteModal.style.display = 'none';
              };

              cancelDelete.onclick = () => deleteModal.style.display = 'none';
              closeX.onclick = () => deleteModal.style.display = 'none';
          } else {
              const statusCell = e.target.closest('.status-cell');
              if (!statusCell) return;

              const statusText = statusCell.querySelector('.status-text');
              const statusSelect = statusCell.querySelector('.status-select');

              if (statusText && statusSelect) {
                  statusCell.classList.add('editing');
                  statusSelect.style.display = 'block';
                  statusSelect.focus();

                  // Save on change or blur
                  const saveStatus = () => {
                      const newStatus = statusSelect.value;
                      const index = statusCell.dataset.index;
                      customers[index].status = newStatus;
                      saveData();
                      renderCustomers(); // refresh table
                  };

                  statusSelect.addEventListener('change', saveStatus, { once: true });
                  statusSelect.addEventListener('blur', saveStatus, { once: true });
              }
          }
      });

      // Search and filter
      document.getElementById('customer-search').addEventListener('input', filterCustomers);
      document.getElementById('status-filter').addEventListener('change', filterCustomers);
  }

  if (page === 'invoice') {
      populateCustomersSelect();
      renderInvoices();

      const modal = document.getElementById('invoice-modal');
      const form = document.getElementById('invoice-form');
      const title = document.getElementById('invoice-modal-title');
      const addBtn = document.getElementById('add-invoice-btn');
      const cancelBtn = document.querySelector('.cancel-btn');
      let editIndex = -1;

      addBtn.addEventListener('click', () => {
          title.textContent = 'Add Invoice';
          form.reset();
          editIndex = -1;
          modal.style.display = 'flex';
      });

      cancelBtn.addEventListener('click', () => {
          modal.style.display = 'none';
      });

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          const invoice = {
              number: document.getElementById('number').value,
              customer: document.getElementById('customer-select').value,
              date: document.getElementById('date').value,
              dueDate: document.getElementById('due-date').value,
              qty: document.getElementById('qty').value,
              rate: document.getElementById('rate').value,
              description: document.getElementById('description').value,
              paymentStatus: 'Unpaid' // Default
          };
          if (editIndex === -1) {
              invoices.push(invoice);
          } else {
              invoices[editIndex] = invoice;
          }
          saveData();
          renderInvoices();
          modal.style.display = 'none';
      });

      document.querySelector('#invoice-table').addEventListener('click', (e) => {
          if (e.target.classList.contains('edit-icon')) {
              editIndex = e.target.dataset.index;
              const inv = invoices[editIndex];
              document.getElementById('number').value = inv.number;
              document.getElementById('customer-select').value = inv.customer;
              document.getElementById('date').value = inv.date;
              document.getElementById('due-date').value = inv.dueDate;
              document.getElementById('qty').value = inv.qty;
              document.getElementById('rate').value = inv.rate;
              document.getElementById('description').value = inv.description;
              title.textContent = 'Edit Invoice';
              modal.style.display = 'flex';
          } else if (e.target.classList.contains('delete-icon')) {
              const deleteModal = document.getElementById('delete-modal');
              const deleteBtn = document.querySelector('.delete-btn');
              const cancelDelete = document.querySelector('.cancel-btn');
              const closeX = document.querySelector('.close-x');

              deleteModal.style.display = 'flex';
              const index = e.target.dataset.index;

              deleteBtn.onclick = () => {
                  invoices.splice(index, 1);
                  saveData();
                  renderInvoices();
                  deleteModal.style.display = 'none';
              };

              cancelDelete.onclick = () => deleteModal.style.display = 'none';
              closeX.onclick = () => deleteModal.style.display = 'none';
          } else {
              const statusCell = e.target.closest('.status-cell');
              if (!statusCell) return;

              const statusText = statusCell.querySelector('.status-text');
              const statusSelect = statusCell.querySelector('.status-select');

              if (statusText && statusSelect) {
                  statusCell.classList.add('editing');
                  statusSelect.style.display = 'block';
                  statusSelect.focus();

                  const saveStatus = () => {
                      const newStatus = statusSelect.value;
                      const index = statusCell.dataset.index;
                      invoices[index].paymentStatus = newStatus;
                      saveData();
                      renderInvoices(); // refresh table
                  };

                  statusSelect.addEventListener('change', saveStatus, { once: true });
                  statusSelect.addEventListener('blur', saveStatus, { once: true });
              }
          }
      });

      // Search and filter
      document.getElementById('invoice-search').addEventListener('input', filterInvoices);
      document.getElementById('payment-filter').addEventListener('change', filterInvoices);
  }

  if (page === 'report') {
      // Report is static, but could be updated if needed. For now, as per PDF.
      // To update "accordingly", perhaps add logic to sum invoices, but since no direct mapping, keeping static.
  }
});