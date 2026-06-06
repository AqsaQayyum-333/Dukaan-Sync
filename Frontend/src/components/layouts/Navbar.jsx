const Navbar = () => {
  return (
    <div className="h-[80px] bg-[#0b2233]/80 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between px-8">

      <h2 className="text-2xl font-bold text-white">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">

        <div className="w-[45px] h-[45px] rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold">
          A
        </div>

      </div>

    </div>
  );
};

export default Navbar;