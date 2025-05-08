let fromCurrency = document.getElementById("fromCurrency");
let convert = document.getElementById("convert");
let result = document.getElementById("result");
let toCurrency = document.getElementById("toCurrency");
let amountInput = document.getElementById("amount");
let mjArr = [];

fetch("https://api.currencyfreaks.com/v2.0/currency-symbols")
  .then((r) => r.json())
  .then((d) => {
    Object.entries(d.currencySymbols).forEach(([code, name]) => {
      mjArr.push({ a: code, b: name });
    });
    mjArr.sort((a, b) => a.a.localeCompare(b.a));


    mjArr.forEach((currency) => {
      let createOption1 = document.createElement("option");
      createOption1.value = currency.a;
      createOption1.textContent = `${currency.a} - ${currency.b}`;
      fromCurrency.appendChild(createOption1);

      let createOption2 = document.createElement("option");
      createOption2.value = currency.a;
      createOption2.textContent = `${currency.a} - ${currency.b}`;
      toCurrency.appendChild(createOption2);
    });

    console.log("Sorted Currencies:", mjArr);
  })
  .catch((error) => console.error("Error fetching currency data:", error));
convert.addEventListener("click",()=>

    {
        let from = fromCurrency.value;
        let to = toCurrency.value;
        let amount = amountInput.value;
        
        fetch("https://api.currencyfreaks.com/latest?apikey=5e1d6881dc4042c0a1bf8d50587eba5c")
        .then((r) => r.json())
        .then((d) => {
            

            
            let fromRate = d.rates[from];
            let toRate = d.rates[to];
            let exchangeRate = toRate / fromRate;
            let convertedAmount = (amount * exchangeRate).toFixed(2);
            
            result.innerText = `Converted Amount: ${convertedAmount} ${to}`;
            
            
        })
    }

)
