import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ArrowRight } from 'lucide-react';

/**
 * Language Test Component
 * 
 * This component is used to test the language-adaptive layout features.
 * It demonstrates various UI elements that should adapt to different languages.
 */
export function LanguageTest() {
  const { currentLanguage, direction, isRTL, languageConfig } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Language Test</CardTitle>
          <CardDescription>
            Testing language-adaptive layout features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Language</Label>
              <div className="p-3 bg-muted rounded">
                {languageConfig.nativeName} ({currentLanguage})
              </div>
            </div>
            <div className="space-y-2">
              <Label>Text Direction</Label>
              <div className="p-3 bg-muted rounded">
                {direction.toUpperCase()} {isRTL ? '(RTL)' : '(LTR)'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Input Field</Label>
            <Input 
              placeholder="Type something to test..." 
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Textarea</Label>
            <Textarea 
              placeholder="Type something to test..." 
              className="w-full"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button>
              <span>Button</span>
              <ChevronRight className="rtl-flip ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              <ArrowRight className="rtl-rotate-180 mr-2 h-4 w-4" />
              <span>Button</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Spacing Test</Label>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded">Item 1</div>
              <div className="p-3 bg-muted rounded">Item 2</div>
              <div className="p-3 bg-muted rounded">Item 3</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}