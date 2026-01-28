/* =========================================================
   transactions.js
   UI + interaction layer (with Include / Exclude)
   ========================================================= */

   let allTransactions = null;       // FULL API response
   let currentMappings = {};         // { company1Id: [ {id, amount} ] }
   
   $(document).ready(function () {
     fetchTransactions();
   
     $("#reconcileBtn").on("click", handleReconcileClick);
     $("#excludeBtn").on("click", handleExcludeClick);
   });
   
   /* =========================================================
      FETCH
      ========================================================= */
   function fetchTransactions() {
     $.ajax({
       url: "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction",
       method: "GET",
       headers: {
         Authorization: "Bearer " + localStorage.getItem("token")
       },
       success: function (response) {
         allTransactions = response;
         currentMappings = {};
         renderUnreconciled();
         renderReconciled();
         renderExcluded();
       },
       error: function () {
         alert("Failed to fetch transactions");
       }
     });
   }
   
   /* =========================================================
      NORMALIZE API → UI MODEL
      ========================================================= */
   function normalizeTransactions(apiResponse) {
     const result = [];
   
     apiResponse.fromCompanyTransaction?.forEach(txn => {
       result.push({
         id: txn.transactionId,
         type: txn.transactionType,
         date: txn.date,
         amount: txn.amount,
         company: "Company1"
       });
     });
   
     apiResponse.toCompanyTransaction?.forEach(txn => {
       result.push({
         id: txn.transactionId,
         type: txn.transactionType,
         date: txn.date,
         amount: txn.amount,
         company: "Company2"
       });
     });
   
     return result;
   }
   
   /* =========================================================
      UI BUILDERS
      ========================================================= */
   function checkboxHtml() {
     return `<input type="checkbox" class="txn-checkbox me-2">`;
   }
   
   function createCompany1Row(txn) {
     return `
       <div class="recon-row mb-3" data-company1-id="${txn.id}">
         <div class="txn-card" data-id="${txn.id}">
           ${checkboxHtml()}
           <span>${txn.type} : ${txn.date}</span>
           <strong class="ms-auto">$${txn.amount}</strong>
         </div>
   
         <ul class="drop-zone connected-sortable"
             data-company1-id="${txn.id}"
             data-required="${txn.amount}">
           <li ></li>
         </ul>
       </div>
     `;
   }
   
   function createCompany2Card(txn) {
     return `
       <li class="txn-card mb-2 draggable"
           data-id="${txn.id}"
           data-amount="${txn.amount}">
         ${checkboxHtml()}
         <span>${txn.type} : ${txn.date}</span>
         <strong class="ms-auto">$${txn.amount}</strong>
       </li>
     `;
   }
   
   /* =========================================================
      UNRECONCILED VIEW
      ========================================================= */
   function renderUnreconciled() {
     $("#company1List").empty();
     $("#company2List").empty();
   
     const data = normalizeTransactions(allTransactions);
     const excluded = getExcluded();
     const reconciled = getReconciled();
   
     data.forEach(txn => {
   
       //  SINGLE SOURCE OF TRUTH
       if (
         excluded.includes(txn.id) ||
         reconciled.some(r =>
           r.company1Id === txn.id || r.company2Ids.includes(txn.id)
         )
       ) return;
   
       if (txn.company === "Company1") {
         $("#company1List").append(createCompany1Row(txn));
       } else {
         $("#company2List").append(createCompany2Card(txn));
       }
     });
   
     enableSortable();
   }
   
   /* =========================================================
      SORTABLE (DRAG & DROP)
      ========================================================= */
   function enableSortable() {
   
     $("#company2List").sortable({
       connectWith: ".connected-sortable",
       placeholder: "sortable-placeholder",
       forcePlaceholderSize: true
     });
   
     $(".connected-sortable").sortable({
       connectWith: "#company2List",
       placeholder: "sortable-placeholder",
   
       receive: function (event, ui) {
         const company1Id = Number($(this).data("company1-id"));
         const txnId = Number(ui.item.data("id"));
         const amount = Number(ui.item.data("amount"));
   
         currentMappings[company1Id] ??= [];
   
         if (currentMappings[company1Id].some(t => t.id === txnId)) {
           ui.sender.sortable("cancel");
           return;
         }
   
         $(this).find(".placeholder").remove();
         currentMappings[company1Id].push({ id: txnId, amount });
       }
     });
   }
   
   /* =========================================================
      RECONCILE BUTTON
      ========================================================= */
   function handleReconcileClick() {
   
     let didReconcile = false;
   
     Object.entries(currentMappings).forEach(([company1Id, txns]) => {
   
       const zone = $(`.connected-sortable[data-company1-id="${company1Id}"]`);
       const required = Number(zone.data("required"));
       const total = txns.reduce((s, t) => s + t.amount, 0);
   
       if (total === required) {
         saveReconciled(Number(company1Id), txns);
         delete currentMappings[company1Id];
         didReconcile = true;
       }
     });
   
     if (!didReconcile) {
       alert("Debit and Credit do not match");
       return;
     }
   
     fetchTransactions();
   }
   
   /* =========================================================
      EXCLUDE BUTTON
      ========================================================= */
   function handleExcludeClick() {
   
     let excluded = getExcluded();
   
     $(".txn-checkbox:checked").each(function () {
       const id = Number($(this).closest(".txn-card").data("id"));
       if (!excluded.includes(id)) {
         excluded.push(id);
       }
     });
   
     saveExcluded(excluded);
     fetchTransactions();
   }
   
   /* =========================================================
      RECONCILED VIEW — TWO COLUMNS
      ========================================================= */
   function renderReconciled() {
     $("#reconciledList").empty();
   
     const normalized = normalizeTransactions(allTransactions);
     const reconciled = getReconciled();
   
     if (!reconciled.length) {
       $("#reconciledList").html(`<div class="text-muted">No reconciled transactions</div>`);
       return;
     }
   
     reconciled.forEach(r => {
   
       const c1 = normalized.find(t => t.id === r.company1Id);
       if (!c1) return;
   
       const c2Txns = r.company2Ids
         .map(id => normalized.find(t => t.id === id))
         .filter(Boolean);
   
       $("#reconciledList").append(`
         <div class="border rounded p-3 mb-4 bg-light">
           <div class="row">
   
             <div class="col-md-6">
               <h6>Company 1</h6>
               <div class="txn-card">
                 <span>${c1.type} : ${c1.date}</span>
                 <strong>$${c1.amount}</strong>
               </div>
             </div>
   
             <div class="col-md-6">
               <h6>Company 2</h6>
               ${c2Txns.map(t => `
                 <div class="txn-card mt-2">
                   <span>${t.type} : ${t.date}</span>
                   <strong>$${t.amount}</strong>
                 </div>
               `).join("")}
             </div>
           </div>
   
           <div class="text-end mt-3">
             <button class="btn btn-sm btn-outline-danger"
                     onclick="unreconcile('${r.id}'); fetchTransactions();">
               Un-reconcile
             </button>
           </div>
         </div>
       `);
     });
   }
   
   /* =========================================================
      EXCLUDED VIEW (checkbox shown, Include handled elsewhere)
      ========================================================= */
   function renderExcluded() {
     $("#excludedList").empty();
   
     const normalized = normalizeTransactions(allTransactions);
     const excluded = getExcluded();
   
     if (!excluded.length) {
       $("#excludedList").html(`<div class="text-muted">No excluded transactions</div>`);
       return;
     }
   
     excluded.forEach(id => {
       const txn = normalized.find(t => t.id === id);
       if (!txn) return;
   
       $("#excludedList").append(`
         <div class="txn-card bg-secondary bg-opacity-25 mb-2"
              data-id="${txn.id}">
           <input type="checkbox" class="include-checkbox me-2">
           <span>${txn.type} : ${txn.date}</span>
           <strong class="ms-auto">$${txn.amount}</strong>
         </div>
       `);
     });
   }
   