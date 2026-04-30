let year = document.querySelector(".time");

const y = new Date().getFullYear();
year.innerHTML = y;

const buttons = document.querySelectorAll(".notActive");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", () => {
    Toastify({
      text: "Je hebt geen toegang",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #8B7FFF, #6B5FEF)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  });
}
