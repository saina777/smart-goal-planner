import React, { useState } from "react";

export default function DepositForm() {
  const [amount, setAmount] = useState("");

  const handleDeposit = (e) => {
    e.preventDefault();
    alert(`Deposited: Ksh ${amount}`);
    setAmount("");
  };

  return (
    <form onSubmit={handleDeposit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
      <button type="submit">Deposit</button>
    </form>
  );
}
