import React from "react";

function Times({ total }) {
  return (
    <div>
      {("0" + Math.floor((total / 3600) % 60)).slice(-2) +
        ":" +
        ("0" + Math.floor((total / 60) % 60)).slice(-2) +
        ":" +
        ("0" + Math.floor(total % 60)).slice(-2)}
    </div>
  );
}

export default Times;
