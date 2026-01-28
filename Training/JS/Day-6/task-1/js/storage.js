/* =========================================
   storage.js
   Single source of truth for localStorage
   ========================================= */

   const STORAGE_KEYS = {
    reconciled: "reconciledTransactions",
    excluded: "excludedTransactions"
  };
  
  /* ---------- SAFE READ ---------- */
  function safeParse(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }
  
  /* ---------- RECONCILED ---------- */
  
  function getReconciled() {
    return safeParse(STORAGE_KEYS.reconciled);
  }
  
  function saveReconciled(data) {
    localStorage.setItem(
      STORAGE_KEYS.reconciled,
      JSON.stringify(data)
    );
  }
  
  /*
    Check if a transaction (Company1 OR Company2)
    is part of any reconciliation
  */
  function isTxnReconciled(txnId) {
    return getReconciled().some(r =>
      r.company1Id === txnId ||
      r.company2Ids.includes(txnId)
    );
  }
  
  /* ---------- EXCLUDED ---------- */
  
  function getExcluded() {
    return safeParse(STORAGE_KEYS.excluded);
  }
  
  function saveExcluded(data) {
    localStorage.setItem(
      STORAGE_KEYS.excluded,
      JSON.stringify(data)
    );
  }
  
  function isExcluded(txnId) {
    return getExcluded().includes(txnId);
  }
  
  /* ---------- HELPERS ---------- */
  
  function excludeTxn(txnId) {
    const excluded = getExcluded();
    if (!excluded.includes(txnId)) {
      excluded.push(txnId);
      saveExcluded(excluded);
    }
  }
  
  function includeTxn(txnId) {
    const updated = getExcluded().filter(id => id !== txnId);
    saveExcluded(updated);
  }
  
  /* ---------- DEBUG / RESET ---------- */
  
  function clearExcluded() {
    localStorage.removeItem(STORAGE_KEYS.excluded);
  }
  
  function clearReconciled() {
    localStorage.removeItem(STORAGE_KEYS.reconciled);
  }
  