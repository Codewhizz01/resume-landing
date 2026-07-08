const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const toggleButtons = document.querySelectorAll(".toggle-password");

function handleTogglePassword(event) {
  const button = event.currentTarget;
  const targetId = button.getAttribute("data-target");
  const input = document.getElementById(targetId);

  if (input.type === "password") {
    input.type = "text";
    button.setAttribute("aria-label", "Hide password");
  } else {
    input.type = "password";
    button.setAttribute("aria-label", "Show password");
  }
}

toggleButtons.forEach((button) => {
  button.addEventListener("click", handleTogglePassword);
});

const navLinks = document.querySelectorAll(".nav-links a");

function highlightLink(event) {
  event.currentTarget.style.color = "#f4f4f5";
}

function resetLink(event) {
  event.currentTarget.style.color = "";
}

navLinks.forEach((link) => {
  link.addEventListener("mouseover", highlightLink);
  link.addEventListener("mouseout", resetLink);
});