"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Heading2, List, Link } from 'lucide-react';

interface ContentEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

const ContentEditor = React.forwardRef<HTMLTextAreaElement, ContentEditorProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const applyFormat = (format: 'bold' | 'italic' | 'h2' | 'list' | 'link') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      let newText;

      switch(format) {
        case 'h2':
          newText = `## ${selectedText}`;
          break;
        case 'bold':
          newText = `**${selectedText}**`;
          break;
        case 'italic':
          newText = `*${selectedText}*`;
          break;
        case 'list':
          newText = `- ${selectedText.split('\n').join('\n- ')}`;
          break;
        case 'link':
          newText = `[${selectedText}](url)`;
          break;
        default:
          newText = selectedText;
      }
      
      const newValue = value.substring(0, start) + newText + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        if(format === 'link' && selectedText.length > 0){
          textarea.setSelectionRange(newValue.length - 4, newValue.length -1);
        } else {
          textarea.setSelectionRange(start + newText.length, start + newText.length);
        }
      }, 0);
    }


    return (
      <div className="grid w-full gap-2 rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring">
        <div className="flex items-center gap-1 border-b border-input p-2">
            <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat('h2')} title="Heading"><Heading2 className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat('bold')} title="Bold"><Bold className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size:="icon" onClick={() => applyFormat('italic')} title="Italic"><Italic className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat('list')} title="Bullet List"><List className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat('link')} title="Link"><Link className="h-4 w-4" /></Button>
        </div>
        <Textarea
          placeholder="Write your blog post here..."
          className={cn("min-h-[400px] resize-y border-0 focus-visible:ring-0 focus-visible:ring-offset-0", className)}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      </div>
    );
  }
);
ContentEditor.displayName = "ContentEditor";

export default ContentEditor;
