import * as Accordion from "@radix-ui/react-accordion";
import { FAQ } from "@/data/faq";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-subtle uppercase">FAQ</p>
        <h2 className="mt-3 text-xl font-medium tracking-tight text-fg">
          Direct answers
        </h2>
        <Accordion.Root
          type="single"
          collapsible
          className="mt-8 divide-y divide-divider border-y border-divider"
        >
          {FAQ.map((item) => (
            <Accordion.Item key={item.question} value={item.question}>
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-start justify-between gap-4 py-5 text-left">
                  <span className="text-sm font-medium text-fg">
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className="mt-0.5 text-subtle transition-transform duration-200 group-data-[state=open]:rotate-45"
                  >
                    +
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none">
                <p className="pb-5 text-sm leading-relaxed text-muted">
                  {item.answer}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
