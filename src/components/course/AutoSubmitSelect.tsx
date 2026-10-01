"use client";

/** A <select> that submits its parent GET form as soon as it changes. */
export function AutoSubmitSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white pl-5 pr-3 text-base">
      <span className="text-ink">{label}</span>
      <select
        name={name}
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="cursor-pointer bg-transparent py-2 pr-1 text-ink/80 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
