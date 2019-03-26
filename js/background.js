chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({'history': []}, function() {
    console.log('Set History to a empty array.');
  });
});

chrome.history.onVisited.addListener(async function(historyItem) {
  let history = await getHistory();
  if(historyItem.url !== 'about:blank'){
    const newEntry = {
      ...historyItem,
      date: formatedDate(new Date()),
      lastVisitTime: formatedDate(historyItem.lastVisitTime),
    }
    history.push(newEntry);
  }
  await setHistory(history);
});

const getHistory = () => {
  return new Promise(resolve => {
    chrome.storage.local.get(['history'], ({history}) => {
      console.log('get local history', history);
      resolve(history);
    });
  });
};

const setHistory = (history) => {
  return new Promise(resolve => {
    chrome.storage.local.set({history: history}, () => {
      console.log('set local history', history);
      resolve('Inserted item in history.');
    });
  });
};

const formatedDate = (date) => (new Date(date)).toLocaleString();
