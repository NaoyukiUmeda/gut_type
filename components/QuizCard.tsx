import { Question } from "@/lib/questions";

type QuizCardProps = {
  question: Question;
  selectedChoiceId?: string;
  onSelect: (choiceId: string) => void;
};

export default function QuizCard({
  question,
  selectedChoiceId,
  onSelect,
}: QuizCardProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-stone-800 leading-relaxed mb-6">
        {question.text}
      </h2>
      <div className="flex flex-col gap-3">
        {question.choices.map((choice) => {
          const isSelected = choice.id === selectedChoiceId;
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelect(choice.id)}
              className={`w-full text-left rounded-2xl px-5 py-4 border transition-colors leading-relaxed ${
                isSelected
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white border-stone-200 text-stone-700 hover:border-emerald-400 hover:bg-emerald-50"
              }`}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
