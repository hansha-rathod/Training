import React from "react";

function ListItem({ item, onDelete }) {
  return (
    <li className="list-item">
      <span className="item-name">{item.name}</span>
      <button className="delete-btn" onClick={() => onDelete(item.id)}>
        Delete
      </button>
    </li>
  );
}

export default React.memo(ListItem);
