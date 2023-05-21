

const Avatar = ({userId,username}) => {

    const colors = ['bg-red-300','bg-blue-300','bg-purple-300','bg-teal-300','bg-yellow-300','bg-pink-300']


    const userIdBase10 = parseInt(userId,16)
    const color = userIdBase10 % colors.length
    console.log(color)
  return (
    <div className={`w-8 h-8 rounded-full  text-black flex items-center justify-center font-semibold uppercase ${colors[color]}`}><span className="opacity-70">{username[0]}</span></div>
  )
}

export default Avatar