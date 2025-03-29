document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const foodNameInput = document.getElementById("food-name");
  const caloriesInput = document.getElementById("calories");
  const proteinInput = document.getElementById("protein");
  const carbsInput = document.getElementById("carbs");
  const fatInput = document.getElementById("fat");
  const addFoodBtn = document.getElementById("add-food");
  const foodListTable = document.getElementById("food-list");
  const clearAllBtn = document.getElementById("clear-all");

  // Elementos totais
  const totalCaloriesEl = document.getElementById("total-calories");
  const totalProteinEl = document.getElementById("total-protein");
  const totalCarbsEl = document.getElementById("total-carbs");
  const totalFatEl = document.getElementById("total-fat");

  // Array para armazenar os alimentos
  let foods = [];

  // Carregar dados do localStorage se existirem
  loadFromLocalStorage();

  // Atualizar totais
  updateTotals();

  // Event Listeners
  addFoodBtn.addEventListener("click", addFood);
  clearAllBtn.addEventListener("click", clearAll);

  // Função para adicionar alimento
  function addFood() {
    const name = foodNameInput.value.trim();
    const calories = parseFloat(caloriesInput.value) || 0;
    const protein = parseFloat(proteinInput.value) || 0;
    const carbs = parseFloat(carbsInput.value) || 0;
    const fat = parseFloat(fatInput.value) || 0;

    if (!name) {
      alert("Por favor, insira o nome do alimento.");
      return;
    }

    const food = {
      id: Date.now(),
      name,
      calories,
      protein,
      carbs,
      fat,
    };

    foods.push(food);
    saveToLocalStorage();
    renderFoodList();
    updateTotals();
    clearInputs();
  }

  // Função para renderizar a lista de alimentos
  function renderFoodList() {
    foodListTable.innerHTML = "";

    foods.forEach((food) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${food.name}</td>
                <td>${food.calories}</td>
                <td>${food.protein}</td>
                <td>${food.carbs}</td>
                <td>${food.fat}</td>
                <td><button class="delete-btn" data-id="${food.id}">Remover</button></td>
            `;

      foodListTable.appendChild(row);
    });

    // Adicionar event listeners aos botões de remover
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        removeFood(id);
      });
    });
  }

  // Função para remover alimento
  function removeFood(id) {
    foods = foods.filter((food) => food.id !== id);
    saveToLocalStorage();
    renderFoodList();
    updateTotals();
  }

  // Função para atualizar os totais
  function updateTotals() {
    const totals = foods.reduce(
      (acc, food) => {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fat += food.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    totalCaloriesEl.textContent = totals.calories.toFixed(1);
    totalProteinEl.textContent = totals.protein.toFixed(1);
    totalCarbsEl.textContent = totals.carbs.toFixed(1);
    totalFatEl.textContent = totals.fat.toFixed(1);
  }

  // Função para limpar todos os alimentos
  function clearAll() {
    if (confirm("Tem certeza que deseja limpar todos os alimentos?")) {
      foods = [];
      saveToLocalStorage();
      renderFoodList();
      updateTotals();
    }
  }

  // Função para limpar os inputs
  function clearInputs() {
    foodNameInput.value = "";
    caloriesInput.value = "";
    proteinInput.value = "";
    carbsInput.value = "";
    fatInput.value = "";
    foodNameInput.focus();
  }

  // Função para salvar no localStorage
  function saveToLocalStorage() {
    localStorage.setItem("nutritionCalculatorFoods", JSON.stringify(foods));
  }

  // Função para carregar do localStorage
  function loadFromLocalStorage() {
    const savedFoods = localStorage.getItem("nutritionCalculatorFoods");
    if (savedFoods) {
      foods = JSON.parse(savedFoods);
      renderFoodList();
    }
  }
});
