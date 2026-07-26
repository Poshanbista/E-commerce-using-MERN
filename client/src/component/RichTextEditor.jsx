import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { ColumnsExtension } from '@tiptap-extend/columns'
import {
    Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, Columns2, Undo2, Redo2, RemoveFormatting
} from 'lucide-react'

const MenuBar = ({ editor }) => {
    if (!editor) return null

    const btnClass = (active) =>
        `p-1.5 rounded transition ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`

    return (
        <div className='flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg'>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={btnClass(editor.isActive('bold'))}
                title='Bold'
            >
                <Bold size={16} />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btnClass(editor.isActive('italic'))}
                title='Italic'
            >
                <Italic size={16} />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={btnClass(editor.isActive('strike'))}
                title='Strikethrough'
            >
                <Strikethrough size={16} />
            </button>

            <div className='w-px h-6 bg-gray-300 mx-1'></div>

            <button
                type='button'
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={btnClass(editor.isActive('heading', { level: 1 }))}
                title='Heading 1'
            >
                <Heading1 size={16} />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btnClass(editor.isActive('heading', { level: 2 }))}
                title='Heading 2'
            >
                <Heading2 size={16} />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={btnClass(editor.isActive('heading', { level: 3 }))}
                title='Heading 3'
            >
                <Heading3 size={16} />
            </button>

            <div className='w-px h-6 bg-gray-300 mx-1'></div>

            <button
                type='button'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={btnClass(editor.isActive('bulletList'))}
                title='Bullet List'
            >
                <List size={16} />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btnClass(editor.isActive('orderedList'))}
                title='Ordered List'
            >
                <ListOrdered size={16} />
            </button>

            <div className='w-px h-6 bg-gray-300 mx-1'></div>

            <button
                type='button'
                onClick={() => editor.chain().focus().setColumns().run()}
                className={btnClass(false)}
                title='Two Columns'
            >
                <Columns2 size={16} />
            </button>

            <div className='w-px h-6 bg-gray-300 mx-1'></div>

            <button
                type='button'
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                className={btnClass(false)}
                title='Clear Formatting'
            >
                <RemoveFormatting size={16} />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className={`${btnClass(false)} disabled:opacity-30 disabled:cursor-not-allowed`}
                title='Undo'
            >
                <Undo2 size={16} />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className={`${btnClass(false)} disabled:opacity-30 disabled:cursor-not-allowed`}
                title='Redo'
            >
                <Redo2 size={16} />
            </button>
        </div>
    )
}

const RichTextEditor = ({ value, onChange, placeholder = "Write product description..." }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            ColumnsExtension,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose max-w-none p-3 min-h-[120px] focus:outline-none',
            },
        },
    })

    return (
        <div className='border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition bg-white'>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor
