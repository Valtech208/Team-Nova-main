 let selectedCard = null;

    // MODAL LOGIC
    const modal = document.getElementById("invest-modal");
    const investBtns = document.querySelectorAll(".invest-btn");
    const closeBtn = document.querySelector(".close");

    investBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        selectedCard = e.target.closest(".farm-card");
        modal.style.display = "flex";
      });
    });
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // PAYSTACK PAYMENT
    const paymentForm = document.getElementById("paymentForm");
    paymentForm.addEventListener("submit", payWithPaystack, false);

    function payWithPaystack(e) {
      e.preventDefault();

      const amount = parseInt(document.getElementById("amount").value);

      let handler = PaystackPop.setup({
        key: 'pk_test_xxxxxxxxxxxxxxxxxxxx', // replace with your test key
        email: document.getElementById("email-address").value,
        amount: amount * 100,
        currency: 'NGN',
        ref: ''+Math.floor((Math.random() * 1000000000) + 1),
        metadata: {
          custom_fields: [
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: document.getElementById("full-name").value
            }
          ]
        },
        callback: function(response) {
          alert('Payment successful! Reference: ' + response.reference);

          // --- Update funding progress ---
          if (selectedCard) {
            let funded = parseInt(selectedCard.dataset.funded);
            let goal = parseInt(selectedCard.dataset.goal);

            funded += amount;
            if (funded > goal) funded = goal; // cap at 100%

            selectedCard.dataset.funded = funded;

            let percentage = Math.round((funded / goal) * 100);

            selectedCard.querySelector(".progress").style.width = percentage + "%";
            selectedCard.querySelector(".funding-text").textContent =
              ${funded.toLocaleString()} of ${goal.toLocaleString()} (${percentage}%);
          }

          modal.style.display = "none";
        }
        onClose: function() {
          alert('Payment window closed.');
        }
      });

      handler.openIframe();
    }