import { TypeId, getIllustrationPath } from "@/lib/types";

type Props = {
  typeId: TypeId;
  beforeTitle: string;
  beforeDescription: string;
  afterTitle: string;
  afterDescription: string;
  transitionMessage: string;
  traits: string[];
  altPrefix: string;
};

export default function BeforeAfterSection({
  typeId,
  beforeTitle,
  beforeDescription,
  afterTitle,
  afterDescription,
  transitionMessage,
  traits,
  altPrefix,
}: Props) {
  return (
    <div className="my-10">
      {/* === Before === */}
      <section className="bg-stone-100/60 rounded-3xl p-6 border border-stone-200/80">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold tracking-[0.2em] text-stone-500 bg-stone-200/60 px-3 py-1 rounded-full">
            BEFORE
          </span>
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-4 leading-relaxed">
          {beforeTitle}
        </h3>
        <div className="rounded-2xl overflow-hidden mb-5 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getIllustrationPath(typeId, "before")}
            alt={`${altPrefix}（現状の食卓・生活シーン）`}
            width={800}
            height={800}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
        <p className="text-stone-700 leading-relaxed text-sm mb-5">
          {beforeDescription}
        </p>
        <div className="bg-white/70 rounded-2xl p-4">
          <p className="text-xs font-bold text-stone-500 mb-2">よくある傾向</p>
          <ul className="space-y-1.5">
            {traits.map((t) => (
              <li key={t} className="text-stone-700 text-sm flex gap-2">
                <span className="text-stone-400 flex-shrink-0">・</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* === 遷移エリア（丁寧な見せ方） === */}
      <div className="flex flex-col items-center gap-3 py-10">
        <p className="text-xs tracking-[0.2em] text-stone-400 font-bold">
          こうなっていく
        </p>
        {/* 縦線 + 矢印 */}
        <div className="flex flex-col items-center gap-0">
          <div className="w-px h-6 bg-stone-300" />
          <div className="w-px h-6 bg-emerald-200" />
          <div className="w-px h-6 bg-emerald-400" />
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="text-emerald-500"
            fill="currentColor"
          >
            <path d="M10 18 L2 8 L18 8 Z" />
          </svg>
        </div>
        <p className="text-base font-bold text-emerald-700 leading-relaxed text-center mt-2">
          {transitionMessage}
        </p>
      </div>

      {/* === After === */}
      <section className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            AFTER
          </span>
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-4 leading-relaxed">
          {afterTitle}
        </h3>
        <div className="rounded-2xl overflow-hidden mb-5 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getIllustrationPath(typeId, "after")}
            alt={`${altPrefix}(アドバイスを実践した未来の食卓・生活シーン)`}
            width={800}
            height={800}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
        <p className="text-stone-700 leading-relaxed text-sm">
          {afterDescription}
        </p>
      </section>
    </div>
  );
}
