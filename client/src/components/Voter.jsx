import useEth from "../contexts/EthContext/useEth";
import { useState, useEffect, useCallback } from "react";
import "../style/style.css";

function Voter({ proposals }) {
  const { state } = useEth();
  const { contract, accounts } = state;
  const [isVoter, setIsVoter] = useState(false);
  const [proposal, setProposal] = useState(null);

  const checkIfVoter = useCallback(async () => {
    const voterAddress = await contract.methods.voter().call();
    if (voterAddress === accounts[0]) {
      setIsVoter(true);
    }
  }, [contract, accounts, setIsVoter]);

  function handleChange(event) {
    setProposal(event.target.value);
  }

  const setVote = async (index) => {
    const result = await contract.methods.setVote(index).send({
      from: accounts[0],
    });
    console.log(result);
  };
  const addProposal = async () => {
    const result = await contract.methods.addProposal(proposal).send({
      from: accounts[0],
    });
    console.log(result);
  };
  const getVoter = async () => {
    const result = await contract.methods.getVoter().call();
    console.log(result);
  };

  const getOneProposal = async () => {
    const result = await contract.methods.getOneProposal().call();
    //const result2 = await contract.methods.getProposals().call();
    console.log(result);
    //console.log(result2);
  };

  return (
    <>
      <div className="userAdd">
        <h4>Adresse connectée au wallet: {state.accounts}</h4>
        <h4>Statut actuel du workflow: </h4>
      </div>
      <div className="addProposal">
        <br />
        <h1 className="text-2xl">Add a proposal</h1>
        <button display="block" className="button" onClick={addProposal}>
          <strong>Send</strong>
        </button>
        <input
          className="input"
          type={"text"}
          name="addProposal"
          onChange={handleChange}
        />

        <br />
      </div>

      <div className="setVote">
        <br />
        <h1 className="text-2xl">Choose a proposal</h1>
        <br />
        <ul>
          {proposals.map((proposal, index) => (
            <li>
              <h3>
                Proposition: <strong>{proposal.description}</strong>
              </h3>
              <p>
                <h3>Number of votes: {proposal.voteCount}</h3>
              </p>
              <button className="voteButton" onClick={() => setVote(index)}>
                VOTE here!
              </button>
            </li>
          ))}
        </ul>
        <br />
        <br />
      </div>
    </>
  );
}

export default Voter;
