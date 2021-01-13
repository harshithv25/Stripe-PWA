const amountInput = document.getElementById("payment__input");
const stripe = Stripe("pk_test_51HRuezHkbzSCimCfF9uWchSOCg7HdqwtHE99QVMZtZxoM3hfO6kaWWUXosglpuH9wX3rdmc1K41s3oU9cC1yw00p00S3qYwwcb");

document.querySelector("button").disabled = true;

var purchase = { amount: amountInput.value * 100 };

const form = document.getElementById("payment-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  return pay();
});

var style = {
  base: {
    color: "#32325d",
    fontFamily: "Arial, sans-serif",
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#32325d",
    },
  },
  invalid: {
    fontFamily: "Arial, sans-serif",
    color: "#fa755a",
    iconColor: "#fa755a",
  },
};

const elements = stripe.elements();
const card = elements.create("card", { style: style });
card.mount("#card-element");
card.on("change", (event) => {
  document.querySelector("button").disabled = event.empty;
  document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
});

const pay = async () => {
  await fetch("/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchase),
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      payWithCard(stripe, card, data.clientSecret);
    });
};

const payWithCard = async (stripe, card, clientSecret) => {
  loading(true);
  await stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      },
    })
    .then((res) => {
      if (res.error) {
        showError(res.error.message);
      } else {
        orderComplete(clientSecret);
      }
    });
};

var orderComplete = (paymentIntentId) => {
  loading(false);
  document.querySelector(".result-message a").setAttribute("href", "https://dashboard.stripe.com/test/payments/" + paymentIntentId);
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button").disabled = true;
};

var showError = (errorMsgText) => {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function () {
    errorMsg.textContent = "";
  }, 4000);
};

var loading = function (isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
