"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Heading, List, Link, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Table, Image, Video, File } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

const ContentEditor = React.forwardRef<HTMLTextAreaElement, ContentEditorProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const applyFormat = (format: 'bold' | 'italic' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'list' | 'link' | 'image' | 'video' | 'document' | 'table') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      let newText;
      let selectionOffset = { start: 0, end: 0 };

      switch(format) {
        case 'h1':
          newText = `# ${selectedText}`;
          break;
        case 'h2':
          newText = `## ${selectedText}`;
          break;
        case 'h3':
          newText = `### ${selectedText}`;
          break;
        case 'h4':
          newText = `#### ${selectedText}`;
          break;
        case 'h5':
          newText = `##### ${selectedText}`;
          break;
        case 'h6':
          newText = `###### ${selectedText}`;
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
          selectionOffset = { start: newText.length - 4, end: newText.length - 1 };
          break;
        case 'image':
          newText = `![${selectedText}](image_url)`;
          selectionOffset = { start: newText.length - 10, end: newText.length - 1 };
          break;
        case 'video':
          newText = `[${selectedText}](video_url)`;
           selectionOffset = { start: newText.length - 10, end: newText.length - 1 };
          break;
        case 'document':
          newText = `[${selectedText}](document_url)`;
           selectionOffset = { start: newText.length - 13, end: newText.length - 1 };
          break;
        case 'table':
          newText = `| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |`;
          break;
        default:
          newText = selectedText;
      }
      
      const newValue = value.substring(0, start) + newText + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        if (['link', 'image', 'video', 'document'].includes(format) && selectedText.length > 0) {
          textarea.setSelectionRange(start + selectionOffset.start, start + selectionOffset.end);
        } else {
          textarea.setSelectionRange(start + newText.length, start + newText.length);
        }
      }, 0);
    }


    return (
      <div className="grid w-full gap-2 rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring">
        <div className="flex items-center gap-1 border-b border-input p-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" title="Headings">
                  <Heading className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => applyFormat('h1')}><Heading1 className="h-4 w-4 mr-2" />Heading 1</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => applyFormat('h2')}><Heading2 className="h-4 w-4 mr-2" />Heading 2</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => applyFormat('h3')}><Heading3 className="h-4 w-4 mr-2" />Heading 3</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => applyFormat('h4')}><Heading4 className="h-4 w-4 mr-2" />Heading 4</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => applyFormat('h5')}><Heading5 className="h-4 w-4 mr-2" />Heading 5</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => applyFormat('h6')}><Heading6 className="h-4 w-4 mr-2" />Heading 6</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat('bold')} title="Bold"><Bold className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat('italic')} title="Italic"><Italic className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat('list')} title="Bullet List"><List className="h-4 w-4" /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" title="Insert Media">
                  <Link className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => applyFormat('link')}><Link className="h-4 w-4 mr-2" />Link</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => applyFormat('image')}><Image className="h-4 w-4 mr-2" />Image</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => applyFormat('video')}><Video className="h-4 w-4 mr-2" />Video</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => applyFormat('document')}><File className="h-4 w-4 mr-2" />Document</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="button" variant="ghost" size="icon" onClick={() => applyFormat('table')} title="Table"><Table className="h-4 w-4" /></Button>
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
