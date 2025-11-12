import { useEffect, useMemo, useRef, useState } from "react";
import type { PropsWithChildren, ReactElement } from "react";
import {
  Carousel as CarouselPrimitive,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type CarouselProps = PropsWithChildren<{
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  className?: string;
}>;

const Carousel = ({
  children,
  baseWidth = 320,
  autoplay = false,
  autoplayDelay = 3500,
  pauseOnHover = true,
  loop = true,
  round = true,
  className,
}: CarouselProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const hoverRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(
    () =>
      Array.isArray(children)
        ? (children as ReactElement[])
        : children
        ? [children as ReactElement]
        : [],
    [children],
  );

  useEffect(() => {
    if (!pauseOnHover || !containerRef.current) {
      return;
    }

    const node = containerRef.current;
    const handleEnter = () => {
      hoverRef.current = true;
    };
    const handleLeave = () => {
      hoverRef.current = false;
    };

    node.addEventListener("mouseenter", handleEnter);
    node.addEventListener("mouseleave", handleLeave);

    return () => {
      node.removeEventListener("mouseenter", handleEnter);
      node.removeEventListener("mouseleave", handleLeave);
    };
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || !api || items.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      if (hoverRef.current) {
        return;
      }

      if (loop) {
        api.scrollNext();
        return;
      }

      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [api, autoplay, autoplayDelay, loop, items.length]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <CarouselPrimitive
        opts={{ loop, align: "start" }}
        setApi={(carouselApi) => setApi(carouselApi)}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              style={{ flexBasis: `${baseWidth}px`, maxWidth: "100%" }}
              className={cn("pl-6", !round && "sm:pl-8")}
            >
              <div className="h-full">{item}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </CarouselPrimitive>
    </div>
  );
};

export default Carousel;
