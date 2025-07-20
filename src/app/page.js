import AnimatedGrid from "@/components/ui/transitions/AnimatedGrid";
import Reveler from "@/components/ui/Reveler";
import TextAnimated from "@/components/ui/animated/TextAnimated";
import Container from "@/components/index/container";

export default function Home() {
  return (
      <>
         <Reveler />
      <main className="relative overflow-hidden min-h-screen ">
        <AnimatedGrid />
        <div className="relative z-10 p-10 h-[100px] md:h-[150px] overflow-hidden">
            <div className={"text-center h-full"}>
                <TextAnimated text={"ONE ENTRY"} className={"font-bold"} />
            </div>
        </div>
            <Container />
      </main>
      </>
  );
}
