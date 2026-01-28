/* =========================================
   reconciliation.js
   Single source of truth + UI renderer
   ========================================= */

   const RECONCILIATION_KEY = "reconciledTransactions";

   /*
     Reconciled record shape:
     {
       id: string,
       company1Id: number,
       company2Ids: number[],
       amount: number,
       reconciledDate: string
     }
   */
   
   /* ---------- INTERNAL STORAGE ---------- */
   function _read() {
     try {
       return JSON.parse(localStorage.getItem(RECONCILIATION_KEY)) || [];
     } catch {
       return [];
     }
   }
   
   function _write(data) {
     localStorage.setItem(RECONCILIATION_KEY, JSON.stringify(data));
   }
   
   /* ---------- PUBLIC API ---------- */
   function getReconciled() {
     return _read();
   }
   
   function saveReconciled(company1Id, company2Txns) {
     const reconciled = _read();
   
     const c1 = Number(company1Id);
     const c2Ids = company2Txns.map(t => Number(t.id));
   
     // prevent duplicate reconciliation
     const exists = reconciled.some(r =>
       r.company1Id === c1 &&
       JSON.stringify([...r.company2Ids].sort()) === JSON.stringify([...c2Ids].sort())
     );
   
     if (exists) return;
   
     reconciled.push({
       id: crypto.randomUUID(),
       company1Id: c1,
       company2Ids: c2Ids,
       amount: company2Txns.reduce((s, t) => s + t.amount, 0),
       reconciledDate: new Date().toISOString()
     });
   
     _write(reconciled);
   }
   
   function unreconcile(reconciliationId) {
     const updated = _read().filter(r => r.id !== reconciliationId);
     _write(updated);
   }
   
   function isTxnReconciled(txnId) {
     return _read().some(r =>
       r.company1Id === txnId ||
       r.company2Ids.includes(txnId)
     );
   }
   
   function clearReconciled() {
     localStorage.removeItem(RECONCILIATION_KEY);
   }
   
   /* =========================================
      UI RENDERING (RECONCILED TAB)
      ========================================= */
   
   function renderReconciledUI(allTransactions) {
     const container = $("#reconciledList");
     container.empty();
   
     const reconciled = getReconciled();
   
     if (!reconciled.length) {
       container.html(`<div class="text-muted">No reconciled transactions</div>`);
       return;
     }
   
     const normalized = normalizeTransactions(allTransactions);
   
     reconciled.forEach(r => {
   
       const company1Txn = normalized.find(t => t.id === r.company1Id);
       if (!company1Txn) return;
   
       const company2Txns = r.company2Ids
         .map(id => normalized.find(t => t.id === id))
         .filter(Boolean);
   
       container.append(`
         <div class="border rounded p-3 mb-4 bg-light">
   
           <div class="row">
             <!-- COMPANY 1 -->
             <div class="col-md-6">
               <h6>Company 1</h6>
               <div class="txn-card mb-2">
                 <span>${company1Txn.type} : ${company1Txn.date}</span>
                 <strong>$${company1Txn.amount}</strong>
               </div>
             </div>
   
             <!-- COMPANY 2 -->
             <div class="col-md-6">
               <h6>Company 2</h6>
               ${company2Txns.map(t => `
                 <div class="txn-card mb-2">
                   <span>${t.type} : ${t.date}</span>
                   <strong>$${t.amount}</strong>
                 </div>
               `).join("")}
             </div>
           </div>
   
           <div class="text-end mt-3">
             <button class="btn btn-sm btn-outline-danger unreconcile-btn"
                     data-id="${r.id}">
               Un-reconcile
             </button>
           </div>
   
         </div>
       `);
     });
   }
   
   /* ---------- UNRECONCILE BUTTON ---------- */
   $(document).on("click", ".unreconcile-btn", function () {
     const id = $(this).data("id");
   
     if (!confirm("Move these transactions back to Unreconciled?")) return;
   
     unreconcile(id);
   
     // reload both tabs cleanly
     renderUnreconciled();
     renderReconciledUI(allTransactions);
   });
   