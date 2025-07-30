"use client";
import { Hand } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

gsap.registerPlugin(useGSAP);

const GreetHelper = () => {
  const { user } = useAuth();
  const handWrapperRef = useRef(null);

  useGSAP(() => {
    if (!handWrapperRef.current) {
      return console.error("No Reference Found!");
    }

    gsap.fromTo(
      handWrapperRef.current,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.4, delay: 0.1, ease: "power3.inOut" }
    );
  }, []);

  const getGreeting = () => {
    const day = new Date().getDay();

    switch (day) {
      case 0:
        return "How’s your Sunday going?";
      case 1:
        return "Feeling good today?";
      case 2:
        return "How are you holding up?";
      case 3:
        return "Halfway there! How’s your week so far?";
      case 4:
        return "Almost the weekend. How’s it going?";
      case 5:
        return "You made it! How are you feeling today?";
      case 6:
        return "Hope you're relaxing today. All good?";
      default:
        return "How are you feeling today?";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span ref={handWrapperRef}>
          <Avatar>
            <AvatarImage src={user.profile.avatar} alt={`@${user?.username || "AnyAnonymous"}`} />
            <AvatarFallback>{user?.username || "Anonymous"}</AvatarFallback>
          </Avatar>
        </span>
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center gap-2">
            Hey Mr. {user?.username || "Anonymous"}
          </h3>
          <p className="text-base font-medium text-accent-foreground/70">
            {getGreeting()}
          </p>
        </div>
      </div>
    </div>
  );
};

export { GreetHelper };
