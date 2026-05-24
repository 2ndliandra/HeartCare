"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Cpu, LayoutGrid, MessageSquare } from "lucide-react";

interface CardData {
  id: number;
  icon: ReactNode;
  title: string;
  description: string;
  accent?: boolean;
}

const CARDS: CardData[] = [
  {
    id: 0,
    icon: <Cpu size={18} />,
    title: "Design Architecture",
    description: "Real-time collaboration and autosave keep your work safe.",
  },
  {
    id: 1,
    icon: <LayoutGrid size={18} />,
    title: "Load Templates",
    description: "Flexible templates and export options for every workflow.",
  },
  {
    id: 2,
    icon: <MessageSquare size={18} />,
    title: "Architech AI",
    description: "Effortless diagramming with a modern, intuitive interface.",
    accent: true,
  },
];

interface SlotStyle {
  tx: number;
  ty: number;
  tz: number;
  bg: string;
  border: string;
  shadow: string;
  zIndex: number;
}

const SLOTS: SlotStyle[] = [
  {
    tx: -28,
    ty: -24,
    tz: 56,
    bg: "#252525",
    border: "rgba(255,255,255,0.16)",
    shadow: "0 12px 40px rgba(0,0,0,0.55)",
    zIndex: 3,
  },
  {
    tx: -14,
    ty: -12,
    tz: 28,
    bg: "#1f1f1f",
    border: "rgba(255,255,255,0.10)",
    shadow: "0 8px 28px rgba(0,0,0,0.45)",
    zIndex: 2,
  },
  {
    tx: 0,
    ty: 0,
    tz: 0,
    bg: "#1a1a1a",
    border: "rgba(255,255,255,0.06)",
    shadow: "0 4px 16px rgba(0,0,0,0.40)",
    zIndex: 1,
  },
];

interface CardState {
  tx: number;
  ty: number;
  tz: number;
  bg: string;
  border: string;
  shadow: string;
  zIndex: number;
  transition: string;
}

export default function ArchitechStackCard() {
  const orderRef = useRef<number[]>([0, 1, 2]);
  const animatingRef = useRef(false);

  const [cardStates, setCardStates] = useState<CardState[]>(
    CARDS.map((_, i) => ({
      ...SLOTS[i],
      transition: "none",
    }))
  );

  function applyState(
    states: CardState[],
    cardIdx: number,
    slot: SlotStyle,
    transition: string,
    overrides?: Partial<CardState>
  ): CardState[] {
    const next = [...states];
    next[cardIdx] = { ...slot, transition, ...overrides };
    return next;
  }

  function step() {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const order = orderRef.current;
    const frontIdx = order[0];
    const midIdx = order[1];
    const backIdx = order[2];
    const s0 = SLOTS[0];

    setCardStates((prev) =>
      applyState(prev, frontIdx, s0, "transform 0.45s cubic-bezier(0.4,0,1,1)", {
        ty: s0.ty + 220,
        zIndex: 10,
      })
    );

    setTimeout(() => {
      const s2 = SLOTS[2];

      setCardStates((prev) => {
        let next = applyState(prev, frontIdx, s2, "none", { ty: s2.ty + 220 });
        next = applyState(
          next,
          midIdx,
          SLOTS[0],
          "transform 0.5s cubic-bezier(0.23,1,0.32,1), background 0.5s ease, box-shadow 0.5s ease"
        );
        next = applyState(
          next,
          backIdx,
          SLOTS[1],
          "transform 0.5s cubic-bezier(0.23,1,0.32,1), background 0.5s ease, box-shadow 0.5s ease"
        );
        return next;
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCardStates((prev) =>
            applyState(prev, frontIdx, s2, "transform 0.5s cubic-bezier(0.23,1,0.32,1)")
          );
        });
      });

      setTimeout(() => {
        orderRef.current = [midIdx, backIdx, frontIdx];
        animatingRef.current = false;
      }, 520);
    }, 470);
  }

  useEffect(() => {
    const interval = setInterval(step, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-center"
      style={{ perspective: "1400px", padding: "80px 40px 120px", minHeight: "380px" }}
    >
      <div
        className="relative"
        style={{
          width: 360,
          height: 180,
          transformStyle: "preserve-3d",
          transform: "rotateX(8deg) rotateY(-22deg)",
        }}
      >
        {CARDS.map((card, i) => {
          const state = cardStates[i];
          return (
            <div
              key={card.id}
              className="absolute flex items-start gap-3.5 rounded-2xl p-5"
              style={{
                width: 360,
                height: 180,
                background: state.bg,
                border: `0.5px solid ${state.border}`,
                boxShadow: state.shadow,
                zIndex: state.zIndex,
                transform: `translateX(${state.tx}px) translateY(${state.ty}px) translateZ(${state.tz}px)`,
                transition: state.transition,
                backfaceVisibility: "hidden",
                willChange: "transform",
              }}
            >
              <div
                className="mt-0.5 flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px]"
                style={{
                  background: card.accent
                    ? "rgba(140,100,255,0.22)"
                    : "rgba(255,255,255,0.08)",
                  color: card.accent ? "#c4aaff" : "rgba(255,255,255,0.75)",
                }}
              >
                {card.icon}
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-white" style={{ fontSize: 14 }}>
                  {card.title}
                </p>
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.42)",
                    maxWidth: 260,
                    lineHeight: 1.5,
                  }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
