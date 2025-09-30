import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { API_CONFIG } from '../../config';
import { ArrowLeft, Save } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

const RichText = ({ value, onChange, onBlur }) => {
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: true }), Image],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'ProseMirror prose max-w-none w-full min-h-[320px] focus:outline-none outline-none',
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          const { from } = view.state.selection;
          const coords = view.coordsAtPos(from);
          setSlashPos({ top: coords.bottom, left: coords.left });
          setSlashOpen(true);
        } else if (event.key === 'Escape') {
          setSlashOpen(false);
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  React.useEffect(() => {
    if (!editor) return;
    const handler = () => { if (onBlur) onBlur(); };
    editor.on('blur', handler);
    return () => {
      editor.off('blur', handler);
    };
  }, [editor, onBlur]);

  // Keep editor content in sync when external value changes (e.g., after fetch)
  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || '';
    if (incoming && incoming !== current) {
      // Preserve cursor position during content update
      const { from } = editor.state.selection;
      editor.commands.setContent(incoming, false);
      // Restore cursor position if possible
      try {
        if (from <= editor.state.doc.content.size) {
          editor.commands.setTextSelection(from);
        }
      } catch (e) {
        // If position is invalid, just focus without moving cursor
        editor.commands.focus();
      }
    }
  }, [editor, value]);

  const insertImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_CONFIG.BACKEND_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url && editor) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (e) {
        console.error('Upload failed', e);
        alert('Görsel yüklenemedi');
      }
    };
    input.click();
  };

  const applySlashCommand = async (cmd) => {
    if (!editor) return;
    const { from } = editor.state.selection;
    const prevChar = editor.state.doc.textBetween(Math.max(0, from - 1), from);
    if (prevChar === '/') {
      editor.chain().focus().deleteRange({ from: from - 1, to: from }).run();
    }
    switch (cmd) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'ul':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'ol':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'img':
        await insertImage();
        break;
      default:
        break;
    }
    setSlashOpen(false);
  };

  return (
    <div className="border rounded-md relative">
      <div className="flex items-center gap-2 border-b p-2 text-sm flex-wrap">
        <Button type="button" variant="outline" size="sm" onClick={() => editor && editor.chain().focus().toggleBold().run()} className={editor && editor.isActive('bold') ? 'bg-blue-50' : ''}>B</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor && editor.chain().focus().toggleItalic().run()} className={editor && editor.isActive('italic') ? 'bg-blue-50' : ''}><i>I</i></Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor && editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor && editor.isActive('heading', { level: 1 }) ? 'bg-blue-50' : ''}>H1</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor && editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor && editor.isActive('heading', { level: 2 }) ? 'bg-blue-50' : ''}>H2</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor && editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor && editor.isActive('heading', { level: 3 }) ? 'bg-blue-50' : ''}>H3</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor && editor.chain().focus().toggleHeading({ level: 4 }).run()} className={editor && editor.isActive('heading', { level: 4 }) ? 'bg-blue-50' : ''}>H4</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor && editor.chain().focus().toggleBulletList().run()} className={editor && editor.isActive('bulletList') ? 'bg-blue-50' : ''}>• Liste</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => editor && editor.chain().focus().toggleOrderedList().run()} className={editor && editor.isActive('orderedList') ? 'bg-blue-50' : ''}>1. Liste</Button>
        <Button type="button" variant="outline" size="sm" onClick={insertImage}>Görsel</Button>
      </div>
      <div
        className="p-2 cursor-text"
        onClick={(e) => {
          if (!editor) return;
          // Only focus without forcing cursor to end if clicking on empty area
          if (e.target === e.currentTarget) {
            editor.commands.focus();
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {slashOpen && (
        <div
          className="fixed z-50 bg-white border rounded-md shadow-md text-sm"
          style={{ top: slashPos.top, left: slashPos.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => applySlashCommand('h1')}>Başlık 1</div>
          <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => applySlashCommand('h2')}>Başlık 2</div>
          <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => applySlashCommand('h3')}>Başlık 3</div>
          <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => applySlashCommand('ul')}>Madde İçi Liste</div>
          <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => applySlashCommand('ol')}>Numaralı Liste</div>
          <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => applySlashCommand('img')}>Görsel Ekle</div>
        </div>
      )}
    </div>
  );
};

const BlogPostEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = useMemo(() => !!id, [id]);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    featured_image: '',
    is_published: false,
    published_at: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const generateSlugFromTitle = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const generateExcerptFromHtml = (html) => {
    const text = (html || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const sentences = text.split(/([.!?])\s+/).reduce((acc, cur, idx, arr) => {
      if (idx % 2 === 0) {
        const end = arr[idx + 1] || '';
        acc.push(cur + end);
      }
      return acc;
    }, []);
    const firstTwo = (sentences[0] || '') + ' ' + (sentences[1] || '');
    return firstTwo.trim().slice(0, 300);
  };

  useEffect(() => {
    if (!isEditing) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/blog-posts`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Load failed');
        const list = await res.json();
        const post = list.find((p) => p.id === id);
        if (post) {
          setForm({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            author: post.author || '',
            category: post.category || '',
            tags: (post.tags || []).join(', '),
            featured_image: post.featured_image || '',
            is_published: !!post.is_published,
            published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
            meta_title: post.meta_title || '',
            meta_description: post.meta_description || '',
            meta_keywords: (post.meta_keywords || []).join(', '),
          });
        }
      } catch (e) {
        console.error('Post load failed', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [isEditing, id]);

  const handleSave = async (overrideIsPublished) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        category: form.category,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        featured_image: form.featured_image || null,
        is_published: typeof overrideIsPublished === 'boolean' ? overrideIsPublished : !!form.is_published,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        meta_keywords: form.meta_keywords.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const endpoint = isEditing
        ? `${API_CONFIG.BACKEND_URL}/api/admin/blog-posts/${id}`
        : `${API_CONFIG.BACKEND_URL}/api/admin/blog-posts`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save failed ${res.status}`);
      navigate('/admin/blog-posts');
    } catch (e) {
      console.error(e);
      alert('Kaydetme başarısız: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/blog-posts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}</h1>
            <p className="text-gray-600">Blog içeriğini {isEditing ? 'güncelleyin' : 'oluşturun'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/blog-posts')}>İptal</Button>
          <Button onClick={() => handleSave(false)} disabled={loading} variant="outline">
            Taslak Olarak Kaydet
          </Button>
          <Button onClick={() => handleSave(true)} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Kaydediliyor…' : (<><Save className="h-4 w-4 mr-2" />Yayınla</>)}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İçerik</CardTitle>
          <CardDescription>Başlık, özet ve metni düzenleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            className="w-full border rounded-md p-2"
            placeholder="Başlık"
            value={form.title}
            onChange={(e)=>setForm({...form,title:e.target.value})}
            onBlur={() => {
              if (form.title?.trim()) {
                if (!form.slug) {
                  const slug = generateSlugFromTitle(form.title);
                  setForm((f) => ({ ...f, slug }));
                }
                if (!form.meta_title) {
                  setForm((f) => ({ ...f, meta_title: form.title }));
                }
              }
            }}
          />
          <input className="w-full border rounded-md p-2" placeholder="Slug" value={form.slug} onChange={(e)=>setForm({...form,slug:e.target.value})} />
          <input className="w-full border rounded-md p-2" placeholder="Özet (excerpt)" value={form.excerpt} onChange={(e)=>setForm({...form,excerpt:e.target.value})} />
          <RichText
            value={form.content}
            onChange={(v)=>setForm({...form,content:v})}
            onBlur={() => {
              if (!form.excerpt) {
                const ex = generateExcerptFromHtml(form.content);
                if (ex) setForm((f) => ({ ...f, excerpt: ex }));
              }
            }}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Meta</CardTitle>
            <CardDescription>Yazar, kategori, etiketler</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input className="w-full border rounded-md p-2" placeholder="Yazar" value={form.author} onChange={(e)=>setForm({...form,author:e.target.value})} />
            <input className="w-full border rounded-md p-2" placeholder="Kategori" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} />
            <input className="w-full border rounded-md p-2" placeholder="Etiketler (virgülle)" value={form.tags} onChange={(e)=>setForm({...form,tags:e.target.value})} />
            <div>
              <label className="text-sm text-gray-600">Yayın Tarihi</label>
              <input type="datetime-local" className="w-full border rounded-md p-2" value={form.published_at} onChange={(e)=>setForm({...form,published_at:e.target.value})} />
            </div>
            {/* Yayın durumu checkbox'ı kaldırıldı; durum üstteki butonlarla yönetiliyor */}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Görsel</CardTitle>
            <CardDescription>Öne çıkarılan görsel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input className="w-full border rounded-md p-2" placeholder="https://..." value={form.featured_image} onChange={(e)=>setForm({...form,featured_image:e.target.value})} />
            {form.featured_image && (
              <img src={form.featured_image} alt="preview" className="mt-2 rounded-md border max-h-40 object-cover w-full" onError={(e)=>{e.currentTarget.style.display='none'}} />
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <CardDescription>Meta alanları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input className="w-full border rounded-md p-2" placeholder="SEO Başlık" value={form.meta_title} onChange={(e)=>setForm({...form,meta_title:e.target.value})} />
            <input className="w-full border rounded-md p-2" placeholder="SEO Açıklama" value={form.meta_description} onChange={(e)=>setForm({...form,meta_description:e.target.value})} />
            <input className="w-full border rounded-md p-2" placeholder="SEO Anahtar Kelimeler (virgülle)" value={form.meta_keywords} onChange={(e)=>setForm({...form,meta_keywords:e.target.value})} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPostEdit;


