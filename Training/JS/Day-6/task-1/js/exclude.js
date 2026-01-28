/* =========================================================
   exclude.js
   Include from Excluded → Unreconciled
   ========================================================= */

   $(document).ready(function () {
    $("#includeBtn").on("click", handleIncludeClick);
  });
  
  /* =========================================================
     RENDER EXCLUDED TRANSACTIONS
     ========================================================= */
  function renderExcluded() {
    $("#excludedList").empty();
  
    // Safety: API not loaded yet
    if (!allTransactions) {
      $("#excludedList").html(`<div class="text-muted">Loading...</div>`);
      return;
    }
  
    const excludedIds = getExcluded();
    const allTxns = normalizeTransactions(allTransactions);
  
    if (!excludedIds.length) {
      $("#excludedList").html(`<div class="text-muted">No excluded transactions</div>`);
      return;
    }
  
    excludedIds.forEach(id => {
      const txn = allTxns.find(t => t.id === id);
      if (!txn) return;
  
      $("#excludedList").append(`
        <div class="txn-card d-flex align-items-center mb-2"
             data-id="${txn.id}">
  
          <input type="checkbox"
                 class="form-check-input include-checkbox me-2">
  
          <span class="flex-grow-1">
            ${txn.type} : ${txn.date}
          </span>
  
          <strong>$${txn.amount}</strong>
        </div>
      `);
    });
  }
  
  /* =========================================================
     INCLUDE SELECTED
     ========================================================= */
  function handleIncludeClick() {
  
    let excluded = getExcluded();
  
    const selectedIds = $(".include-checkbox:checked")
      .map(function () {
        return Number($(this).closest(".txn-card").data("id"));
      })
      .get();
  
    if (!selectedIds.length) {
      alert("Please select transactions to include");
      return;
    }
  
    // Remove selected from excluded list
    excluded = excluded.filter(id => !selectedIds.includes(id));
  
    saveExcluded(excluded);
  
    // 🔥 Refresh UI everywhere
    renderExcluded();
    renderUnreconciled();
  }
  