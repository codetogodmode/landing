import { useState, useEffect, useCallback, type FormEvent } from "react";

const ACCESS_KEY = "IDDQD";

interface Step {
  num: number;
  title: string;
  desc: string;
  detail: string[];
  action: string;
  actionUrl: string;
  secondAction?: string;
  secondUrl?: string;
  icon: React.ReactNode;
}

/* Brand icons — Simple Icons, all viewBox 0 0 24 24 */
const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const VSCodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
    <path d="M23.15 2.587L18.21.21a1.516 1.516 0 0 0-1.706.355L6.706 9.871l-4.35-3.3a1.008 1.008 0 0 0-1.29.058l-1.006.935a1.01 1.01 0 0 0-.001 1.462L3.963 12 .06 14.974a1.01 1.01 0 0 0 .001 1.462l1.006.935a1.008 1.008 0 0 0 1.29.057l4.35-3.3 9.797 9.307a1.516 1.516 0 0 0 1.706.355l4.94-2.377A1.516 1.516 0 0 0 24 19.929V4.071a1.516 1.516 0 0 0-.85-1.484zM17.66 16.779l-7.315-4.78 7.315-4.78z" />
  </svg>
);

const ExtensionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-[18px]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.657-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58z" />
  </svg>
);

const DotNetIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
    <path d="M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L4.78 9.863a2.896 2.896 0 0 1-.258-.51h-.036c.032.189.048.592.048 1.21v5.772H3.157V7.53h1.659l3.965 6.32c.167.261.275.442.323.54h.024a6.16 6.16 0 0 1-.048-1.13V7.53h1.378zm-7.9.079a1.106 1.106 0 0 1-.762-.27.91.91 0 0 1-.303-.703c0-.282.1-.512.303-.69a1.092 1.092 0 0 1 .762-.272c.3 0 .55.09.746.272a.9.9 0 0 1 .299.69.919.919 0 0 1-.3.704 1.074 1.074 0 0 1-.745.269z" />
  </svg>
);

const GitIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
    <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.66 2.66a1.838 1.838 0 1 1-1.103 1.06l-2.479-2.48v6.535a1.839 1.839 0 1 1-1.513-.036V8.81a1.838 1.838 0 0 1-.998-2.41L7.636 3.674.454 10.856a1.55 1.55 0 0 0 0 2.188l10.48 10.48a1.55 1.55 0 0 0 2.186 0l10.426-10.407a1.55 1.55 0 0 0 0-2.188z" />
  </svg>
);

const STEPS: Step[] = [
  {
    num: 1,
    title: "Discord",
    desc: "Komunikační platforma — tady se budeme potkávat a řešit problémy.",
    detail: [
      "Jdi na discord.com/register a vytvoř si účet (stačí email a heslo).",
      "Stáhni si Discord aplikaci na počítač — funguje lépe než webovka.",
      "Klikni na odkaz níže pro připojení na náš server a potvrď pozvánku.",
    ],
    action: "Vytvořit účet",
    actionUrl: "https://discord.com/register",
    secondAction: "Připojit se na server",
    secondUrl: "https://discord.gg/PLACEHOLDER",
    icon: <DiscordIcon />,
  },
  {
    num: 2,
    title: "GitHub",
    desc: "Platforma pro kód — tady bude žít všechno, co napíšeš.",
    detail: [
      "Jdi na github.com/signup a vytvoř si účet.",
      "Zvol si uživatelské jméno, které ti dává smysl (bude veřejné).",
      "Po registraci pošli Martinovi své GitHub uživatelské jméno (to, co máš v URL: github.com/tvoje-jmeno) — přidá tě do naší organizace, kde bude žít veškerý kód.",
    ],
    action: "Vytvořit účet",
    actionUrl: "https://github.com/signup",
    icon: <GitHubIcon />,
  },
  {
    num: 3,
    title: "Visual Studio Code",
    desc: "Editor kódu — tady budeš psát programy. Zdarma, funguje všude.",
    detail: [
      "Na stránce vyber verzi pro svůj systém (Windows / Mac / Linux).",
      "Stáhni instalátor a projdi instalací (výchozí nastavení je OK).",
      "Po instalaci otevři VS Code, ať víš že běží.",
    ],
    action: "Stáhnout VS Code",
    actionUrl: "https://code.visualstudio.com/download",
    icon: <VSCodeIcon />,
  },
  {
    num: 4,
    title: "C# Dev Kit (rozšíření do VS Code)",
    desc: "Rozšíření, které zapne podporu C# jazyka v editoru.",
    detail: [
      "Otevři VS Code.",
      "Jdi do Extensions — buď přes ikonu kostek na levém panelu, nebo klávesou Ctrl+Shift+X.",
      'Do vyhledávání napiš "C# Dev Kit" a nainstaluj rozšíření od Microsoftu.',
      "Pokud VS Code nabídne restart, klikni na \"Restart\" — to je v pořádku, jen se restartuje editor.",
    ],
    action: "Zobrazit rozšíření",
    actionUrl: "https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit",
    icon: <ExtensionIcon />,
  },
  {
    num: 5,
    title: ".NET 10 SDK",
    desc: "Programovací platforma — základ, na kterém budeme stavět.",
    detail: [
      "Na stránce klikni na svůj systém a stáhni SDK (ne Runtime!).",
      "Projdi instalací — výchozí nastavení stačí.",
      "Ověření: otevři terminál (ve VS Code: Ctrl+`) a napiš: dotnet --version",
      "Mělo by se zobrazit číslo verze (např. 10.0.xxx). Pokud ano, je to OK.",
    ],
    action: "Stáhnout .NET 10",
    actionUrl: "https://dotnet.microsoft.com/download/dotnet/10.0",
    icon: <DotNetIcon />,
  },
  {
    num: 6,
    title: "Git",
    desc: "Správa verzí kódu — umožňuje sledovat změny a spolupracovat.",
    detail: [
      "Stáhni Git pro svůj systém — na Windows vyber \"Standalone Installer\" (64-bit).",
      "Při instalaci nech vše na výchozích hodnotách, jen klikej Next.",
      "Ověření: otevři terminál a napiš: git --version",
      "Mělo by se zobrazit číslo verze. Pokud ano, máš hotovo!",
    ],
    action: "Stáhnout Git",
    actionUrl: "https://git-scm.com/downloads",
    icon: <GitIcon />,
  },
];

function useChecklist(): [Set<number>, (num: number) => void] {
  const [checked, setChecked] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem("ctgm-checklist");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggle = useCallback((num: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      localStorage.setItem("ctgm-checklist", JSON.stringify([...next]));
      return next;
    });
  }, []);

  return [checked, toggle];
}

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === ACCESS_KEY) {
      localStorage.setItem("ctgm-access", "1");
      onUnlock();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 bg-base">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-sm w-full">
        <div className="mb-8">
          <p className="text-sm font-display font-600 text-accent mb-4 tracking-wider uppercase">
            Code to God Mode
          </p>
          <h1 className="font-display font-800 text-3xl sm:text-4xl tracking-tight text-text mb-3">
            Připrav se na cestu
          </h1>
          <p className="text-text-muted">
            Zadej přístupový kód od Martina.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Přístupový kód"
            autoFocus
            className={`w-full px-5 py-3.5 bg-transparent border border-border rounded-xl text-center font-mono text-lg tracking-[0.25em] uppercase text-text placeholder:text-text-faint placeholder:tracking-normal placeholder:normal-case placeholder:font-body placeholder:text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-200 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
          />
          <button
            type="submit"
            className="w-full px-5 py-3.5 bg-accent hover:bg-accent-muted font-display font-700 text-base rounded-xl transition-colors duration-200 cursor-pointer"
            style={{ color: "#13111a" }}
          >
            Vstoupit
          </button>
        </form>
      </div>
    </div>
  );
}

function StepCard({
  step,
  isChecked,
  onToggle,
  index,
}: {
  step: Step;
  isChecked: boolean;
  onToggle: () => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 animate-[fadeUp_0.4s_ease-out_both] ${
        isChecked
          ? "border-sage/30 bg-sage/[0.03]"
          : "border-border hover:border-text-faint/30"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Main row */}
      <div className="flex items-center gap-3.5 px-4 py-3.5 sm:px-5">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isChecked
              ? "bg-sage border-sage text-base"
              : "border-text-faint/40 hover:border-accent/50"
          }`}
        >
          {isChecked && (
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Icon */}
        <div
          className={`shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
            isChecked
              ? "border-sage/20 text-sage"
              : "border-border text-text-muted"
          }`}
        >
          {step.icon}
        </div>

        {/* Title + desc */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-display font-700 text-[15px] leading-tight transition-colors ${
              isChecked ? "text-sage" : "text-text"
            }`}
          >
            {step.title}
          </h3>
          <p className="text-text-muted text-sm leading-snug mt-0.5">
            {step.desc}
          </p>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-text-faint hover:text-text-muted transition-all cursor-pointer"
          aria-label={expanded ? "Sbalit" : "Zobrazit návod"}
        >
          <svg
            className={`size-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expandable detail */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 pl-[3.75rem] sm:pl-[4.25rem]">
            <div className="border-t border-border/50 pt-3 space-y-2">
              {step.detail.map((line, i) => (
                <div key={i} className="flex gap-2 text-sm text-text-muted leading-relaxed">
                  <span className="text-accent shrink-0">›</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <a
                href={step.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-accent/25 hover:border-accent/40 hover:bg-accent/5 text-accent font-display font-600 text-sm rounded-lg transition-all duration-200"
              >
                {step.action}
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
              {step.secondAction && step.secondUrl && (
                <a
                  href={step.secondUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-teal/25 hover:border-teal/40 hover:bg-teal/5 text-teal font-display font-600 text-sm rounded-lg transition-all duration-200"
                >
                  {step.secondAction}
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrereqsPage() {
  const [checked, toggle] = useChecklist();
  const allDone = checked.size === STEPS.length;

  return (
    <div className="min-h-svh bg-base">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 left-1/4 w-[500px] h-[500px] bg-accent/6 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-teal/4 rounded-full blur-[130px]" />
        <div className="absolute -bottom-32 left-1/3 w-[350px] h-[350px] bg-sage/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-5 py-10 sm:py-16">
        <div className="text-center mb-10 animate-[fadeUp_0.4s_ease-out]">
          <p className="text-sm font-display font-600 text-accent mb-3 tracking-wider uppercase">
            Code to God Mode
          </p>
          <h1 className="font-display font-800 text-3xl sm:text-4xl tracking-tight text-text mb-3">
            Připrav si prostředí
          </h1>
          <p className="text-text-muted max-w-md mx-auto leading-relaxed">
            Projdi si kroky a nainstaluj vše potřebné.
            U každého kroku najdeš podrobný návod.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex gap-1.5">
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className={`w-6 h-1.5 rounded-full transition-colors duration-300 ${
                    checked.has(s.num) ? "bg-sage" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-text-faint">
              {checked.size}/{STEPS.length}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 mb-10">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.num}
              step={step}
              isChecked={checked.has(step.num)}
              onToggle={() => toggle(step.num)}
              index={i}
            />
          ))}
        </div>

        <div className="text-center">
          <div
            className={`inline-block rounded-xl px-6 py-5 sm:px-8 sm:py-6 border transition-all duration-500 ${
              allDone ? "border-sage/25 bg-sage/[0.03]" : "border-border"
            }`}
          >
            {allDone ? (
              <>
                <p className="font-display font-700 text-lg text-sage mb-2">
                  Všechno připraveno!
                </p>
                <p className="text-text-muted text-sm mb-3">
                  Napiš Martinovi, ať tě přidá do týmu:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-text font-mono text-xs">
                    <DiscordIcon />
                    stratorheus
                  </span>
                  <span className="text-text-faint text-xs">nebo</span>
                  <a
                    href="https://wa.me/420604278582"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-text font-mono text-xs hover:border-sage/30 transition-colors"
                  >
                    <svg className="size-4 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </>
            ) : (
              <p className="text-text-muted text-sm">
                Odškrtni si kroky a připrav se na první session.
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 text-center">
          <span className="text-text-faint text-xs font-mono tracking-wider">
            CTGM / {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem("ctgm-access") === "1",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get("key");
    if (keyParam?.toUpperCase() === ACCESS_KEY) {
      localStorage.setItem("ctgm-access", "1");
      setUnlocked(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (!unlocked) {
    return <AccessGate onUnlock={() => setUnlocked(true)} />;
  }

  return <PrereqsPage />;
}
