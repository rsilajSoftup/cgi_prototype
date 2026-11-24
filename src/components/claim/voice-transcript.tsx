"use client";

import { Mic, MicOff } from "lucide-react";
import { useRef, useState } from "react";

import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { t } from "@/lib/i18n/ui";
import { getSpeechRecognition, speechLocale } from "@/lib/speech";

type VoiceTranscriptProps = {
  onAccept: (text: string) => void;
  label?: string;
};

export function VoiceTranscript({ onAccept, label }: VoiceTranscriptProps) {
  const { preferences } = usePreferences();
  const copy = (key: Parameters<typeof t>[1]) => t(preferences.locale, key);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [unsupported, setUnsupported] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  function start() {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setUnsupported(true);
      return;
    }
    const instance = new Ctor();
    instance.lang = speechLocale(preferences.locale);
    instance.interimResults = true;
    instance.continuous = false;
    instance.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const text = last?.[0]?.transcript ?? "";
      setTranscript(text);
    };
    instance.onerror = () => setListening(false);
    instance.onend = () => setListening(false);
    recognitionRef.current = instance;
    setListening(true);
    instance.start();
  }

  function stop() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={listening ? "secondary" : "outline"}
        size="xl"
        aria-pressed={listening}
        onClick={listening ? stop : start}
      >
        {listening ? <MicOff data-icon="inline-start" /> : <Mic data-icon="inline-start" />}
        {listening ? copy("stopVoice") : label ?? copy("voice")}
      </Button>
      {unsupported ? (
        <p className="text-muted-foreground text-sm" role="note">
          {copy("voiceUnsupported")}
        </p>
      ) : null}
      {listening ? (
        <p role="status" className="text-sm font-medium">
          {copy("voiceActive")}
        </p>
      ) : null}
      {transcript ? (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">{copy("transcriptReview")}</p>
          <Textarea
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            rows={3}
            className="text-base"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="xl"
              onClick={() => {
                onAccept(transcript.trim());
                setTranscript("");
              }}
            >
              {copy("useTranscript")}
            </Button>
            <Button type="button" variant="outline" size="xl" onClick={() => setTranscript("")}>
              {copy("discardTranscript")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
