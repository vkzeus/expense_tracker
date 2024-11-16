import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

function App() {
  const [income, setIncome] = useState(5000); // Initial income
  const [expenses, setExpenses] = useState([]);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Load data from local storage
  useEffect(() => {
    const storedIncome = localStorage.getItem("income");
    const storedExpenses = localStorage.getItem("expenses");
    if (storedIncome) setIncome(parseFloat(storedIncome));
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
  }, []);

  // Save data to local storage
  useEffect(() => {
    localStorage.setItem("income", income);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [income, expenses]);

  // Add a new expense
  const addExpense = (description, amount) => {
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
    };
    setExpenses([...expenses, newExpense]);
  };

  // Edit an existing expense
  const editExpense = (id, newDescription, newAmount) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id
          ? { ...expense, description: newDescription, amount: parseFloat(newAmount) }
          : expense
      )
    );
    setExpenseToEdit(null);
  };

  // Delete an expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Pie chart data
  const pieData = {
    labels: expenses.map((expense) => expense.description),
    datasets: [
      {
        data: expenses.map((expense) => expense.amount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800"],
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels: expenses.map((expense) => expense.description),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map((expense) => expense.amount),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Expense Tracker</h1>

      {/* Income Section */}
      <div>
        <h2>Income: ${income}</h2>
        <button
          onClick={() => {
            const extraIncome = prompt("Enter additional income amount:");
            if (extraIncome) setIncome(income + parseFloat(extraIncome));
          }}
        >
          Add Income
        </button>
      </div>

      {/* Add Expense Section */}
      <div style={{ marginTop: "20px" }}>
        <h2>Add Expense</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const description = e.target.description.value;
            const amount = e.target.amount.value;
            if (description && amount) {
              addExpense(description, amount);
              e.target.reset();
            }
          }}
        >
          <input name="description" placeholder="Description" required />
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            required
            step="0.01"
          />
          <button type="submit">Add Expense</button>
        </form>
      </div>

      {/* Expense List */}
      <div style={{ marginTop: "20px" }}>
        <h2>Expenses</h2>
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              {expense.description} - ${expense.amount.toFixed(2)}
              <button onClick={() => deleteExpense(expense.id)}>Delete</button>
              <button
                onClick={() =>
                  setExpenseToEdit({
                    id: expense.id,
                    description: expense.description,
                    amount: expense.amount,
                  })
                }
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Expense Modal */}
      {expenseToEdit && (
        <div style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}>
          <h3>Edit Expense</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newDescription = e.target.description.value;
              const newAmount = e.target.amount.value;
              if (newDescription && newAmount) {
                editExpense(expenseToEdit.id, newDescription, newAmount);
              }
            }}
          >
            <input
              name="description"
              defaultValue={expenseToEdit.description}
              required
            />
            <input
              name="amount"
              type="number"
              defaultValue={expenseToEdit.amount}
              required
              step="0.01"
            />
            <button type="submit">Save</button>
          </form>
        </div>
      )}

      {/* Pie Chart */}
      <div style={{ marginTop: "20px" }}>
        <h2>Expense Breakdown (Pie Chart)</h2>
        {expenses.length > 0 ? (
          <Pie data={pieData} />
        ) : (
          <p>No expenses to display.</p>
        )}
      </div>

      {/* Bar Chart */}
      <div style={{ marginTop: "20px" }}>
        <h2>Expense Breakdown (Bar Chart)</h2>
        {expenses.length > 0 ? (
          <Bar data={barData} />
        ) : (
          <p>No expenses to display.</p>
        )}
      </div>
    </div>
  );
}

export default App;
