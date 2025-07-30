import AnimatedGrid from "@/components/ui/transitions/AnimatedGrid";
import Reveler from "@/components/ui/Reveler";
import TextAnimated from "@/components/ui/animated/TextAnimated";
import Container from "@/components/index/container";

export default function Home() {
  return (
      <>
         <Reveler />
      <main className="relative overflow-hidden min-h-screen " aria-label="Main content">
        <header className="relative z-10 p-10 h-[100px] md:h-[150px] overflow-hidden" aria-label="Site header">
            <div className={"text-center h-full"}>
                <TextAnimated text={"ONE ENTRY"} className={"font-bold"} />
            </div>
        </header>
        <section aria-label="Home content">
            <AnimatedGrid />
            <Container />
        </section>
      </main>
      </>
  );
}
