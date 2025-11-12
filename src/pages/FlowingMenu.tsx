import React from "react";
import { cn } from "@/lib/utils";

export type FlowingMenuItem = {
  name: string;
  role: string;
  quote: string;
  image: string;
};

type FlowingMenuProps = {
  items: FlowingMenuItem[];
  className?: string;
};

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items,
  className
}) => {
  // Duplicate items so the marquee-style animation loops without a visual jump
  const duplicatedItems = React.useMemo(() => [...items, ...items], [items]);

  return (
    <div
      className={cn(
        "flowing-menu-container relative h-full w-full overflow-hidden rounded-3xl bg-white/90 shadow-2xl",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/90 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/90 to-transparent z-10" />
      <div className="flowing-menu-track flex flex-col gap-6 py-8">
        {duplicatedItems.map((item, index) => (
          <article
            key={`${item.name}-${index}`}
            className="mx-auto w-[90%] max-w-xl rounded-3xl border border-indigo-100/60 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/60 p-6 shadow-lg backdrop-blur"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-indigo-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-indigo-600">{item.role}</p>
              </div>
            </div>
            <p className="text-base text-gray-600 leading-relaxed">"{item.quote}"</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FlowingMenu;
