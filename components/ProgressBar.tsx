export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = (current / total) * 100;
  return (
    <div className="w-full">
      <div className="text-sm text-stone-600 mb-2 text-right">
        {current} / {total}
      </div>
      <div className="w-full bg-stone-200 rounded-full h-2">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
