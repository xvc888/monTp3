import Owner from "./components/Owner";
import Voter from "./components/Voter";
import "./style/style.css";
import { useEth } from "./contexts/EthContext";
import { useEffect, useState, useCallback } from "react";

function App() {
  const { state } = useEth();
  const { contract, accounts } = state;

  const [isOwner, setIsOwner] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [actualStatus, setActualStatus] = useState([]);

  const [voters, setVoters] = useState([]);

  const getProposals = useCallback(async () => {
    let proposalEvents = await contract.getPastEvents("ProposalRegistered", {
      fromBlock: 0,
      toBlock: "latest",
    });

    let proposalsArray = [];

    for (let i = 0; i < proposalEvents.length; i++) {
      let proposalID = proposalEvents[i].returnValues[0];

      const res = await contract.methods
        .getOneProposal(proposalID)
        .call({ from: accounts[0] });

      proposalsArray.push(res);
    }
    setProposals(proposalsArray);
  }, [contract, accounts]);

  const getVoters = useCallback(async () => {
    const votersEvents = await contract.getPastEvents("VoterRegistered", {
      fromBlock: 0,
      toBlock: "latest",
    });

    setVoters(votersEvents);
  }, [contract]);

  const getStatus = useCallback(async () => {
    const res = await contract.methods
      .workflowStatus()
      .call({ from: accounts[0] }); //const result2 = await contract.methods.getProposals().call();

    console.log(res);
    setActualStatus(res);
  }, [contract]);

  const setProposalRegisteredEvent = useCallback(async () => {
    await contract.events
      .ProposalRegistered()
      .on("data", (event) => {
        getProposals();
      })
      .on("changed", (changed) => console.log(changed))
      .on("error", (err) => console.log(err))
      .on("connected", (str) => console.log(str));
  }, [getProposals]);

  const setWorkflowEvent = useCallback(async () => {
    await contract.events
      .WorkflowStatusChange()
      .on("data", (event) => {
        const { newStatus } = event.returnValues;
        setActualStatus(newStatus);
      })
      .on("changed", (changed) => console.log(changed))
      .on("error", (err) => console.log(err))
      .on("connected", (str) => console.log(str));
  }, [getProposals]);

  const setCountRefreshEvent = useCallback(async () => {
    await contract.events
      .Voted()
      .on("data", (event) => {
        getProposals();
      })
      .on("changed", (changed) => console.log(changed))
      .on("error", (err) => console.log(err))
      .on("connected", (str) => console.log(str));
  }, [getProposals]);

  const getOwner = useCallback(async () => {
    const ownerAddress = await contract.methods.owner().call();
    if (ownerAddress === accounts[0]) {
      setIsOwner(true);
    }
  }, [contract, accounts, setIsOwner]);

  // const getVoter = useCallback(async () => {
  //   const voter = await contract.methods.getVoter(accounts[0]).call();
  // }, [contract]);

  useEffect(() => {
    // se relance à chaque fois que le contrat change de valeur

    if (contract) {
      setProposalRegisteredEvent();
      setCountRefreshEvent();
      setWorkflowEvent();
      getOwner();
      getProposals();
      getVoters();
      getStatus();
    }
  }, [
    getOwner,
    getVoters,
    contract,
    setProposalRegisteredEvent,
    setCountRefreshEvent,
    getProposals,
    setWorkflowEvent,
    getStatus,
  ]);
  // If Ok
  // setIsOwner(true)

  return (
    <div className="w-screen h-screen overflow-auto">
      <div className="brand">
        <h2 className="myDap">My Incredible Dap</h2>
      </div>
      {isOwner && (
        <Owner
          voters={voters}
          getVoters={getVoters}
          actualStatus={actualStatus}
        />
      )}
      <Voter proposals={proposals} />
    </div>
  );
}

export default App;
