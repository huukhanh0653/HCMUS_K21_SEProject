function UserName({ name, date }) {
  return (
    <div className="flex">
      <div className="mr-2">
        <a href="/" className="text-white no-underline font-medium">
          {name}
        </a>
      </div>
      <div className="text-gray-400 text-sm">
        {date}
      </div>
    </div>
  );
}

export default UserName;
