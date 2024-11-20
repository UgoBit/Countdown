/* DUST */
document.addEventListener("DOMContentLoaded", function () {
  const particleContainer = document.getElementById("particle-container");

  for (let i = 0; i < 200; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${10 + Math.random() * 10}s`; // Chaque particule a une durée d'animation différente

    const animationType = Math.floor(Math.random() * 3); // 3 types d'animations
    switch (animationType) {
      case 0:
        particle.style.animationName = "floatParticleA";
        break;
      case 1:
        particle.style.animationName = "floatParticleB";
        break;
    }

    particleContainer.appendChild(particle);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialiser Flatpickr
  flatpickr("#targetDate", {
    enableTime: true,
    dateFormat: "Y-m-d H:i", // Format de la valeur enregistrée
    time_24hr: true,
  });

  // Écouter la soumission du formulaire
  document
    .getElementById("countdownForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Empêcher le rechargement de la page
      startCountdown(); // Lancer le compte à rebours
    });

  // Écouter le clic sur le bouton Partager
  document.getElementById("shareButton").addEventListener("click", function () {
    const targetDateInput = document.getElementById("targetDate").value;
    const displayOption = document.getElementById("displayOptionHidden").value;

    if (!targetDateInput || !displayOption) {
      alert(
        "Veuillez entrer une date et sélectionner un format d'affichage avant de partager."
      );
      return;
    }

    // Créer l'URL de partage
    const currentUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${currentUrl}?date=${encodeURIComponent(
      targetDateInput
    )}&format=${encodeURIComponent(displayOption)}`;

    // Copier l'URL de partage dans le presse-papier
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Lien de partage copié dans le presse-papier !");
      })
      .catch((err) => {
        console.error("Erreur lors de la copie du lien de partage : ", err);
      });
  });

  // Vérifier si des paramètres d'URL existent et démarrer le compte à rebours automatiquement
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get("date");
  const formatParam = urlParams.get("format");

  if (dateParam && formatParam) {
    document.getElementById("targetDate").value = dateParam;
    document.getElementById("displayOptionHidden").value = formatParam;
    startCountdown(); // Lancer automatiquement le compte à rebours si les paramètres sont valides
  }
});

// Variables pour le sélecteur personnalisé
const customSelect = document.getElementById("customSelect");
const options = document.querySelectorAll(".option");
const hiddenInput = document.getElementById("displayOptionHidden");

// Gérer l'ouverture du menu déroulant
customSelect.addEventListener("click", (e) => {
  e.stopPropagation(); // Empêcher l'événement de se propager au document
  if (!customSelect.classList.contains("open")) {
    customSelect.classList.add("open");
  }
});

// Gérer la sélection d'une option
options.forEach((option) => {
  option.addEventListener("click", (e) => {
    e.stopPropagation(); // Empêcher l'événement de se propager au parent
    document.querySelector(".selected-option").innerText = option.innerText;
    hiddenInput.value = option.getAttribute("data-value"); // Stocker la valeur dans l'input caché
    customSelect.classList.remove("open");
  });
});

// Fermer le menu si l'utilisateur clique en dehors du menu
document.addEventListener("click", () => {
  customSelect.classList.remove("open");
});

let countdownInterval; // Variable pour l'intervalle

function startCountdown() {
  const targetDateInput = document.getElementById("targetDate").value;
  const targetDate = flatpickr.parseDate(targetDateInput, "Y-m-d H:i");
  const displayOption = hiddenInput.value;

  if (!targetDate || isNaN(targetDate.getTime())) {
    alert("Veuillez entrer une date valide.");
    return;
  }

  if (!displayOption) {
    alert("Veuillez sélectionner un format d'affichage.");
    return;
  }

  // Vider l'affichage du compte à rebours avant de commencer
  const countdownDisplay = document.getElementById("countdownDisplay");
  if (!countdownDisplay) {
    return;
  }
  countdownDisplay.innerHTML = "";

  // Début de l'intervalle du compte à rebours
  clearInterval(countdownInterval); // Si un intervalle est déjà en cours, le stopper
  countdownInterval = setInterval(function () {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.innerHTML = "Temps écoulé !";
      return;
    }

    updateDisplay(difference, displayOption);
  }, 1000);
}

function updateDisplay(difference, option) {
  const totalSeconds = Math.floor(difference / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));

  let displayText = "";

  function formatWithDecimal(value) {
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
  }

  switch (option) {
    case "full":
      displayText = `${days}j ${hours}h ${minutes}m ${seconds}s`;
      break;
    case "years":
      displayText = `${formatWithDecimal(
        difference / (365.25 * 24 * 60 * 60 * 1000)
      )} annee(s)`;
      break;
    case "months":
      displayText = `${formatWithDecimal(
        difference / (30.44 * 24 * 60 * 60 * 1000)
      )} mois`;
      break;
    case "days":
      displayText = `${formatWithDecimal(
        difference / (24 * 60 * 60 * 1000)
      )} jour(s)`;
      break;
    case "hours":
      displayText = `${formatWithDecimal(
        difference / (60 * 60 * 1000)
      )} heure(s)`;
      break;
    case "minutes":
      displayText = `${formatWithDecimal(difference / (60 * 1000))} minute(s)`;
      break;
    case "seconds":
      displayText = `${totalSeconds} seconde(s)`;
      break;
    default:
      displayText = `${days}j ${hours}h ${minutes}m ${seconds}s`;
      break;
  }

  // Mettre à jour le contenu de la div
  const countdownDisplay = document.getElementById("countdownDisplay");
  if (countdownDisplay) {
    countdownDisplay.innerHTML = displayText;

    // Ajouter l'animation
    countdownDisplay.classList.add("animate");

    // Retirer l'animation après un petit délai pour pouvoir la réactiver
    setTimeout(() => {
      countdownDisplay.classList.remove("animate");
    }, 900);
  }
}
