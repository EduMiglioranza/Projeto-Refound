// Select elements from form
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Select the elements from de list
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

// Captures the input event to format the value
amount.oninput = () => {
    // Get the value of the input and remove non-numeric characters
    let value = amount.value.replace(/\D/g, "")

    // Convert value to cents
    value = Number(value) / 100

    // Update the value of the input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    // Formats the value in the BRL (Brazilian real) format
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value
}


// Capture the form submit event to retrieve the values
form.onsubmit = () => {
    // Prevents the default behavior of reloading the page
    event.preventDefault()

    // Creates an object with the details of the new expense
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
}

// Add a new item to the list
function expenseAdd(newExpense){
    try{
        // Creates the element to add the item (li) to the list (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // creating category icon
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Creating info expense
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Creating expense name
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Creating expense category
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Add name and category in the expense information div
        expenseInfo.append(expenseName, expenseCategory)

        // Creating expense amount
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`

        // Creating the romove icon
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        // Add the informations in the item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // Add the item in the list
        expenseList.append(expenseItem)

        // Clear the form to create a new entry
        formClear()

        // Update the total value
        updateTotals()

    } catch (error) {
        alert("Não foi possivel atualizar a lista de despezas")
        console.log(error)
    }
}


// Update the total value
function updateTotals() {
    try{
        // Retrieves all items (li) from the list (ul)
        const items = expenseList.children

        // Update the quantity os itens in the list
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        // Counting total
        let total = 0

        // Read the every item (li) in the list (ul)
        for (let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            // Remover caracteres não numéricos e substitui a virgula por ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            // Converte o valor para float
            value = parseFloat(value)

            // Verifica se é um numero valido
            if (isNaN(value)){
                return alert("Não foi possivel calcular o total. O valor não parece ser um numero.")
            }

            // Update the total
            total += Number(value)
        }

        // Creating span to add R$ in format
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"
        
        // Formats the amount and removes the R$ symbol, which will be displayed by the `small` class with a custom style
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
        
        // Clears the content of the element
        expensesTotal.innerHTML = ""

        // Adds the currency symbol and the formatted amount
        expensesTotal.append(symbolBRL, total)

    } catch {
        console.log(error)
        alert("Não foi possivel atualizar os totais")
    }
}

// Event that captures clicks on list items
expenseList.addEventListener("click",function(event){
    // Checks whether the clicked element is the item to be removed
    if (event.target.classList.contains("remove-icon")){
        // Get the ID of the clicked element
        const item = event.target.closest(".expense")

        // Remove the item from the list
        item.remove()
    }

    // Update totals
    updateTotals()
})


// Function that clears the form
function formClear(){
    // clear the inputs
    expense.value = ""
    category.value = ""
    amount.value = ""

    // Focus on the a name after a entry
    expense.focus()
}