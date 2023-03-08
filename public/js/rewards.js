function saveRedemptionDocumentIDAndRedirect(){
    let params = new URL(window.location.href) 
    let ID = params.searchParams.get("docID");
    localStorage.setItem('redemptionDocID', ID);
    window.location.href = 'redemption.html';
}