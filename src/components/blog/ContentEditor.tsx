"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ContentEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ContentEditor = React.forwardRef<HTMLTextAreaElement, ContentEditorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="grid w-full gap-2">
        <Textarea
          placeholder="Write your blog post here..."
          className={cn("min-h-[400px] resize-y", className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
ContentEditor.displayName = "ContentEditor";

export default ContentEditor;
