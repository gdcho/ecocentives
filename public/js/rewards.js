function saveRedemptionDocumentIDAndRedirect() {
    const docID = Date.now().toString() + Math.floor(Math.random() * 100000).toString();
    localStorage.setItem('redemptionDocID', docID);
    window.location.href = 'redemption.html';
  }
  