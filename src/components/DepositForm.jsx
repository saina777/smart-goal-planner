
import { useState } from "react";

const DepositForm = ({ goalId, onDeposit }) => {
  const [amount, setAmount] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/goals/${goalId}`);
      const goal = await res.json();

      const updatedGoal = {
        ...goal,
        savedAmount: Number(goal.savedAmount) + Number(amount),
      };

      const updateRes = await fetch(`http://localhost:3000/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGoal),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to update goal");
      }

      if (onDeposit) {
        onDeposit(); // refresh list in parent
      }

      setAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  return (
    <form onSubmit={handleDeposit} className="mt-3 flex items-center gap-2">
      <input
        type="number"
        min="1"
        required
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 rounded border w-32 dark:bg-gray-900 dark:text-white"
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
      >
        Add
      </button>
    </form>
  );
};

export default DepositForm;
