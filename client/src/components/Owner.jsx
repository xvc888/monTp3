import useEth from "../contexts/EthContext/useEth";
import { useState, useEffect } from "react";

function Owner({ voters, getVoters, actualStatus }) {
  const { state } = useEth();
  const { contract, accounts } = state;
  const [isWinner, setWinner] = useState("");
  const [address, setAddress] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState("");

  //console.log(contract.)

  useEffect(() => {
    actualStatus && getUIWorkflowStatus();
  }, [actualStatus]);

  function handleChange(event) {
    setAddress(event.target.value);
  }

  const addVoter = async () => {
    if (address.length === 42) {
      const result = await contract.methods.addVoter(address).send({
        from: accounts[0],
      });

      getVoters();
    }
  };

  const startProposalsRegistering = async () => {
    const result = await contract.methods.startProposalsRegistering().send({
      from: accounts[0],
    });
    console.log(result);
  };
  const endProposalsRegistering = async () => {
    const result = await contract.methods.endProposalsRegistering().send({
      from: accounts[0],
    });
    console.log(result);
  };
  const startVotingSession = async () => {
    const result = await contract.methods.startVotingSession().send({
      from: accounts[0],
    });
    console.log(result);
  };
  const endVotingSession = async () => {
    const result = await contract.methods.endVotingSession().send({
      from: accounts[0],
    });
    console.log(result);
  };
  const tallyVotes = async () => {
    await contract.methods.tallyVotes().send({ from: accounts[0] });
    const winner = await contract.methods
      .winningProposalID()
      .call({ from: accounts[0] });
    setWinner(winner);

    console.log(winner);
    console.log(contract);
  };

  const getUIWorkflowStatus = async () => {
    switch (actualStatus) {
      case "0":
        setWorkflowStatus("RegisteringVoters");
        break;
      case "1":
        setWorkflowStatus("ProposalsRegistrationStarted");
        break;
      case "2":
        setWorkflowStatus("ProposalsRegistrationEnded");
        break;
      case "3":
        setWorkflowStatus("VotingSessionStarted");
        break;
      case "4":
        setWorkflowStatus("VotingSessionEnded");
        break;
      case "5":
        setWorkflowStatus("VotesTallied");
        break;
      default:
        setWorkflowStatus("Unknown");
    }
  };

  return (
    <div className="wrapDiv">
      <div className="userAdd">
        <h4>Adresse connectée au wallet: {state.accounts}</h4>
        <h4>
          Statut actuel du workflow: <h3 className="wfs">{workflowStatus}</h3>
        </h4>
      </div>
      <h3>
        <strong>Voters</strong>
      </h3>
      <ul>
        {voters.map((voter, index) => (
          <li>
            <h3>
              Addresses: <strong>{voter.returnValues.voterAddress}</strong>
            </h3>
          </li>
        ))}
      </ul>
      <div className="addVoter">
        <br />
        <h1 className="text-2xl">Add a voter</h1>
        <br />
        <h2>Adresse user: </h2>
        <br />
        <input type={"text"} name="addVoter" onChange={handleChange} />
        <br />
        <button display="block" className="button" onClick={addVoter}>
          Add voter
        </button>
        <br />
      </div>
      <br />
      <div className="startRegister">
        <h1 className="text-2xl">Start registering proposals</h1>
        <br />
        <button className="button" onClick={startProposalsRegistering}>
          Open registering
        </button>
      </div>
      <br />
      <div className="endRegister">
        <h1 className="text-2xl">End proposal registering</h1>
        <br />

        <button className="button" onClick={endProposalsRegistering}>
          Close registering
        </button>
      </div>
      <div className="startVoting">
        <h1 className="text-2xl">start Voting session</h1>
        <br />
        <button className="button" onClick={startVotingSession}>
          Start Voting session
        </button>
      </div>
      <div className="endVoting">
        <h1 className="text-2xl">End voting session</h1>
        <br />
        <button className="button" onClick={endVotingSession}>
          Close registering
        </button>
      </div>
      <div className="tallyVotes">
        <h1 className="text-2xl">Tally votes</h1>
        <br />
        <button className="button" onClick={tallyVotes}>
          Tally votes
        </button>
        <h3>La proposition gagnante est:{isWinner}</h3>
      </div>
    </div>
  );
}

export default Owner;
