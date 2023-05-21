const Avatar = ({ userId, username,online }) => {
  const colors = [
    "bg-red-300",
    "bg-blue-300",
    "bg-purple-300",
    "bg-teal-300",
    "bg-yellow-300",
    "bg-pink-300",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const color = userIdBase10 % colors.length;

  return (
    <div
      className={`relative w-10 h-10 rounded-full  text-black flex items-center justify-center font-semibold uppercase ${colors[color]}`}
    >

      {online&&<div className="absolute w-3 h-3 right-0 bottom-0 rounded-full bg-green-600 border border-white" />}
      <span className="opacity-70">{username[0]}</span>
    </div>
  );
};

export default Avatar;
