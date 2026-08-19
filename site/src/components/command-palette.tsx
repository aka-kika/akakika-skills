import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CATEGORIES, SKILLS } from "@/data/skills";
import { cn } from "@/lib/cn";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-bg/70"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative mx-auto mt-[12vh] w-[min(36rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-border bg-surface">
        <Command
          label="Search skills"
          className="flex flex-col"
          loop
        >
          <Command.Input
            autoFocus
            placeholder="Search 40 skills…"
            className="h-12 w-full border-b border-divider bg-transparent px-4 text-sm text-fg outline-none placeholder:text-subtle"
          />
          <Command.List className="max-h-80 overflow-y-auto p-1">
            <Command.Empty className="px-3 py-8 text-center text-sm text-subtle">
              No matching skill.
            </Command.Empty>
            {CATEGORIES.map((cat) => {
              const items = SKILLS.filter((s) => s.category === cat.id);
              return (
                <Command.Group
                  key={cat.id}
                  heading={cat.name}
                  className="px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-subtle"
                >
                  {items.map((skill) => (
                    <Command.Item
                      key={skill.slug}
                      value={`${skill.name} ${skill.summary} ${cat.name}`}
                      onSelect={() => {
                        onOpenChange(false);
                        void navigate({
                          to: "/skills/$slug",
                          params: { slug: skill.slug },
                        });
                      }}
                      className={cn(
                        "flex cursor-pointer flex-col gap-0.5 rounded-sm px-2 py-2 text-sm text-fg",
                        "data-[selected=true]:bg-elevated",
                      )}
                    >
                      <span className="font-medium">{skill.name}</span>
                      <span className="line-clamp-1 text-xs text-subtle">
                        {skill.summary}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
