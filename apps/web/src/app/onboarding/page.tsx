"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Plus, Trash2, Moon, Sun, Monitor } from "lucide-react";
import { AvatarPicker } from "@/components/auth/avatar-picker";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "profile", title: "Profile Setup", subtitle: "Tell us a bit about yourself" },
  { id: "workspace", title: "Create Workspace", subtitle: "Your team's home" },
  { id: "invite", title: "Invite Members", subtitle: "Bring your team together" },
  { id: "preferences", title: "Preferences", subtitle: "Make it yours" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [profile, setProfile] = useState({ name: "", avatar: "" });
  const [workspace, setWorkspace] = useState({ name: "" });
  const [invites, setInvites] = useState([{ email: "", role: "member" }]);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
      return;
    }
    setDirection(1);
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStepIndex === 0) return;
    setDirection(-1);
    setCurrentStepIndex((prev) => prev - 1);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/dashboard");
  };

  const addInvite = () => setInvites([...invites, { email: "", role: "member" }]);
  const removeInvite = (index: number) => setInvites(invites.filter((_, i) => i !== index));
  const updateInvite = (index: number, field: keyof typeof invites[0], value: string) => {
    const newInvites = [...invites];
    newInvites[index][field] = value;
    setInvites(newInvites);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <div className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] w-full max-w-4xl mx-auto">
      {/* Sidebar Progress */}
      <div className="bg-muted/30 p-8 md:p-10 border-b md:border-b-0 md:border-r border-border/50 md:w-72 flex-shrink-0">
        <div className="mb-12 hidden md:block">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-2xl">T</span>
          </div>
        </div>
        <nav aria-label="Progress">
          <ol role="list" className="space-y-6 md:space-y-8">
            {STEPS.map((step, index) => {
              const isCurrent = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <li key={step.id} className="relative">
                  <div className={cn("group flex items-center", isCurrent ? "text-primary" : "text-muted-foreground")}>
                    <span className="flex h-9 items-center">
                      <span className={cn(
                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300",
                        isCompleted ? "border-primary bg-primary text-primary-foreground" : 
                        isCurrent ? "border-primary bg-background text-primary scale-110 shadow-sm" : 
                        "border-muted bg-background text-muted-foreground"
                      )}>
                        {isCompleted ? <Check size={16} /> : <span>{index + 1}</span>}
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className={cn("text-sm font-semibold tracking-wide transition-colors", isCurrent ? "text-primary" : "text-foreground")}>{step.title}</span>
                      <span className="text-xs text-muted-foreground hidden md:block">{step.subtitle}</span>
                    </span>
                  </div>
                  {index !== STEPS.length - 1 && (
                    <div className={cn(
                      "absolute top-8 left-4 -ml-[1px] h-full w-[2px] hidden md:block transition-colors duration-300",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-10 flex flex-col relative overflow-hidden bg-background/50">
        <div className="flex-1 relative">
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              key={currentStepIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 35 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0 flex flex-col"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">{currentStep.title}</h2>
                <p className="text-muted-foreground">{currentStep.subtitle}</p>
              </div>

              {/* Step 1: Profile Setup */}
              {currentStep.id === "profile" && (
                <div className="space-y-8 max-w-md">
                  <div className="space-y-3">
                    <label htmlFor="name" className="text-sm font-medium leading-none">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all shadow-sm"
                      placeholder="Jane Doe"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium leading-none block mb-1">Avatar</label>
                    <AvatarPicker value={profile.avatar} onChange={(val) => setProfile({ ...profile, avatar: val })} />
                  </div>
                </div>
              )}

              {/* Step 2: Workspace */}
              {currentStep.id === "workspace" && (
                <div className="space-y-8 max-w-md">
                  <div className="space-y-3">
                    <label htmlFor="workspace-name" className="text-sm font-medium leading-none">
                      Workspace Name
                    </label>
                    <input
                      id="workspace-name"
                      type="text"
                      className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all shadow-sm"
                      placeholder="Acme Corp"
                      value={workspace.name}
                      onChange={(e) => setWorkspace({ name: e.target.value })}
                    />
                  </div>
                  <div className="p-5 bg-muted/30 rounded-xl border border-border/50 text-sm text-muted-foreground flex gap-4 transition-colors hover:bg-muted/50 cursor-pointer group">
                    <div className="w-14 h-14 bg-background border-2 border-dashed border-border rounded-xl flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                      <Plus size={24} className="text-muted-foreground/50 group-hover:text-primary/70" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-medium text-foreground mb-1">Upload Logo</p>
                      <p className="text-xs">Upload a square image. Recommended size is 256x256px.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Invite */}
              {currentStep.id === "invite" && (
                <div className="space-y-5 w-full max-w-xl">
                  {invites.map((invite, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="email"
                        placeholder="colleague@example.com"
                        className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all shadow-sm"
                        value={invite.email}
                        onChange={(e) => updateInvite(index, "email", e.target.value)}
                      />
                      <select
                        className="flex h-11 w-[130px] items-center justify-between rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm"
                        value={invite.role}
                        onChange={(e) => updateInvite(index, "role", e.target.value)}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeInvite(index)}
                        disabled={invites.length === 1}
                        className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                  <button
                    type="button"
                    onClick={addInvite}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-2 p-2 rounded-lg hover:bg-primary/5 w-fit"
                  >
                    <Plus size={16} /> Add another
                  </button>
                </div>
              )}

              {/* Step 4: Preferences */}
              {currentStep.id === "preferences" && (
                <div className="space-y-8 max-w-md">
                  <div className="space-y-4">
                    <label className="text-sm font-medium leading-none">Theme Preference</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", icon: Sun, label: "Light" },
                        { id: "dark", icon: Moon, label: "Dark" },
                        { id: "system", icon: Monitor, label: "System" },
                      ].map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setTheme(id as any)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300",
                            theme === id 
                              ? "border-primary bg-primary/10 text-primary shadow-sm scale-[1.02]" 
                              : "border-border/50 bg-background/50 hover:border-border hover:bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon size={24} className={cn(theme === id && "fill-primary/20")} />
                          <span className="text-sm font-semibold">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors rounded-lg",
              currentStepIndex === 0 ? "opacity-0 pointer-events-none" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="group flex items-center gap-2 px-7 py-2.5 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background transition-all shadow-md active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : isLastStep ? (
              "Complete Setup"
            ) : (
              <>Continue <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
