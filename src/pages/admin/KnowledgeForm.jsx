import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Image as Img, Plus, Trash2,
  AlignLeft, Quote, Heading2, Heading3, Minus,
  GripVertical, Eye, EyeOff
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '../../config/supabase';

/* ══════════════════════════════════════
   CSS
══════════════════════════════════════ */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');

:root{
  --bg:#070708; --s1:#0e0e11; --s2:#141418; --s3:#1a1a1f;
  --bd:rgba(255,255,255,0.06); --bd2:rgba(255,255,255,0.1);
  --red:#e10600; --red-g:rgba(225,6,0,0.18);
  --txt:#ececec; --t2:rgba(255,255,255,0.42); --t3:rgba(255,255,255,0.18);
}

.kf{font-family:'Barlow',sans-serif;color:var(--txt);background:var(--bg);min-height:100vh;}
.kf *,.kf *::before,.kf *::after{box-sizing:border-box;margin:0;padding:0;}

.kf-atm{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(ellipse 60% 40% at 30% -5%,rgba(225,6,0,0.05) 0%,transparent 60%),
    repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,0.012) 79px,rgba(255,255,255,0.012) 80px),
    repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.012) 79px,rgba(255,255,255,0.012) 80px);
}
.kf-shell{max-width:1160px;margin:0 auto;padding:0 1.5rem 6rem;position:relative;z-index:1;}

/* ── HEADER ── */
.kf-hd{display:flex;align-items:center;justify-content:space-between;padding:2rem 0 2rem;gap:1rem;flex-wrap:wrap;border-bottom:1px solid var(--bd);margin-bottom:2rem;}
.kf-back{display:inline-flex;align-items:center;gap:0.45rem;font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:var(--t2);background:none;border:1px solid var(--bd2);padding:0.48rem 0.9rem;cursor:pointer;transition:all 0.2s;}
.kf-back:hover{color:#fff;border-color:var(--bd2);background:var(--s2);}
.kf-hd-label{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:900;text-transform:uppercase;color:#fff;flex:1;}
.kf-hd-label em{font-style:italic;color:var(--red);}
.kf-acts{display:flex;gap:0.45rem;}
.kf-btn{display:inline-flex;align-items:center;gap:0.4rem;font-family:'Barlow Condensed',sans-serif;font-size:0.78rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;padding:0.58rem 1.15rem;border:none;cursor:pointer;transition:all 0.2s;}
.kf-btn-ghost{background:var(--s2);color:var(--t2);border:1px solid var(--bd2);}
.kf-btn-ghost:hover{color:#fff;border-color:rgba(255,255,255,0.2);}
.kf-btn-red{background:var(--red);color:#fff;box-shadow:0 0 20px rgba(225,6,0,0.28);}
.kf-btn-red:hover{background:#c00500;box-shadow:0 0 28px rgba(225,6,0,0.38);}
.kf-btn-red:disabled{background:#2a2a2a;box-shadow:none;cursor:not-allowed;color:var(--t3);}

/* ── LAYOUT ── */
.kf-layout{display:grid;grid-template-columns:1fr 268px;gap:1.5rem;align-items:start;}
@media(max-width:820px){.kf-layout{grid-template-columns:1fr;}}

/* ── EDITOR CARD ── */
.kf-ed{background:var(--s1);border:1px solid var(--bd);overflow:hidden;}

/* Title / excerpt */
.kf-art-title{
  width:100%;background:transparent;border:none;outline:none;
  border-bottom:1px solid var(--bd);
  padding:1.75rem 2rem;
  font-family:'Barlow Condensed',sans-serif;font-size:2.1rem;font-weight:900;
  text-transform:uppercase;letter-spacing:0.01em;color:#fff;
}
.kf-art-title::placeholder{color:rgba(255,255,255,0.1);}
.kf-art-excerpt{
  width:100%;background:transparent;border:none;outline:none;resize:none;
  border-bottom:1px solid var(--bd);
  padding:0.85rem 2rem;
  font-family:'Barlow',sans-serif;font-size:0.92rem;color:var(--t2);line-height:1.6;
}
.kf-art-excerpt::placeholder{color:rgba(255,255,255,0.1);}

/* Toolbar */
.kf-toolbar{
  display:flex;align-items:center;gap:0.25rem;padding:0.6rem 1.25rem;flex-wrap:wrap;
  background:rgba(0,0,0,0.3);border-bottom:1px solid var(--bd);min-height:44px;
}
.kf-toolbar-lbl{font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;color:var(--t3);padding-right:0.5rem;white-space:nowrap;}
.kf-tbb{
  display:inline-flex;align-items:center;gap:0.28rem;
  font-family:'Barlow Condensed',sans-serif;font-size:0.7rem;font-weight:700;
  letter-spacing:0.07em;text-transform:uppercase;
  background:transparent;border:1px solid transparent;color:var(--t2);
  padding:0.3rem 0.6rem;cursor:pointer;transition:all 0.15s;
}
.kf-tbb:hover{background:var(--s3);border-color:var(--bd);color:var(--txt);}

/* Blocks area */
.kf-blocks{padding:1rem;display:flex;flex-direction:column;gap:2px;min-height:300px;}

/* ── BLOCK ROW ── */
.kf-brow{display:flex;align-items:flex-start;gap:0;position:relative;group:true;}
.kf-brow:hover .kf-bhandle{opacity:0.5;}
.kf-brow:hover .kf-bdel{opacity:1;}

.kf-bhandle{
  display:flex;align-items:center;justify-content:center;
  width:26px;flex-shrink:0;cursor:grab;color:var(--t3);
  padding-top:10px;opacity:0;transition:opacity 0.2s;touch-action:none;
}
.kf-bhandle:active{cursor:grabbing;}

.kf-bbody{flex:1;min-width:0;}

.kf-bdel{
  display:flex;align-items:center;justify-content:center;
  width:26px;height:28px;border:none;background:transparent;
  color:transparent;cursor:pointer;margin-top:8px;flex-shrink:0;
  opacity:0;transition:all 0.15s;
}
.kf-brow:hover .kf-bdel{color:rgba(225,6,0,0.3);}
.kf-bdel:hover{background:rgba(225,6,0,0.1);color:var(--red) !important;}

/* Text blocks */
.kf-ta{
  width:100%;background:transparent;border:1px solid transparent;
  outline:none;resize:none;min-height:46px;
  font-family:'Barlow',sans-serif;font-size:1rem;line-height:1.8;
  color:var(--txt);padding:0.45rem 0.5rem;transition:border-color 0.15s;
}
.kf-ta:focus{border-color:rgba(255,255,255,0.07);background:rgba(255,255,255,0.015);}
.kf-ta::placeholder{color:rgba(255,255,255,0.13);}
.kf-ta-h2{font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:900;text-transform:uppercase;line-height:1.25;}
.kf-ta-h3{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:800;text-transform:uppercase;color:rgba(255,255,255,0.65);}
.kf-ta-q{font-style:italic;font-size:1.02rem;color:rgba(255,255,255,0.52);}

/* Quote wrapper */
.kf-quote-w{border-left:3px solid var(--red);background:rgba(225,6,0,0.04);overflow:hidden;}

/* Divider */
.kf-divider-row{display:flex;align-items:center;gap:0.65rem;padding:0.75rem 0.5rem;}
.kf-divider-l{flex:1;height:1px;background:var(--bd2);}
.kf-divider-t{font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:var(--t3);white-space:nowrap;}

/* Image */
.kf-img-blk{padding:0.5rem;}
.kf-img-prev{width:100%;max-height:260px;object-fit:cover;display:block;border:1px solid var(--bd);margin-bottom:0.5rem;}
.kf-img-url{width:100%;background:rgba(0,0,0,0.25);border:1px solid var(--bd2);color:var(--t2);padding:0.48rem 0.7rem;font-size:0.82rem;outline:none;transition:border-color 0.2s;}
.kf-img-url:focus{border-color:rgba(225,6,0,0.4);color:#fff;}
.kf-img-up-row{display:flex;align-items:center;gap:0.4rem;margin-top:0.35rem;cursor:pointer;}
.kf-img-up-lbl{font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--t3);transition:color 0.15s;}
.kf-img-up-lbl:hover{color:var(--t2);}
.kf-img-cap{width:100%;background:transparent;border:none;border-top:1px solid var(--bd);color:var(--t3);font-size:0.78rem;font-style:italic;padding:0.38rem 0.5rem;outline:none;margin-top:0.25rem;}
.kf-img-cap::placeholder{color:rgba(255,255,255,0.1);}

/* ── SIDEBAR ── */
.kf-sb{display:flex;flex-direction:column;gap:1rem;position:sticky;top:1rem;}
.kf-panel{background:var(--s1);border:1px solid var(--bd);overflow:hidden;}
.kf-panel-hd{padding:0.75rem 1.1rem;background:rgba(0,0,0,0.28);border-bottom:1px solid var(--bd);font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;color:var(--t3);}
.kf-panel-bd{padding:1rem 1.1rem;display:flex;flex-direction:column;gap:0.75rem;}

/* Status */
.kf-status{display:flex;align-items:center;justify-content:center;gap:0.45rem;width:100%;font-family:'Barlow Condensed',sans-serif;font-size:0.75rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;border:none;padding:0.7rem;cursor:pointer;transition:all 0.2s;}
.kf-status.draft{background:rgba(255,255,255,0.04);border:1px solid var(--bd2);color:var(--t2);}
.kf-status.pub{background:rgba(34,200,100,0.08);border:1px solid rgba(34,200,100,0.22);color:rgba(34,200,100,0.85);}

/* Sidebar fields */
.kf-lbl{display:block;font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:var(--t3);margin-bottom:0.38rem;}
.kf-inp{width:100%;background:rgba(0,0,0,0.28);color:var(--txt);border:1px solid var(--bd2);padding:0.55rem 0.75rem;font-family:'Barlow',sans-serif;font-size:0.87rem;outline:none;transition:border-color 0.2s;}
.kf-inp:focus{border-color:var(--red);}
.kf-sel{width:100%;background:rgba(0,0,0,0.28);color:var(--txt);border:1px solid var(--bd2);padding:0.55rem 0.75rem;font-family:'Barlow',sans-serif;font-size:0.87rem;outline:none;cursor:pointer;}
.kf-sel:focus{border-color:var(--red);}

/* Cover */
.kf-cover-img{width:100%;height:106px;object-fit:cover;display:block;border:1px solid var(--bd);margin-bottom:0.6rem;}
.kf-cover-ph{width:100%;height:106px;background:var(--s2);border:1px dashed var(--bd2);display:flex;align-items:center;justify-content:center;margin-bottom:0.6rem;}
.kf-upload{display:flex;align-items:center;justify-content:center;gap:0.38rem;width:100%;font-family:'Barlow Condensed',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;background:rgba(255,255,255,0.04);border:1px solid var(--bd2);color:var(--t2);padding:0.52rem;cursor:pointer;transition:all 0.18s;}
.kf-upload:hover{border-color:rgba(255,255,255,0.2);color:var(--txt);}

/* Drag overlay */
.kf-drag-ghost{background:var(--s3);border:1px solid rgba(225,6,0,0.4);padding:0.6rem 1rem;font-family:'Barlow Condensed',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--t2);box-shadow:0 8px 32px rgba(0,0,0,0.7);}
`;

/* ── Block Types ── */
const BT = [
  {type:'paragraph',label:'ข้อความ',   icon:AlignLeft},
  {type:'h2',       label:'H2',         icon:Heading2},
  {type:'h3',       label:'H3',         icon:Heading3},
  {type:'quote',    label:'Quote',      icon:Quote},
  {type:'image',    label:'รูปภาพ',     icon:Img},
  {type:'divider',  label:'เส้นคั่น',  icon:Minus},
];
const nb = (type='paragraph') => ({id:crypto.randomUUID(),type,content:'',url:'',caption:''});

/* ── Sortable Block ── */
function SortableBlock({block, onUpdate, onDelete, onImgUpload}) {
  const {attributes,listeners,setNodeRef,transform,transition,isDragging} = useSortable({id:block.id});
  const taRef = useRef(null);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = taRef.current.scrollHeight + 'px';
    }
  }, [block.content]);

  const up = (p) => onUpdate(block.id, p);

  const content = () => {
    if (block.type === 'divider') return (
      <div className="kf-divider-row">
        <div className="kf-divider-l"/><span className="kf-divider-t">เส้นคั่น</span><div className="kf-divider-l"/>
      </div>
    );
    if (block.type === 'image') return (
      <div className="kf-img-blk">
        {block.url && <img src={block.url} alt="" className="kf-img-prev"/>}
        <input className="kf-img-url" placeholder="วาง URL รูปภาพ..." value={block.url} onChange={e=>up({url:e.target.value})}/>
        <label className="kf-img-up-row">
          <Img size={12} color="rgba(255,255,255,0.2)"/>
          <span className="kf-img-up-lbl">อัพโหลดไฟล์</span>
          <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>onImgUpload(block.id,e.target.files[0])}/>
        </label>
        <input className="kf-img-cap" placeholder="คำอธิบายรูป..." value={block.caption} onChange={e=>up({caption:e.target.value})}/>
      </div>
    );
    if (block.type === 'quote') return (
      <div className="kf-quote-w">
        <textarea ref={taRef} className="kf-ta kf-ta-q" placeholder="ข้อความเน้น..." rows={2} value={block.content} onChange={e=>up({content:e.target.value})}/>
      </div>
    );
    const cls = block.type==='h2'?'kf-ta-h2':block.type==='h3'?'kf-ta-h3':'';
    const ph  = block.type==='h2'?'หัวข้อใหญ่...':block.type==='h3'?'หัวข้อย่อย...':'เขียนข้อความที่นี่...';
    return <textarea ref={taRef} className={`kf-ta ${cls}`} placeholder={ph} rows={block.type==='paragraph'?3:1} value={block.content} onChange={e=>up({content:e.target.value})}/>;
  };

  return (
    <div ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?0.3:1}} className="kf-brow">
      <div className="kf-bhandle" {...attributes} {...listeners}><GripVertical size={13}/></div>
      <div className="kf-bbody">{content()}</div>
      <button className="kf-bdel" onClick={()=>onDelete(block.id)}><Trash2 size={12}/></button>
    </div>
  );
}

/* ── Main Form ── */
export default function KnowledgeForm() {
  const navigate = useNavigate();
  const {id}     = useParams();
  const isEdit   = !!id;

  const [meta, setMeta] = useState({title:'',slug:'',excerpt:'',cover_url:'',category_id:'',published:false});
  const [blocks,   setBlocks]   = useState([nb()]);
  const [cats,     setCats]     = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [uploading,setUploading]= useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor,{activationConstraint:{distance:6}}));

  useEffect(() => {
    supabase.from('knowledge_categories').select('*').order('sort_order').then(({data})=>setCats(data||[]));
    if (isEdit) load();
  }, [id]);

  const load = async () => {
    const {data} = await supabase.from('knowledge').select('*').eq('id',id).single();
    if (data) {
      setMeta({title:data.title,slug:data.slug,excerpt:data.excerpt||'',cover_url:data.cover_url||'',category_id:data.category_id||'',published:data.published});
      setBlocks(Array.isArray(data.content)&&data.content.length?data.content:[nb()]);
    }
  };

  const toSlug = t => t.toLowerCase().replace(/[^\w\u0E00-\u0E7F\s-]/g,'').replace(/\s+/g,'-').slice(0,80);
  const set    = (k,v) => setMeta(p=>({...p,[k]:v,...(k==='title'&&!isEdit?{slug:toSlug(v)}:{})}));

  const upload = async (file) => {
    if(!file)return null;
    const path=`knowledge/${Date.now()}.${file.name.split('.').pop()}`;
    const {error}=await supabase.storage.from('images').upload(path,file);
    if(error)return null;
    return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
  };

  const addBlock    = t => setBlocks(b=>[...b,nb(t)]);
  const updateBlock = (id,p) => setBlocks(b=>b.map(bl=>bl.id===id?{...bl,...p}:bl));
  const deleteBlock = id => setBlocks(b=>b.filter(bl=>bl.id!==id));

  const handleImgUpload = async (id,file) => {
    setUploading(true);
    const url=await upload(file);
    if(url)updateBlock(id,{url});
    setUploading(false);
  };

  const handleCover = async e => {
    const f=e.target.files[0]; if(!f)return;
    setUploading(true);
    const url=await upload(f);
    if(url)set('cover_url',url);
    setUploading(false);
  };

  const handleDragEnd = ({active,over}) => {
    setActiveId(null);
    if(!over||active.id===over.id)return;
    setBlocks(b=>{
      const oi=b.findIndex(bl=>bl.id===active.id);
      const ni=b.findIndex(bl=>bl.id===over.id);
      return arrayMove(b,oi,ni);
    });
  };

  const save = async (pub) => {
    if(!meta.title.trim())return alert('กรุณาใส่ชื่อบทความ');
    if(!meta.slug.trim()) return alert('กรุณาใส่ Slug');
    setSaving(true);
    const payload={...meta,published:pub??meta.published,content:blocks};
    try {
      const {error} = isEdit
        ? await supabase.from('knowledge').update(payload).eq('id',id)
        : await supabase.from('knowledge').insert([payload]);
      if(error)throw error;
      navigate('/admin/knowledge');
    } catch(e){ alert('ข้อผิดพลาด: '+e.message); }
    finally{ setSaving(false); }
  };

  const activeBlock = blocks.find(b=>b.id===activeId);

  return (
    <div className="kf">
      <style>{S}</style>
      <div className="kf-atm"/>
      <div className="kf-shell">

        {/* Header */}
        <header className="kf-hd">
          <button className="kf-back" onClick={()=>navigate('/admin/knowledge')}><ArrowLeft size={13}/>กลับ</button>
          <span className="kf-hd-label">{isEdit?<><em>แก้ไข</em> บทความ</>:<>เพิ่ม<em>บทความใหม่</em></>}</span>
          <div className="kf-acts">
            <button className="kf-btn kf-btn-ghost" onClick={()=>save(false)} disabled={saving}><EyeOff size={13}/> Draft</button>
            <button className="kf-btn kf-btn-red"   onClick={()=>save(true)}  disabled={saving}><Save size={13}/> {saving?'กำลังบันทึก...':'เผยแพร่'}</button>
          </div>
        </header>

        <div className="kf-layout">

          {/* Editor */}
          <div className="kf-ed">
            <input className="kf-art-title" placeholder="ชื่อบทความ..." value={meta.title} onChange={e=>set('title',e.target.value)}/>
            <textarea className="kf-art-excerpt" rows={2} placeholder="บทสรุปย่อ — แสดงใน card หน้า Knowledge..." value={meta.excerpt} onChange={e=>set('excerpt',e.target.value)}/>

            {/* Toolbar */}
            <div className="kf-toolbar">
              <span className="kf-toolbar-lbl">เพิ่ม Block</span>
              {BT.map(bt=>(
                <button key={bt.type} className="kf-tbb" onClick={()=>addBlock(bt.type)}>
                  <bt.icon size={11}/>{bt.label}
                </button>
              ))}
            </div>

            {/* DnD Blocks */}
            <DndContext sensors={sensors} collisionDetection={closestCenter}
              onDragStart={({active})=>setActiveId(active.id)} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b=>b.id)} strategy={verticalListSortingStrategy}>
                <div className="kf-blocks">
                  {blocks.map(bl=>(
                    <SortableBlock key={bl.id} block={bl}
                      onUpdate={updateBlock} onDelete={deleteBlock} onImgUpload={handleImgUpload}/>
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeBlock && (
                  <div className="kf-drag-ghost">
                    {BT.find(b=>b.type===activeBlock.type)?.label ?? activeBlock.type}
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Sidebar */}
          <div className="kf-sb">

            <div className="kf-panel">
              <div className="kf-panel-hd">สถานะ</div>
              <div className="kf-panel-bd">
                <button className={`kf-status ${meta.published?'pub':'draft'}`} onClick={()=>set('published',!meta.published)}>
                  {meta.published?<><Eye size={13}/>เผยแพร่แล้ว</>:<><EyeOff size={13}/>Draft</>}
                </button>
              </div>
            </div>

            <div className="kf-panel">
              <div className="kf-panel-hd">หมวดหมู่</div>
              <div className="kf-panel-bd">
                <select className="kf-sel" value={meta.category_id} onChange={e=>set('category_id',e.target.value)}>
                  <option value="">— เลือกหมวด —</option>
                  {cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="kf-panel">
              <div className="kf-panel-hd">URL Slug</div>
              <div className="kf-panel-bd">
                <input className="kf-inp" placeholder="url-slug" value={meta.slug} onChange={e=>set('slug',e.target.value)}/>
              </div>
            </div>

            <div className="kf-panel">
              <div className="kf-panel-hd">รูป Cover</div>
              <div className="kf-panel-bd">
                {meta.cover_url
                  ? <img src={meta.cover_url} alt="" className="kf-cover-img"/>
                  : <div className="kf-cover-ph"><Img size={22} color="rgba(255,255,255,0.09)"/></div>
                }
                <label className="kf-upload">
                  <Img size={12}/>{uploading?'กำลังอัพโหลด...':'อัพโหลดรูป'}
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={handleCover} disabled={uploading}/>
                </label>
                <input className="kf-inp" style={{marginTop:'0.5rem'}} placeholder="หรือวาง URL..." value={meta.cover_url} onChange={e=>set('cover_url',e.target.value)}/>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}