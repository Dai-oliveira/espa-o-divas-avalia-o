const form = document.getElementById("feedbackForm");
const categoriaServico = document.getElementById("categoriaServico");
const subservico = document.getElementById("subservico");
const moodButtons = [...document.querySelectorAll(".mood-btn")];
const moodInput = document.getElementById("humor");
const moodText = document.getElementById("moodText");
const rateButtons = [...document.querySelectorAll(".rate-btn")];
const satisfactionInput = document.getElementById("satisfacao");
const satisfactionText = document.getElementById("satisfactionText");
const comentario = document.getElementById("comentario");
const charCount = document.getElementById("charCount");
const autorizaUso = document.getElementById("autorizaUso");
const feedbackList = document.getElementById("feedbackList");
const toast = document.getElementById("toast");
const thankYouCard = document.getElementById("thankYouCard");
const metricTotal = document.getElementById("metricTotal");
const metricAverage = document.getElementById("metricAverage");
const metricRecommend = document.getElementById("metricRecommend");
const filterName = document.getElementById("filterName");
const filterCategory = document.getElementById("filterCategory");
const filterRating = document.getElementById("filterRating");

const STORAGE_KEY = "avaliacoes_clientes";
const OWNER_WHATSAPP_NUMBER = "55996052565";

const satisfactionLabels = {
  "1": "1 - Muito insatisfeita",
  "2": "2 - Insatisfeita",
  "3": "3 - Neutra",
  "4": "4 - Satisfeita",
  "5": "5 - Muito satisfeita"
};

const moodLabels = {
  Encantada: "😍 Encantada",
  Feliz: "😊 Feliz",
  Neutra: "😐 Neutra",
  Triste: "😕 Triste"
};

const serviceCatalog = {
  Cabelos: ["Mechas", "Progressiva", "Tintura", "Corte", "Hidratação"],
  Unhas: ["Manicure e pedicure", "Esmaltação em gel", "Alongamentos em gel"],
  Depilação: ["Depilação"],
  Maquiagem: ["Maquiagem"],
  Penteado: ["Penteado"],
  Massagem: ["Modeladora", "Relaxante", "Drenagem linfática"],
  "Terapias alternativas": ["Reiki", "Barras de Access", "Auriculoterapia", "Cone hindu"],
  Outro: ["Outro"]
};

function loadFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFeedbacks(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function showThankYou(name) {
  thankYouCard.textContent = `Obrigada, ${name}! Seu feedback foi recebido com carinho.`;
  thankYouCard.classList.add("show");
  clearTimeout(showThankYou._timer);
  showThankYou._timer = setTimeout(() => {
    thankYouCard.classList.remove("show");
  }, 2800);
}

function sendToWhatsApp(item) {
  const serviceText = formatServiceLabel(item.servico);
  const comentarioText = item.comentario || "Sem comentário.";
  const autorizacao = item.autorizaUso ? "Sim" : "Não";
  const message = [
    "Nova avaliação recebida:",
    `Nome: ${item.nome}`,
    `Serviço: ${serviceText}`,
    `Humor: ${item.humor || "-"}`,
    `Satisfação: ${item.satisfacao}/5`,
    `Indicaria: ${item.indicaria}`,
    `Autoriza uso nas redes: ${autorizacao}`,
    `Feedback: ${comentarioText}`
  ].join("\n");

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

function setupServiceSelectors() {
  Object.keys(serviceCatalog).forEach((category) => {
    categoriaServico.insertAdjacentHTML(
      "beforeend",
      `<option value="${category}">${category}</option>`
    );
  });
}

function setupFilterCategorySelector() {
  Object.keys(serviceCatalog).forEach((category) => {
    filterCategory.insertAdjacentHTML(
      "beforeend",
      `<option value="${category}">${category}</option>`
    );
  });
}

function resetSubservicoOptions(placeholder) {
  subservico.innerHTML = `<option value="" selected disabled>${placeholder}</option>`;
}

function fillSubservicos(category) {
  const services = serviceCatalog[category] || [];
  subservico.disabled = false;
  resetSubservicoOptions("Selecione um subserviço");

  services.forEach((service) => {
    subservico.insertAdjacentHTML(
      "beforeend",
      `<option value="${service}">${service}</option>`
    );
  });
}

function formatServiceLabel(serviceValue) {
  if (!serviceValue || !serviceValue.includes(" - ")) {
    return serviceValue || "Serviço não informado";
  }

  const parts = serviceValue.split(" - ");
  const category = parts[0]?.trim();
  const subservice = parts.slice(1).join(" - ").trim();

  if (!category || !subservice) {
    return serviceValue;
  }

  if (category.toLowerCase() === subservice.toLowerCase()) {
    return category;
  }

  return `${category} - ${subservice}`;
}

function getServiceCategory(serviceValue) {
  if (!serviceValue || !serviceValue.includes(" - ")) {
    return serviceValue || "";
  }

  return serviceValue.split(" - ")[0]?.trim() || "";
}

function getFilteredItems(items) {
  const nameQuery = filterName.value.trim().toLowerCase();
  const categoryQuery = filterCategory.value;
  const ratingQuery = filterRating.value;

  return items.filter((item) => {
    const nameOk = !nameQuery || item.nome?.toLowerCase().includes(nameQuery);
    const categoryOk = !categoryQuery || getServiceCategory(item.servico) === categoryQuery;
    const ratingOk = !ratingQuery || String(item.satisfacao) === ratingQuery;
    return nameOk && categoryOk && ratingOk;
  });
}

function updateMetrics(items) {
  const total = items.length;
  const average = total
    ? items.reduce((sum, item) => sum + Number(item.satisfacao || 0), 0) / total
    : 0;

  const recommendCount = items.filter((item) => item.indicaria === "Sim").length;
  const recommendRate = total ? Math.round((recommendCount / total) * 100) : 0;

  metricTotal.textContent = String(total);
  metricAverage.textContent = average.toFixed(1).replace(".", ",");
  metricRecommend.textContent = `${recommendRate}%`;
}

function renderFeedbacks() {
  const allItems = loadFeedbacks();
  updateMetrics(allItems);
  feedbackList.innerHTML =
    '<p class="empty">As avaliações são privadas e não ficam visíveis nesta tela.</p>';
}

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moodButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const value = button.dataset.value;
    moodInput.value = value;
    moodText.textContent = moodLabels[value] || "Escolha um emoji";
  });
});

rateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rateButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const value = button.dataset.value;
    satisfactionInput.value = value;
    satisfactionText.textContent = satisfactionLabels[value] || "Escolha de 1 a 5";
  });
});

comentario.addEventListener("input", () => {
  charCount.textContent = comentario.value.length;
});

categoriaServico.addEventListener("change", () => {
  fillSubservicos(categoriaServico.value);
});

[filterName, filterCategory, filterRating].forEach((element) => {
  element.addEventListener("input", renderFeedbacks);
  element.addEventListener("change", renderFeedbacks);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity() || !moodInput.value || !satisfactionInput.value) {
    form.reportValidity();
    if (!moodInput.value) {
      moodText.textContent = "Selecione um emoji para continuar.";
    }
    if (!satisfactionInput.value) {
      satisfactionText.textContent = "Selecione uma nota de satisfação para continuar.";
    }
    return;
  }

  const formData = new FormData(form);
  const categoria = formData.get("categoriaServico").toString();
  const sub = formData.get("subservico").toString();

  const newItem = {
    nome: formData.get("nome").toString().trim(),
    servico: `${categoria} - ${sub}`,
    humor: formData.get("humor").toString(),
    satisfacao: Number(formData.get("satisfacao")),
    indicaria: formData.get("indicaria").toString(),
    autorizaUso: formData.get("autorizaUso") === "Sim",
    comentario: (formData.get("comentario") || "").toString().trim(),
    criadoEm: new Date().toISOString()
  };

  const items = loadFeedbacks();
  items.push(newItem);
  saveFeedbacks(items);

  form.reset();
  moodButtons.forEach((b) => b.classList.remove("active"));
  rateButtons.forEach((b) => b.classList.remove("active"));
  moodInput.value = "";
  moodText.textContent = "Escolha um emoji";
  satisfactionInput.value = "";
  satisfactionText.textContent = "Escolha de 1 a 5";
  charCount.textContent = "0";
  autorizaUso.checked = false;
  subservico.disabled = true;
  resetSubservicoOptions("Primeiro escolha a categoria");

  renderFeedbacks();
  sendToWhatsApp(newItem);
  showThankYou(newItem.nome);
  showToast("Avaliação enviada com sucesso. Obrigada!");
});

setupServiceSelectors();
setupFilterCategorySelector();
renderFeedbacks();
