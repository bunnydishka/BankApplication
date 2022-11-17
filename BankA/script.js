const getElement = function(select){
  return document.querySelector(select)
}
const apiUrl = "https://api.exchangerate.host"
const currForm = getElement("#currencyForm");
const currencyInp = getElement("#currencyInp");
const inpTo = getElement("#toInput");
const currencyDescriptor = getElement("#currencyDescriptor");
const toCurrency = getElement("#toCurrency");
const alertInfo = getElement('.alert');
//https://imask.js.org/guide.html

const currencyMask = {
  mask: Number,
  thousandsSeparator: " ",
  radix: ".",
  scale: 4,
  max: Number.MAX_VALUE,
  padFractionalZeros: false,
  normalizeZeros: true
};
const from = IMask(currencyInp, currencyMask);
const to = IMask(inpTo, currencyMask);

const showAlert = (message) => {
  alertInfo.innerHTML = message;
  alertInfo.style.display = 'block';
}
const loading = function(){
  window.addEventListener('load', e => getData());
  window.addEventListener("online", () => alertInfo.style.display = 'none');
}
async function getData(flag = true) {
  const currencyForm = new FormData(currForm);
  const base = currencyForm.get("btnbase");
  const symbol = currencyForm.get("btnTo");
  if(!navigator.onLine) {
    showAlert('There are problems in connection');
    from.value = '1';
    return;
  }
  let currencyRate ;

  if(base !== symbol) {
    const url = new URL("/lates",apiUrl );
    url.searchParams.set("base", base);
    url.searchParams.set("symbols", symbol);
    url.searchParams.set("places", 4);
    const data = await fetch(url)
    .then((r) => r.json())
    .catch(e => showAlert('Sorry! We have a problem with API.'));
    currencyRate = await data.rates[symbol];
  }
  else {
    currencyRate = 1;
  }

  currencyDescriptor.innerHTML = `1 ${base} = ${currencyRate.toFixed(4)} ${symbol}`;
  toCurrency.innerHTML = `1 ${symbol} = ${(1 / currencyRate).toFixed(4)} ${base}`;
  
  if (flag) 
    to.value = (Math.round(from.unmaskedValue * currencyRate * 10000) / 10000).toString();
  else 
    from.value = (Math.round(to.unmaskedValue * (1 / currencyRate) * 10000) / 10000).toString();
}



loading();
currForm.addEventListener("input", e => {
  e.target.name === "toInput" ? getData(false) : getData();
});

