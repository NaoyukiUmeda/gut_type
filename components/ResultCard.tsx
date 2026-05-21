import { DiagnosisType } from "@/lib/types";

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="text-base font-bold text-stone-800 mb-2">
        <span className="mr-1">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function ResultCard({ data }: { data: DiagnosisType }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8">
      <p className="text-center text-sm text-stone-500">あなたの腸活タイプは</p>
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
        {data.name}
      </h2>
      <p className="text-center text-stone-600 leading-relaxed mt-3">
        {data.catchphrase}
      </p>

      <Section icon="🌱" title="よくある傾向">
        <ul className="list-disc list-inside text-stone-700 leading-relaxed space-y-1">
          {data.traits.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section icon="🍵" title="今日からやること3つ">
        <ol className="list-decimal list-inside text-stone-700 leading-relaxed space-y-1">
          {data.todos.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </Section>

      <Section icon="⚠️" title="やりすぎ注意ポイント">
        <p className="text-stone-700 leading-relaxed bg-base-soft rounded-xl px-4 py-3">
          {data.caution}
        </p>
      </Section>

      <Section icon="✨" title="次のステップ">
        <p className="text-stone-700 leading-relaxed">{data.nextStep}</p>
      </Section>
    </div>
  );
}
