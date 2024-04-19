document.addEventListener("DOMContentLoaded", function () {
  const select = document.querySelectorAll(".currency");
  const number = document.getElementById("number");
  const output = document.getElementById("output");

  fetch("https://api.frankfurter.app/currencies")
    .then((data) => data.json())
    .then((data) => {
      display(data);
    })
    .catch((error) => {
      console.error("Error fetching currency data:", error); // for debugging
    });

  function display(data) {
    const entries = Object.entries(data);
    for (var i = 0; i < entries.length; i++) {
      select[0].innerHTML += `<option value="${entries[i][0]}">${entries[i][0]} : ${entries[i][1]}</option>`;
      select[1].innerHTML += `<option value="${entries[i][0]}">${entries[i][0]} : ${entries[i][1]}</option>`;
    }
  }

  function updatevalue() {
    console.log("Updating value...");
    let currency1 = select[0].value;
    let currency2 = select[1].value;
    let value = number.value;

    // for debugging
    console.log("Currency 1:", currency1);
    console.log("Currency 2:", currency2);
    console.log("Value:", value);

    if (currency1 !== currency2) {
      convert(currency1, currency2, value);
    } else {
      alert("Please choose different currencies.");
    }
  }

  function convert(currency1, currency2, value) {
    fetch(
      `https://api.frankfurter.app/latest?amount=${value}&from=${currency1}&to=${currency2}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok"); // for debugging
        }
        return response.json();
      })
      .then((val) => {
        console.log("Conversion result:", val);
        output.value = Object.values(val.rates)[0];
      })
      .catch((error) => {
        console.error("Error converting currency:", error); // for debugging
      });
  }

  select.forEach((selector) => {
    selector.addEventListener("change", updatevalue);
  });

  number.addEventListener("input", updatevalue);
});
