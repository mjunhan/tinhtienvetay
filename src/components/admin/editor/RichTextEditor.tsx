'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Image as ImageIcon, Undo, Redo } from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addImage = useCallback(() => {
        const url = window.prompt('URL hình ảnh:');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    return (
        <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('bold') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('italic') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Heading 3"
            >
                <Heading3 size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('bulletList') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('orderedList') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('blockquote') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Quote"
            >
                <Quote size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600"
                title="Insert Image"
            >
                <ImageIcon size={18} />
            </button>

            <div className="flex-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 disabled:opacity-50"
                title="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 disabled:opacity-50"
                title="Redo"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto shadow-md my-4',
                },
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-amber max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="border border-amber-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amber-500 transition-shadow">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
