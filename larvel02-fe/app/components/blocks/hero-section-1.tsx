import type { MouseEvent } from 'react';
import { Button } from '~/components/ui/button';
import { AnimatedGroup } from '~/components/ui/animated-group';
import { scrollToHash } from '~/lib/gsapScroll';

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

type HeroSectionProps = {
    isAuthenticated?: boolean;
    onCtaClick?: () => void;
};

export function HeroSectionOne({ isAuthenticated, onCtaClick }: HeroSectionProps) {
    const handleScrollToHowItWorks = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        window.history.replaceState(null, '', '/#cara-kerja');
        scrollToHash('#cara-kerja');
    };

    return (
        <>
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(160,50%,85%,.08)_0,hsla(160,50%,55%,.02)_50%,hsla(160,50%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(160,50%,85%,.06)_0,hsla(160,50%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(160,50%,85%,.04)_0,hsla(160,50%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            <img
                                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block opacity-20 object-cover w-full h-[800px]"
                            />
                        </AnimatedGroup>
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-6xl lg:mt-12 xl:text-7xl font-bold text-slate-900">
                                        Pahami Risiko Jantung Anda Lebih Dini
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-center text-balance text-lg text-slate-600">
                                        HeartCare membantu membaca potensi risiko lewat analitik data yang lebih personal dan akurat sejak langkah pertama.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-emerald-600/10 border border-emerald-200 p-1">
                                        <Button
                                            onClick={onCtaClick}
                                            size="lg"
                                            className="rounded-none px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white h-12 shadow-lg shadow-emerald-600/20">
                                            <span className="text-nowrap">{isAuthenticated ? "Buka Dashboard" : "Mulai Cek Kesehatan"}</span>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        size="lg"
                                        variant="outline"
                                        onClick={handleScrollToHowItWorks}
                                        className="h-14 rounded-none px-8 border-slate-300 text-slate-700 hover:bg-slate-50">
                                        <span className="text-nowrap">Pelajari Cara Kerja</span>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative mt-12 px-2 sm:mt-16 md:mt-24">
                                <div
                                    aria-hidden
                                    className="pointer-events-none bg-gradient-to-b to-white absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-white dark:inset-shadow-white/20 bg-white relative mx-auto max-w-6xl rounded-2xl border p-2 sm:p-4 shadow-xl shadow-emerald-950/5 ring-1">
                                    <img
                                        className="bg-white w-full h-auto relative hidden rounded-xl dark:block"
                                        src="/assets/Paijos.png"
                                        alt="app screen"
                                    />
                                    <img
                                        className="z-2 border-slate-200/50 w-full h-auto relative rounded-xl border dark:hidden shadow-sm"
                                        src="/assets/Paijos.png"
                                        alt="app screen"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    );
}
