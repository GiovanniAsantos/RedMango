import React from "react";

interface Props {
  type?: string;
  size?: number;
}

function MiniLoader({ type = "warning", size = 100 }: Props) {
  return (
    <div
      className={`spinner-border text-${type}`}
      style={{ scale: `${size}%` }}
    >
      {" "}
    </div>
  );
}

export default MiniLoader;
