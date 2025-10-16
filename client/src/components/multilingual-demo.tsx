import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { detectTextDirection, containsArabic, containsDevanagari } from "@/lib/textUtils";

/**
 * Demo component showcasing multilingual input capabilities
 * This can be added to the settings page or as a standalone demo
 */
export function MultilingualInputDemo() {
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

  const inputDir = detectTextDirection(inputValue);
  const textareaDir = detectTextDirection(textareaValue);

  const getScriptInfo = (text: string) => {
    if (!text) return "No text";
    if (containsArabic(text)) return "Arabic/Urdu detected";
    if (containsDevanagari(text)) return "Hindi detected";
    return "Latin script";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multilingual Input Demo</CardTitle>
        <CardDescription>
          Try typing in English, Arabic (مرحبا), Urdu (سلام), or Hindi (नमस्ते) to see automatic text direction and font adaptation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Field Demo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="demo-input">Smart Input Field</Label>
            <div className="flex gap-2">
              <Badge variant="outline">{inputDir.toUpperCase()}</Badge>
              <Badge variant="secondary">{getScriptInfo(inputValue)}</Badge>
            </div>
          </div>
          <Input
            id="demo-input"
            placeholder="Type in any language..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Current direction: <strong>{inputDir}</strong> | 
            Characters: <strong>{inputValue.length}</strong>
          </p>
        </div>

        {/* Textarea Demo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="demo-textarea">Smart Textarea</Label>
            <div className="flex gap-2">
              <Badge variant="outline">{textareaDir.toUpperCase()}</Badge>
              <Badge variant="secondary">{getScriptInfo(textareaValue)}</Badge>
            </div>
          </div>
          <Textarea
            id="demo-textarea"
            placeholder="Type longer text in multiple languages..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Current direction: <strong>{textareaDir}</strong> | 
            Characters: <strong>{textareaValue.length}</strong>
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-2 p-4 bg-muted rounded-md">
          <h4 className="text-sm font-semibold">Try these examples:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
              <strong>Arabic:</strong>
              <code className="block mt-1 p-2 bg-background rounded">مرحبا بك في التطبيق</code>
            </div>
            <div>
              <strong>Urdu:</strong>
              <code className="block mt-1 p-2 bg-background rounded">آپ کا استقبال ہے</code>
            </div>
            <div>
              <strong>Hindi:</strong>
              <code className="block mt-1 p-2 bg-background rounded">आवेदन में आपका स्वागत है</code>
            </div>
            <div>
              <strong>Mixed:</strong>
              <code className="block mt-1 p-2 bg-background rounded">Hello مرحبا नमस्ते</code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
