let exOptions = $('#exOptions');
let clearHistory = $('#clearHistory');
const historyContainer = $('#historyContainer');

clearHistory.click(function(e) {
  chrome.storage.local.set({history: []}, function() {
    console.log("History has been cleared.");
  });
  historyContainer.empty();
});

exOptions.click(function(e) {
  window.location.href = '../views/options.html';
});

$(document).ready(function(){
  chrome.storage.local.get(['history'], ({history}) => {
    history.forEach((item, index) => {
      insertHistoryRow(item, index);
    });
  });
  
});

historyContainer.bind("DOMNodeInserted",function(){

  $('.btn-copy').click(function(e){
    const text = $(this).attr('data-copy');
    copyToClipboard(text);
  });

});

const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {  
    const successful = document.execCommand('copy');  
    const msg = successful ? 'successful' : 'unsuccessful';  
    console.log('Copy command was ' + msg);  
  } catch(err) {  
    console.log('Oops, unable to copy');  
  } 
  document.body.removeChild(textArea);
}

const insertHistoryRow = (item, index) => {
  const historyRow = document.createElement('tr');

  const historyEntryHeading = document.createElement('th');
  historyEntryHeading.setAttribute('scope', 'row');
  historyEntryHeading.textContent = index + 1;
  historyRow.appendChild(historyEntryHeading);

  const historyEntryDate = document.createElement('td');
  historyEntryDate.className = 'date-cell text-center';
  historyEntryDate.innerHTML = `
    <span>${item.date}</span>
    <div class="copy-clipboard">
      <button class="btn btn-dark btn-round btn-copy" title="Copy Url" data-copy="${item.url}">
        <i class="fas fa-clipboard"></i>
      </button>
      <a class="btn btn-primary btn-round" title="Navigate to Url" href="${item.url}" target="_blank">
        <i class="fas fa-external-link-alt"></i>
      </a>
    </div>`;
  historyRow.appendChild(historyEntryDate);

  const historyEntryUrl = document.createElement('td');
  historyEntryUrl.className = 'url-cell';
  historyEntryUrl.innerHTML = `<h5 class="title">${item.title}</h5>
  <div class="url-info">
    <small class="text-muted">${item.url}</small>
    <div class="link-cnt mt-1">
      <button type="button" class="btn btn-outline-primary btn-sm" disabled>
        Typed: <span class="badge badge-light">${item.typedCount}</span>
      </button>
      <button type="button" class="btn btn-outline-primary btn-sm" disabled>
        Visited: <span class="badge badge-light">${item.visitCount}</span>
      </button>
      <button type="button" class="btn btn-outline-danger btn-sm ml-5">Delete</button>
    </div>
  </div>`;
  historyRow.appendChild(historyEntryUrl);

  historyContainer.append(historyRow);
}
