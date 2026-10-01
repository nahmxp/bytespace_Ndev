import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function EmptyState({ query }: { query?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <h3 className="font-display text-2xl font-semibold">No courses found</h3>
      <p className="mx-auto mt-2 max-w-md text-mute">
        {query ? `Nothing matched “${query}”. ` : ""}Try a different keyword, or clear the filters to see everything.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <ButtonLink href="/courses">Clear filters</ButtonLink>
        <Link href="/signup" className="inline-flex h-11 items-center px-3 text-brand hover:underline">
          Become a creator
        </Link>
      </div>
    </div>
  );
}
