import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0].id);

  function handleUpdateFriend(friend) {
    const updatedFriends = friends.map((f) =>
      f.id === friend.id ? friend : f
    );
    setFriends(updatedFriends);
  }

  return (
    <div className="app">
      <SideBar
        friends={friends}
        setFriends={setFriends}
        selectedFriendId={selectedFriendId}
        onSelect={setSelectedFriendId}
      />
      {selectedFriendId !== null ? (
        <SplitBillForm
          friendId={selectedFriendId}
          friends={friends}
          onSubmit={handleUpdateFriend}
        />
      ) : null}
    </div>
  );
}

function SideBar({ friends, setFriends, onSelect, selectedFriendId }) {
  function handleAddFriend(friend) {
    const newFriends = [...friends, friend];
    setFriends(newFriends);
  }

  return (
    <div className="sidebar">
      <FriendList
        friends={friends}
        setFriends={setFriends}
        selectedFriendId={selectedFriendId}
        onSelect={onSelect}
      />
      <FriendAddForm onSubmit={handleAddFriend} />
    </div>
  );
}
function FriendList({ friends, setFriends, selectedFriendId, onSelect }) {
  return (
    <ul>
      {friends.map((friend) =>
        friend.id === selectedFriendId ? (
          <Friend
            key={friend.id}
            friend={friend}
            selected={true}
            onSelect={onSelect}
          />
        ) : (
          <Friend
            key={friend.id}
            friend={friend}
            selected={false}
            onSelect={onSelect}
          />
        )
      )}
    </ul>
  );
}

function Friend({ friend, children, onSelect, selected }) {
  let colorClass;
  let text;
  if (friend.balance === 0) {
    colorClass = "";
    text = `You and ${friend.name} are even`;
  } else if (friend.balance < 0) {
    colorClass = "red";
    text = `You owe ${friend.name} ${Math.abs(friend.balance)}€`;
  } else {
    // Positive
    colorClass = "green";
    text = `${friend.name} owes you ${Math.abs(friend.balance)}€`;
  }

  return (
    <li className={selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p className={colorClass}>{text}</p>
      {selected ? (
        <Button text="Close" onClick={() => onSelect(null)} />
      ) : (
        <Button text="Select" onClick={() => onSelect(friend.id)} />
      )}
    </li>
  );
}
function FriendAddForm({ onSubmit }) {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [friendName, setFriendName] = useState("");
  const defaultURL = "https://i.pravatar.cc/48";
  const [imageURL, setImageURL] = useState(defaultURL);

  function handleFormSubmit(e) {
    e.preventDefault();
    const newFriend = {
      id: Math.floor(Math.random() * Math.floor(Math.random() * Date.now())),
      name: friendName,
      image: imageURL,
      balance: 0,
    };

    onSubmit(newFriend);
    setFriendName("");
    setImageURL(defaultURL);
  }

  return (
    <>
      {formIsOpen ? (
        <>
          <form className="form-add-friend" onSubmit={handleFormSubmit}>
            <TextField
              text="👭 Friend name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
            <TextField
              text="🖼 Image URL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
            <Button text="Add" onClick={() => {}} />
          </form>
          <Button text="Close" onClick={() => setFormIsOpen(false)} />
        </>
      ) : (
        <Button text="Add Friend" onClick={() => setFormIsOpen(true)} />
      )}
    </>
  );
}
function SplitBillForm({ friends, friendId, onSubmit }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoPaying, setWhoPaying] = useState("You");
  const friend = friends.find((friend) => friend.id === friendId);

  function convertIfNumber(value) {
    if (value === "") {
      return value;
    } else {
      return Number(value);
    }
  }
  function setIfNumber(e, setter) {
    setter(convertIfNumber(e.target.value));
  }
  function isNumber(val) {
    if (typeof val === "number") {
      return true;
    } else {
      return false;
    }
  }

  let friendExpense;

  if (isNumber(bill) && isNumber(yourExpense)) {
    friendExpense = bill - yourExpense;
  } else {
    friendExpense = "";
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!isNumber(friendExpense)) {
      return;
    }
    let friendBalance;
    if (whoPaying === "You") {
      friendBalance = friend.balance - friendExpense;
    } else {
      friendBalance = friend.balance + friendExpense;
    }

    const friendCopy = { ...friend, balance: friendBalance };
    onSubmit(friendCopy);
    setBill("");
    setYourExpense("");
    setWhoPaying("You");
  }

  return (
    <form className="form-split-bill" onSubmit={handleFormSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <TextField
        text="💰 Bill value"
        value={bill}
        onChange={(e) => setIfNumber(e, setBill)}
      />
      <TextField
        text="🙋 Your expense"
        value={yourExpense}
        onChange={(e) => setIfNumber(e, setYourExpense)}
      />
      <TextField
        text={`👭 ${friend.name}'s expense`}
        value={friendExpense}
        onChange={(e) => {}}
        inactive={true}
      />
      <SelectField
        labelText="🤑 Who is paying the bill?"
        options={["You", friend.name]}
        selected={whoPaying}
        onChange={(e) => {
          console.log(e.target.value);
          setWhoPaying(e.target.value);
        }}
      />
      <Button text="Split bill" />
    </form>
  );
}
function TextField({ value, onChange, text, inactive }) {
  return (
    <>
      <label>{text}</label>
      <input value={value} onChange={onChange} />
    </>
  );
}
function SelectField({ labelText, options, selected, onChange }) {
  return (
    <>
      <label>{labelText}</label>
      <select value={selected} onChange={onChange}>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}
function Button({ text, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {text}
    </button>
  );
}
