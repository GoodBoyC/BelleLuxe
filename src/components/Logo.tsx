export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = {
    sm: 'h-8 text-lg',
    md: 'h-10 text-2xl',
    lg: 'h-14 text-4xl'
  };

  return (
    <div className="flex items-center gap-2 select-none font-serif tracking-tight">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-200 flex items-center justify-center shadow-md shadow-rose-500/10">
        <span className="text-white font-bold text-sm tracking-tighter">B</span>
      </div>
      <span className={`font-light bg-gradient-to-r from-rose-600 via-pink-600 to-rose-950 bg-clip-text text-transparent font-serif ${dimensions[size].split(' ')[1]}`}>
        Belle<span className="font-bold">Luxe</span>
      </span>
    </div>
  );
}
