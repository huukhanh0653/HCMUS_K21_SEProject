function ImageButton({src})
{
    return(
        <button className="w-8 h-8 p-0 ml-2 mr-2 rounded-full bg-transparent overflow-hidden focus:outline-none border-none active:bg-transparent hover:bg-transparent">
      <img
        src={src}
        alt="Button Icon"
        className="w-full h-full object-cover"
      />
    </button>
    )
}
export default ImageButton