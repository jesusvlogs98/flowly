import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckSquare, 
  LineChart, 
  StickyNote, 
  Zap, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";

export function WelcomeTutorial() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: t("welcome.step1_title"),
      description: t("welcome.step1_desc"),
      icon: <Zap className="w-12 h-12 text-primary animate-pulse" />,
    },
    {
      title: t("welcome.step2_title"),
      description: t("welcome.step2_desc"),
      icon: <Calendar className="w-12 h-12 text-blue-500" />,
    },
    {
      title: t("welcome.step3_title"),
      description: t("welcome.step3_desc"),
      icon: <CheckSquare className="w-12 h-12 text-green-500" />,
    },
    {
      title: t("welcome.step4_title"),
      description: t("welcome.step4_desc"),
      icon: <StickyNote className="w-12 h-12 text-yellow-500" />,
    },
    {
      title: t("welcome.step5_title"),
      description: t("welcome.step5_desc"),
      icon: <LineChart className="w-12 h-12 text-purple-500" />,
    },
  ];

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("flowly-tutorial-seen");
    if (!hasSeenTutorial) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("flowly-tutorial-seen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-primary/5">
            {steps[currentStep].icon}
          </div>
          <DialogTitle className="text-2xl font-display font-bold">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-1.5 py-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex flex-row justify-between sm:justify-between items-center w-full gap-2">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("welcome.back")}
          </Button>
          <Button onClick={handleNext} className="gap-2">
            {currentStep === steps.length - 1 ? t("welcome.start") : t("welcome.next")}
            {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}