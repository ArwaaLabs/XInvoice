import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ChevronRight, Info } from 'lucide-react';

/**
 * Language Layout Demo Component
 * 
 * This component demonstrates the automatic layout adaptation
 * across different languages. Use it as a reference for implementing
 * language-adaptive UI components.
 */
export function LanguageLayoutDemo() {
  const { currentLanguage, direction, isRTL, languageConfig } = useLanguage();

  return (
    <div className="space-y-6 p-6">
      {/* Language Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Current Language Configuration
          </CardTitle>
          <CardDescription>
            Showing adaptive layout features for the selected language
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Language</Label>
              <p className="font-medium">{languageConfig.nativeName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Direction</Label>
              <Badge variant={isRTL ? "secondary" : "default"}>
                {direction.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Font Family</Label>
              <p className="font-medium text-sm">{languageConfig.fontFamily}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Font Size</Label>
              <p className="font-medium">{languageConfig.fontSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Scaling</CardTitle>
          <CardDescription>
            Font sizes automatically adjust for optimal readability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h1>Heading 1 - Largest</h1>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'en' && '36px (English)'}
              {currentLanguage === 'ar' && '40px (Arabic)'}
              {currentLanguage === 'ur' && '44px (Urdu)'}
              {currentLanguage === 'hi' && '38px (Hindi)'}
            </p>
          </div>
          <div>
            <h2>Heading 2 - Large</h2>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'en' && '30px (English)'}
              {currentLanguage === 'ar' && '32px (Arabic)'}
              {currentLanguage === 'ur' && '36px (Urdu)'}
              {currentLanguage === 'hi' && '30px (Hindi)'}
            </p>
          </div>
          <div>
            <h3>Heading 3 - Medium</h3>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'en' && '24px (English)'}
              {currentLanguage === 'ar' && '26px (Arabic)'}
              {currentLanguage === 'ur' && '30px (Urdu)'}
              {currentLanguage === 'hi' && '24px (Hindi)'}
            </p>
          </div>
          <div>
            <p className="text-base">
              Body text - Regular paragraph content automatically scales
            </p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'en' && '16px (English)'}
              {currentLanguage === 'ar' && '17px (Arabic)'}
              {currentLanguage === 'ur' && '18px (Urdu)'}
              {currentLanguage === 'hi' && '16px (Hindi)'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RTL Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChevronRight className="rtl-flip h-5 w-5" />
            Direction-Aware Components
          </CardTitle>
          <CardDescription>
            Icons and layouts automatically flip in RTL languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <ArrowRight className="rtl-rotate-180 h-4 w-4" />
            <span>Arrow rotates 180° in RTL</span>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight className="rtl-flip h-4 w-4" />
            <span>Chevron flips horizontally in RTL</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Start alignment</span>
            <Badge>End position</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Form Field Adaptation</CardTitle>
          <CardDescription>
            Input heights and spacing adjust for different scripts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="demo-name">Name Field</Label>
            <Input
              id="demo-name"
              placeholder="Enter your name..."
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'en' && 'Height: 2.5rem (English)'}
              {currentLanguage === 'ar' && 'Height: 2.75rem (Arabic)'}
              {currentLanguage === 'ur' && 'Height: 3rem (Urdu - tallest for Nastaliq)'}
              {currentLanguage === 'hi' && 'Height: 2.75rem (Hindi)'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="demo-email">Email Field</Label>
            <Input
              id="demo-email"
              type="email"
              placeholder="email@example.com"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Spacing Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Spacing</CardTitle>
          <CardDescription>
            Vertical spacing increases for RTL languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded">Item 1</div>
            <div className="p-3 bg-muted rounded">Item 2</div>
            <div className="p-3 bg-muted rounded">Item 3</div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {currentLanguage === 'en' && 'Gap: 1rem (English)'}
            {currentLanguage === 'ar' && 'Gap: 1.25rem (Arabic - increased)'}
            {currentLanguage === 'ur' && 'Gap: 1.25rem (Urdu - increased)'}
            {currentLanguage === 'hi' && 'Gap: 1.125rem (Hindi - slightly increased)'}
          </p>
        </CardContent>
      </Card>

      {/* Button Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Button Sizing</CardTitle>
          <CardDescription>
            Buttons adjust height for better text visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">
              Default Button
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <span>With Icon</span>
              <ArrowRight className="rtl-rotate-180 h-4 w-4" />
            </Button>
            <Button variant="outline">
              Outline Button
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {currentLanguage === 'en' && 'Min height: 2.25rem (English)'}
            {currentLanguage === 'ar' && 'Min height: 2.5rem (Arabic)'}
            {currentLanguage === 'ur' && 'Min height: 2.5rem (Urdu)'}
            {currentLanguage === 'hi' && 'Min height: 2.375rem (Hindi)'}
          </p>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">1</Badge>
            <div>
              <p className="font-medium">Use logical properties</p>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                ps-4, pe-2 instead of pl-4, pr-2
              </code>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">2</Badge>
            <div>
              <p className="font-medium">Add RTL utilities to icons</p>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                rtl-flip or rtl-rotate-180
              </code>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">3</Badge>
            <div>
              <p className="font-medium">Use flexible widths</p>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                w-full, max-w-* instead of fixed widths
              </code>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">4</Badge>
            <div>
              <p className="font-medium">Test in all languages</p>
              <p className="text-muted-foreground">
                Verify layout works in English, Arabic, Urdu, and Hindi
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
