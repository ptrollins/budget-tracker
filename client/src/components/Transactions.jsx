import React from "react";
import axios from "axios";

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      transactionName: "",
      transactionAmount: "",
    };

    this.addTransaction = this.addTransaction.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleNumbersFormChange = this.handleNumbersFormChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    this.getTransactions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.budget !== this.props.budget) {
      this.getTransactions();
    }
  }

  addTransaction(newTransaction) {
    axios
      .post("/transactions", newTransaction)
      .then(() => {
        this.getTransactions();
      })
      .catch((error) => console.log(error));
  }

  deleteTransaction(transaction) {
    axios
      .delete(
        `/transactions?name=${transaction.name}&username=${this.props.currentUser}&budget=${transaction.budget}`
      )
      .then(() => {
        this.getTransactions();
      })
      .catch((error) => console.log(error));
  }

  getTransactions() {
    axios
      .get(
        `/transactions?username=${this.props.currentUser}&budget=${this.props.budget}`
      )
      .then(({ data }) => {
        this.setState({
          transactions: data,
        });
      })
      .catch((error) => console.log(error));
  }

  handleFormChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleNumbersFormChange(event) {
    const numbersValidation = /^[0-9\b]+$/;

    if (
      event.target.value === "" ||
      numbersValidation.test(event.target.value)
    ) {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.addTransaction({
      username: this.props.currentUser,
      budget: this.props.budget,
      name: this.state.transactionName,
      amount: this.state.transactionAmount,
      period: this.props.budgetPeriod,
    });
    this.setState({
      transactionName: "",
      transactionAmount: "",
    });
  }

  handleDelete(transaction) {
    this.deleteTransaction(transaction);
  }

  render() {
    return (
      <div>
        <h4>Transaction List</h4>
        {this.state.transactions.map((transaction) => (
          <div>
            <p>
              {transaction.name}, ${transaction.amount}
            </p>
            <button
              className="create-submit-button"
              onClick={() => this.handleDelete(transaction)}
            >
              x
            </button>
          </div>
        ))}
        <form className="feed-list-item">
          <input
            className="create-budget-input"
            type="text"
            placeholder="Name"
            name="transactionName"
            value={this.state.transactionName}
            onChange={(event) => this.handleFormChange(event)}
          ></input>
          <input
            className="create-budget-input"
            type="text"
            placeholder="Amount"
            name="transactionAmount"
            value={this.state.transactionAmount}
            onChange={(event) => this.handleNumbersFormChange(event)}
          ></input>
          <button
            className="create-submit-button"
            type="submit"
            onClick={this.handleFormSubmit}
          >
            Add Transaction
          </button>
        </form>
      </div>
    );
  }
}

export default Transactions;
