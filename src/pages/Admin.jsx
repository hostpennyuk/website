import { useEffect, useMemo, useState } from 'react';
import {
  getAdminSession,
  setAdminSession,
  clearAdminSession,
  getEnquiries,
  getTestimonials,
  setTestimonials,
  getPortfolio,
  setPortfolio,
  getEmails,
  addEmail,
  crmStatuses,
  projectCategories,
  getSubscribers,
  getSettings,
  setSettings,
  getSeo,
  setSeo,
  getFeatureFlags,
  setFeatureFlags,
  exportAll,
  importAll,
  getActivity,
  getMetrics,
  getUsers,
  setUsers,
  getEmailTemplates,
  setEmailTemplates,
  getSignatures,
  setSignatures,
  getEnquiriesAsync,
  updateEnquiryAsync,
  deleteEnquiryAsync,
} from '../store/content';
import Inbox from './Inbox';

// Admin credentials - configure via environment variables in production
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'profmendel@gmail.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Gig@50chin';

const Section = ({ title, children, actions }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {actions}
    </div>
    {children}
  </section>
);

const Pill = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
    {children}
  </span>
);

function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState(() => getEnquiries());
  const [csvUrl, setCsvUrl] = useState('');
  const [viewId, setViewId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ id: null, text: '' });

  // Refresh on mount
  useEffect(() => { (async ()=> setEnquiries(await getEnquiriesAsync()))(); }, []);

  const onUpdate = async (id, patch) => {
    await updateEnquiryAsync(id, { ...patch, updatedAt: new Date().toISOString() });
    setEnquiries(await getEnquiriesAsync());
  };

  const exportCsv = () => {
    const header = ['createdAt','fullName','email','company','projectType','budget','timeline','status','notes','assignee','dueDate','tags'];
    const rows = enquiries.map(e=>[
      e.createdAt,e.fullName,e.email,e.company,e.projectType,e.budget,e.timeline,e.status,(e.notes||'').replaceAll('\n',' '),e.assignee||'',e.dueDate||'',(e.tags||[]).join('|')
    ]);
    const csv = [header, ...rows].map(r=>r.map(x=>`"${(x??'').toString().replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);
  };

  return (
    <Section title="Enquiries" actions={<button onClick={exportCsv} className="px-3 py-2 border rounded-lg text-sm">Export CSV</button>}>
      {enquiries.length === 0 ? (
        <p className="text-gray-500">No enquiries yet. Submissions from the site form will appear here.</p>) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">When</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">Contact</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Project</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Budget</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Timeline</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {enquiries.map((e) => (
                <tr key={e.id} className="align-top">
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <div className="text-sm font-medium truncate max-w-[18rem]">{e.fullName}</div>
                    <div className="text-xs text-gray-600 truncate max-w-[18rem]">{e.email}</div>
                    {e.company && <div className="text-xs text-gray-500 truncate max-w-[18rem]">{e.company}</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm font-medium">{e.projectType}</div>
                    {e.tags && e.tags.length>0 && <div className="text-[11px] text-gray-500 truncate max-w-[16rem]">{e.tags.join(', ')}</div>}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">{e.budget}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">{e.timeline}</td>
                  <td className="px-3 py-3">
                    <select
                      value={e.status}
                      onChange={(ev) => onUpdate(e.id, { status: ev.target.value })}
                      className="px-2 py-1 border rounded-md text-sm"
                    >
                      {crmStatuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button onClick={()=>setViewId(e.id)} className="text-blue-600 hover:underline">View</button>
                      <button onClick={()=>setConfirmDelete({ id: e.id, text: '' })} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {csvUrl && <a href={csvUrl} download={`enquiries-${Date.now()}.csv`} className="inline-block mt-3 text-sm text-blue-600 underline">Download CSV</a>}
        </div>
      )}

      {/* View Modal */}
      {viewId && (() => {
        const e = enquiries.find(x=>x.id===viewId);
        if (!e) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={()=>setViewId(null)} />
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 m-3 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Enquiry Details</h4>
                <button onClick={()=>setViewId(null)} className="text-gray-600 hover:text-gray-900">Close</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><div className="text-gray-500">When</div><div className="font-medium">{new Date(e.createdAt).toLocaleString()}</div></div>
                <div><div className="text-gray-500">Status</div><div className="font-medium">{e.status}</div></div>
                <div><div className="text-gray-500">Name</div><div className="font-medium">{e.fullName}</div></div>
                <div><div className="text-gray-500">Email</div><div className="font-medium break-all">{e.email}</div></div>
                {e.company && <div className="md:col-span-2"><div className="text-gray-500">Company</div><div className="font-medium">{e.company}</div></div>}
                <div><div className="text-gray-500">Project Type</div><div className="font-medium">{e.projectType}</div></div>
                <div><div className="text-gray-500">Budget</div><div className="font-medium">{e.budget}</div></div>
                <div><div className="text-gray-500">Timeline</div><div className="font-medium">{e.timeline}</div></div>
                <div>
                  <div className="text-gray-500">Assignee</div>
                  <input className="mt-1 w-full border rounded px-2 py-1" defaultValue={e.assignee||''} onBlur={(ev)=>onUpdate(e.id,{assignee:ev.target.value})} />
                </div>
                <div>
                  <div className="text-gray-500">Due date</div>
                  <input className="mt-1 w-full border rounded px-2 py-1" type="date" defaultValue={e.dueDate||''} onBlur={(ev)=>onUpdate(e.id,{dueDate:ev.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <div className="text-gray-500">Tags</div>
                  <input className="mt-1 w-full border rounded px-2 py-1" placeholder="tags e.g. B2B|UK" defaultValue={(e.tags||[]).join('|')} onBlur={(ev)=>onUpdate(e.id,{tags: ev.target.value? ev.target.value.split('|').map(s=>s.trim()):[]})} />
                </div>
                <div className="md:col-span-2"><div className="text-gray-500">Project Description</div><div className="whitespace-pre-wrap mt-1">{e.idea}</div></div>
                <div className="md:col-span-2">
                  <div className="text-gray-500">Internal Notes</div>
                  <textarea className="mt-1 w-full h-24 border rounded px-2 py-2" defaultValue={e.notes||''} onBlur={(ev)=>onUpdate(e.id,{notes:ev.target.value})} />
                </div>
                <div className="flex items-center gap-2">
                  <input id={`spam-${e.id}`} type="checkbox" defaultChecked={!!e.spam} onChange={(ev)=>onUpdate(e.id,{spam:ev.target.checked})} />
                  <label htmlFor={`spam-${e.id}`} className="text-gray-700">Mark as spam</label>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirm Modal */}
      {confirmDelete.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setConfirmDelete({ id:null, text:'' })} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 m-3 max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-2">Confirm deletion</h4>
            <p className="text-sm text-gray-600 mb-4">To proceed, enter the deleting phrase to confirm this action.</p>
            <input
              autoFocus
              className="w-full border rounded px-3 py-2"
              value={confirmDelete.text}
              onChange={(e)=>setConfirmDelete({...confirmDelete, text: e.target.value})}
              placeholder="Type the deleting phrase"
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={()=>setConfirmDelete({ id:null, text:'' })} className="px-3 py-2 border rounded-lg text-sm">Cancel</button>
              <button
                onClick={async ()=>{
                  if (confirmDelete.text === 'delete-this-enquiry') {
                    await deleteEnquiryAsync(confirmDelete.id);
                    setConfirmDelete({ id:null, text:'' });
                    setEnquiries(await getEnquiriesAsync());
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm text-white ${confirmDelete.text==='delete-this-enquiry' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

function TestimonialsTab() {
  const [items, setItems] = useState(() => getTestimonials());

  const add = () => {
    const id = `${Date.now()}`;
    setItems((prev) => {
      const next = [...prev, { id, name: '', position: '', image: '', quote: '' }];
      setTestimonials(next);
      return next;
    });
  };
  const update = (id, patch) => {
    const next = items.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setItems(next);
    setTestimonials(next);
  };
  const remove = (id) => {
    const next = items.filter((t) => t.id !== id);
    setItems(next);
    setTestimonials(next);
  };

  return (
    <Section title="Testimonials" actions={<button onClick={add} className="btn-primary px-3 py-2 rounded-lg text-white">Add</button>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="p-4 border rounded-xl">
            <div className="flex gap-4">
              <img src={t.image || 'https://placehold.co/96x96?text=Avatar'} alt="avatar" className="w-24 h-24 rounded-lg object-cover border" />
              <div className="flex-1 space-y-2">
                <input className="w-full border rounded px-3 py-2" placeholder="Name" value={t.name} onChange={(e)=>update(t.id,{name:e.target.value})} />
                <input className="w-full border rounded px-3 py-2" placeholder="Position" value={t.position} onChange={(e)=>update(t.id,{position:e.target.value})} />
                <input className="w-full border rounded px-3 py-2" placeholder="Image URL" value={t.image} onChange={(e)=>update(t.id,{image:e.target.value})} />
              </div>
            </div>
            <textarea className="mt-3 w-full border rounded px-3 py-2" rows={3} placeholder="Quote" value={t.quote} onChange={(e)=>update(t.id,{quote:e.target.value})} />
            <label className="mt-2 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={t.published!==false} onChange={(e)=>update(t.id,{published:e.target.checked})} />
              Published
            </label>
            <div className="mt-3 text-right">
              <button onClick={()=>remove(t.id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function PortfolioTab() {
  const [items, setItems] = useState(() => getPortfolio());

  const add = () => {
    const id = `${Date.now()}`;
    const item = { id, title: '', category: projectCategories[0], image: '', description: '', featured: false, published: true };
    const next = [...items, item];
    setItems(next);
    setPortfolio(next);
  };
  const update = (id, patch) => {
    const next = items.map((p) => (p.id === id ? { ...p, ...patch } : p));
    setItems(next);
    setPortfolio(next);
  };
  const remove = (id) => {
    const next = items.filter((p) => p.id !== id);
    setItems(next);
    setPortfolio(next);
  };

  return (
    <Section title="Portfolio" actions={<button onClick={add} className="btn-primary px-3 py-2 rounded-lg text-white">Add</button>}>
      <div className="space-y-4">
        {items.map((p) => (
          <div key={p.id} className="p-4 border rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-start">
              <div className="md:col-span-2">
                <img src={p.image || 'https://placehold.co/480x270?text=Project'} alt="project" className="w-full aspect-video object-cover rounded-lg border" />
                <input className="mt-2 w-full border rounded px-3 py-2" placeholder="Image URL" value={p.image} onChange={(e)=>update(p.id,{image:e.target.value})} />
              </div>
              <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="w-full border rounded px-3 py-2" placeholder="Title" value={p.title} onChange={(e)=>update(p.id,{title:e.target.value})} />
                <select className="w-full border rounded px-3 py-2" value={p.category} onChange={(e)=>update(p.id,{category:e.target.value})}>
                  {projectCategories.map((c)=> <option key={c} value={c}>{c}</option>)}
                </select>
                <textarea className="md:col-span-2 w-full border rounded px-3 py-2" rows={3} placeholder="Description" value={p.description} onChange={(e)=>update(p.id,{description:e.target.value})} />
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!p.featured} onChange={(e)=>update(p.id,{featured:e.target.checked})} />
                  Featured
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={p.published!==false} onChange={(e)=>update(p.id,{published:e.target.checked})} />
                  Published
                </label>
                <div className="text-right md:col-span-2">
                  <button onClick={()=>remove(p.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function EmailsTab() {
  const [outbox, setOutbox] = useState(() => getEmails());
  const [form, setForm] = useState({ to: '', subject: '', preheader: '', ctaLabel: '', ctaUrl: '', body: '' });
  const [templates, setTemplates] = useState(() => getEmailTemplates());
  const [tplSel, setTplSel] = useState('');
  const [sigSel, setSigSel] = useState('');
  const [styleSel, setStyleSel] = useState('template1');
  const signatures = getSignatures();
  const settings = getSettings();

  const send = () => {
    if (!form.to || !form.subject) return;
    const html = renderHtml(
      form.body,
      styleSel,
      settings.logoUrl,
      signatures.find(s=>s.id===sigSel) || signatures[0],
      form.subject,
      form.preheader,
      form.ctaLabel,
      form.ctaUrl
    );
    const email = { id: `${Date.now()}`, ...form, html, template: tplSel, templateStyle: styleSel, signature: sigSel, sentAt: new Date().toISOString() };
    addEmail(email);
    setOutbox(getEmails());
    setForm({ to: '', subject: '', preheader: '', ctaLabel: '', ctaUrl: '', body: '' });
  };

  const applyTemplate = (id) => {
    setTplSel(id);
    const tpl = templates.find(t=>t.id===id);
    if (!tpl) return;
    setForm((f)=>({ ...f, subject: tpl.subject || f.subject, body: tpl.body || f.body }));
    // Auto-map template id to style if matches tpl1..tpl4
    if (/tpl[1-4]/.test(tpl.id)) {
      const n = tpl.id.replace('tpl','');
      setStyleSel(`template${n}`);
    }
  };

  function renderHtml(body, style, logoUrl, signature, subject = '', preheader = '', ctaLabel = '', ctaUrl = '') {
    const safe = (s) => (s || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const safeBody = (body || '').replace(/\n/g, '<br/>');
    const sigBlock = signature ? `
      <div style="margin-top:24px; color:#555;">
        <div>${safe(signature.signature)}</div>
        <div style="font-weight:600; margin-top:6px;">${safe(signature.fullName)}</div>
        <div style="font-size:12px; color:#777;">${safe(signature.designation)}</div>
      </div>` : '';
    const button = (accentHex) => (!ctaLabel || !ctaUrl) ? '' : `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:24px auto 0 auto;">
        <tr>
          <td align="center">
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${ctaUrl}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="10%" stroke="f" fillcolor="${accentHex}">
              <w:anchorlock/>
              <center style="color:#ffffff;font-family:Arial, sans-serif;font-size:16px;font-weight:bold;">${safe(ctaLabel)}</center>
            </v:roundrect>
            <![endif]-->
            <!--[if !mso]><!-- -->
            <a href="${ctaUrl}" style="background-color:${accentHex}; color:#ffffff; padding:14px 24px; border-radius:8px; display:inline-block; text-decoration:none; font-weight:600;">
              ${safe(ctaLabel)}
            </a>
            <!--<![endif]-->
          </td>
        </tr>
      </table>`;
    const base = (accent, bg, accentSolid) => `
      <!doctype html>
      <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta http-equiv="x-ua-compatible" content="ie=edge"/>
        <title>${safe(subject)}</title>
        <style>
          /* Prevent auto-scaling in iOS */
          body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; border:0; outline:none; text-decoration:none; }
          table { border-collapse: collapse !important; }
          body { margin:0; padding:0; width:100% !important; height:100% !important; }
          a { text-decoration: none; }
        </style>
      </head>
      <body style="margin:0; padding:0; background:${bg};">
        <!-- Preheader (hidden) -->
        <div style="display:none; font-size:1px; color:#fff; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
          ${safe(preheader || subject || ' ')}
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="padding:24px 0; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
                <tr>
                  <td align="center" style="background:${accent}; padding:20px;">
                    <img src="${logoUrl || '/logo.gif'}" alt="Logo" style="height:40px; display:block;"/>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px; color:#111; font-size:16px; line-height:1.6;">
                    ${safeBody}
                    ${button(accentSolid)}
                    ${sigBlock}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:16px; color:#888; font-size:12px; background:#fafafa;">© ${new Date().getFullYear()} HostPenny</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
    switch(style){
      case 'template1': return base('#4c1d95','#f3e8ff', '#4c1d95');
      case 'template2': return base('#f97316','#fff7ed', '#f97316');
      case 'template3': return base('linear-gradient(90deg,#4c1d95,#f43f5e)','#fff1f2', '#7c3aed');
      case 'template4': return base('#111827','#e5e7eb', '#111827');
      default: return base('#4c1d95','#f3e8ff', '#4c1d95');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Section title="Compose">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="sm:col-span-1 flex items-center gap-2">
              <label className="text-sm text-gray-600">Template:</label>
              <select value={tplSel} onChange={(e)=>applyTemplate(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="">None</option>
                {templates.map(t=> <option key={t.id} value={t.id}>{t.name||'Untitled'}</option>)}
              </select>
            </div>
            <div className="sm:col-span-1 flex items-center gap-2">
              <label className="text-sm text-gray-600">Style:</label>
              <select value={styleSel} onChange={(e)=>setStyleSel(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="template1">Template 1</option>
                <option value="template2">Template 2</option>
                <option value="template3">Template 3</option>
                <option value="template4">Template 4</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex items-center gap-2">
              <label className="text-sm text-gray-600">Signature:</label>
              <select value={sigSel} onChange={(e)=>setSigSel(e.target.value)} className="border rounded px-2 py-1 text-sm">
                {signatures.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          {templates.length > 0 && (
            <div className="hidden" />
          )}
          <input className="w-full border rounded px-3 py-2" placeholder="To (email)" value={form.to} onChange={(e)=>setForm({...form, to: e.target.value})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Subject" value={form.subject} onChange={(e)=>setForm({...form, subject: e.target.value})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Preheader (shows in inbox preview)" value={form.preheader} onChange={(e)=>setForm({...form, preheader: e.target.value})} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="w-full border rounded px-3 py-2" placeholder="CTA Label (optional)" value={form.ctaLabel} onChange={(e)=>setForm({...form, ctaLabel: e.target.value})} />
            <input className="w-full border rounded px-3 py-2" placeholder="CTA URL (https://...) (optional)" value={form.ctaUrl} onChange={(e)=>setForm({...form, ctaUrl: e.target.value})} />
          </div>
          <textarea className="w-full border rounded px-3 py-2" rows={8} placeholder="Message" value={form.body} onChange={(e)=>setForm({...form, body: e.target.value})} />
          <div className="text-right">
            <button onClick={send} className="btn-primary px-4 py-2 rounded-lg text-white">Send</button>
          </div>
        </div>
      </Section>
      <Section title="Preview">
        <div className="border rounded-xl overflow-hidden">
          <iframe title="preview" className="w-full h-[420px]" srcDoc={renderHtml(form.body, styleSel, settings.logoUrl, signatures.find(s=>s.id===sigSel) || signatures[0], form.subject, form.preheader, form.ctaLabel, form.ctaUrl)} />
        </div>
      </Section>
      <Section title="Outbox" >
        {outbox.length === 0 ? (
          <p className="text-gray-500">No emails sent yet.</p>
        ) : (
          <ul className="space-y-3">
            {outbox.map((m) => (
              <li key={m.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{m.subject}</div>
                    <div className="text-xs text-gray-600">To: {m.to}</div>
                  </div>
                  <div className="text-xs text-gray-500">{new Date(m.sentAt).toLocaleString()}</div>
                </div>
                {m.html ? (
                  <details className="mt-2">
                    <summary className="text-sm text-blue-600 cursor-pointer">View HTML</summary>
                    <iframe title={`sent-${m.id}`} className="w-full h-[360px] mt-2 border rounded" srcDoc={m.html} />
                  </details>
                ) : (m.body && <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{m.body}</p>)}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function TemplatesTab() {
  const [items, setItems] = useState(() => getEmailTemplates());
  const add = () => {
    const next = [{ id: `${Date.now()}`, name: '', subject: '', body: '' }, ...items];
    setItems(next); setEmailTemplates(next);
  };
  const update = (id, patch) => {
    const next = items.map(i => i.id===id?{...i,...patch}:i);
    setItems(next); setEmailTemplates(next);
  };
  const remove = (id) => {
    const next = items.filter(i=>i.id!==id);
    setItems(next); setEmailTemplates(next);
  };
  return (
    <Section title="Email Templates" actions={<button onClick={add} className="btn-primary px-3 py-2 rounded-lg text-white">Add</button>}>
      <div className="space-y-4">
        {items.map(t => (
          <div key={t.id} className="p-4 border rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border rounded px-3 py-2" placeholder="Name" value={t.name} onChange={(e)=>update(t.id,{name:e.target.value})} />
              <input className="border rounded px-3 py-2" placeholder="Subject" value={t.subject} onChange={(e)=>update(t.id,{subject:e.target.value})} />
              <textarea className="md:col-span-2 border rounded px-3 py-2" rows={5} placeholder="Body" value={t.body} onChange={(e)=>update(t.id,{body:e.target.value})} />
              <div className="md:col-span-2 text-right"><button onClick={()=>remove(t.id)} className="text-red-600 text-sm underline">Delete</button></div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SettingsTab() {
  const [settings, setLocSettings] = useState(() => getSettings());
  const [flags, setLocFlags] = useState(() => getFeatureFlags());
  const save = () => { setSettings(settings); setFeatureFlags(flags); };
  const onHeroChange = (i, val) => setLocSettings({ ...settings, hero: settings.hero.map((h,idx)=> idx===i?val:h) });
  return (
    <Section title="Settings" actions={<button onClick={save} className="btn-primary px-3 py-2 rounded-lg text-white">Save</button>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold">Hero</h4>
          <input className="w-full border rounded px-3 py-2" value={settings.hero[0]} onChange={(e)=>onHeroChange(0,e.target.value)} />
          <input className="w-full border rounded px-3 py-2" value={settings.hero[1]} onChange={(e)=>onHeroChange(1,e.target.value)} />
          <input className="w-full border rounded px-3 py-2" value={settings.hero[2]} onChange={(e)=>onHeroChange(2,e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Microcopy" value={settings.heroMicrocopy} onChange={(e)=>setLocSettings({...settings, heroMicrocopy:e.target.value})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Primary CTA" value={settings.primaryCtaLabel} onChange={(e)=>setLocSettings({...settings, primaryCtaLabel:e.target.value})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Sticky CTA" value={settings.stickyCtaLabel} onChange={(e)=>setLocSettings({...settings, stickyCtaLabel:e.target.value})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Form Endpoint (optional)" value={settings.formEndpoint||''} onChange={(e)=>setLocSettings({...settings, formEndpoint:e.target.value})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Subscribe Endpoint (optional)" value={settings.subscribeEndpoint||''} onChange={(e)=>setLocSettings({...settings, subscribeEndpoint:e.target.value})} />
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Video</h4>
          <input className="w-full border rounded px-3 py-2" placeholder="YouTube ID" value={settings.video.youtubeId} onChange={(e)=>setLocSettings({...settings, video:{...settings.video, youtubeId:e.target.value}})} />
          <input className="w-full border rounded px-3 py-2" type="number" placeholder="Start Seconds" value={settings.video.startSeconds} onChange={(e)=>setLocSettings({...settings, video:{...settings.video, startSeconds: Number(e.target.value)||0}})} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={flags.enableVideoModal} onChange={(e)=>setLocFlags({...flags, enableVideoModal:e.target.checked})}/> Enable Video Modal</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={flags.enableStickyCta} onChange={(e)=>setLocFlags({...flags, enableStickyCta:e.target.checked})}/> Enable Sticky CTA</label>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Footer</h4>
          <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={settings.footer.phone} onChange={(e)=>setLocSettings({...settings, footer:{...settings.footer, phone:e.target.value}})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Email" value={settings.footer.email} onChange={(e)=>setLocSettings({...settings, footer:{...settings.footer, email:e.target.value}})} />
          <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="Address" value={settings.footer.address} onChange={(e)=>setLocSettings({...settings, footer:{...settings.footer, address:e.target.value}})} />
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Social & Integrations</h4>
          <input className="w-full border rounded px-3 py-2" placeholder="Facebook" value={settings.social.facebook} onChange={(e)=>setLocSettings({...settings, social:{...settings.social, facebook:e.target.value}})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Twitter" value={settings.social.twitter} onChange={(e)=>setLocSettings({...settings, social:{...settings.social, twitter:e.target.value}})} />
          <input className="w-full border rounded px-3 py-2" placeholder="LinkedIn" value={settings.social.linkedin} onChange={(e)=>setLocSettings({...settings, social:{...settings.social, linkedin:e.target.value}})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Instagram" value={settings.social.instagram} onChange={(e)=>setLocSettings({...settings, social:{...settings.social, instagram:e.target.value}})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Calendly URL" value={settings.calendlyUrl} onChange={(e)=>setLocSettings({...settings, calendlyUrl:e.target.value})} />
          <input className="w-full border rounded px-3 py-2" placeholder="Slack Webhook URL" value={settings.slackWebhookUrl} onChange={(e)=>setLocSettings({...settings, slackWebhookUrl:e.target.value})} />
        </div>
      </div>
    </Section>
  );
}

function SeoTab() {
  const [map, setMap] = useState(() => getSeo());
  const save = () => setSeo(map);
  const paths = Object.keys(map);
  const update = (p, field, val) => setMap({ ...map, [p]: { ...map[p], [field]: val } });
  return (
    <Section title="SEO" actions={<button onClick={save} className="btn-primary px-3 py-2 rounded-lg text-white">Save</button>}>
      <div className="space-y-6">
        {paths.map((p)=> (
          <div key={p} className="p-4 border rounded-xl">
            <div className="text-sm text-gray-600 mb-2">{p}</div>
            <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Title" value={map[p].title||''} onChange={(e)=>update(p,'title',e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2" rows={2} placeholder="Description" value={map[p].description||''} onChange={(e)=>update(p,'description',e.target.value)} />
          </div>
        ))}
      </div>
    </Section>
  );
}

function SubscribersTab() {
  const subs = getSubscribers();
  return (
    <Section title={`Subscribers (${subs.length})`}>
      {subs.length===0 ? (<p className="text-gray-500">No subscribers yet.</p>) : (
        <table className="min-w-full">
          <thead><tr><th className="text-left text-xs uppercase text-gray-500 py-2">Email</th><th className="text-left text-xs uppercase text-gray-500">Subscribed</th></tr></thead>
          <tbody>
            {subs.map(s=> (
              <tr key={s.id} className="border-t"><td className="py-2 pr-4">{s.email}</td><td className="py-2 text-sm text-gray-600">{new Date(s.subscribedAt).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </Section>
  );
}

function ActivityTab() {
  const items = getActivity();
  return (
    <Section title="Activity">
      {items.length===0 ? (<p className="text-gray-500">No recent activity.</p>) : (
        <ul className="divide-y">
          {items.map(i=> (
            <li key={i.id} className="py-2 text-sm"><span className="text-gray-500">{new Date(i.at).toLocaleString()}</span> — <span className="font-mono">{i.action}</span></li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function UsersTab() {
  const [users, setLocUsers] = useState(()=> getUsers());
  const add = () => { const next=[...users,{id:`${Date.now()}`,email:'',role:'Editor'}]; setLocUsers(next); setUsers(next); };
  const update=(id,patch)=>{ const next=users.map(u=>u.id===id?{...u,...patch}:u); setLocUsers(next); setUsers(next); };
  const remove=(id)=>{ const next=users.filter(u=>u.id!==id); setLocUsers(next); setUsers(next); };
  return (
    <Section title="Users" actions={<button onClick={add} className="btn-primary px-3 py-2 rounded-lg text-white">Add</button>}>
      <div className="space-y-3">
        {users.map(u=> (
          <div key={u.id} className="p-4 border rounded-xl flex gap-3 items-center">
            <input className="border rounded px-3 py-2 flex-1" placeholder="Email" value={u.email} onChange={(e)=>update(u.id,{email:e.target.value})} />
            <select className="border rounded px-2 py-2" value={u.role} onChange={(e)=>update(u.id,{role:e.target.value})}>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
            <button onClick={()=>remove(u.id)} className="text-red-600 text-sm underline">Remove</button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">Note: Local users are not enforced for login yet; primary admin credential remains required.</p>
    </Section>
  );
}

function BackupTab() {
  const doExport = () => {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `hostpenny-backup-${Date.now()}.json`; a.click();
  };
  const onImport = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { importAll(JSON.parse(reader.result)); alert('Imported. Reload the page.'); } catch { alert('Invalid backup file'); }
    };
    reader.readAsText(f);
  };
  return (
    <Section title="Backup & Restore">
      <div className="flex items-center gap-3">
        <button onClick={doExport} className="btn-primary px-4 py-2 rounded-lg text-white">Export Backup</button>
        <label className="px-4 py-2 border rounded-lg cursor-pointer">Import Backup<input type="file" accept="application/json" className="hidden" onChange={onImport}/></label>
      </div>
    </Section>
  );
}

function DashboardTab() {
  const m = getMetrics();
  const enquiries = getEnquiries();
  const byStatus = crmStatuses.map(s=> ({ s, count: enquiries.filter(e=>e.status===s).length }));
  const today = new Date(); today.setHours(0,0,0,0);
  const todayCount = enquiries.filter(e=> new Date(e.createdAt) >= today).length;
  const weekAgo = new Date(Date.now()-7*24*3600*1000);
  const weekCount = enquiries.filter(e=> new Date(e.createdAt) >= weekAgo).length;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Section title="At a glance">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><div className="text-3xl font-bold">{todayCount}</div><div className="text-sm text-gray-600">Enquiries today</div></div>
          <div><div className="text-3xl font-bold">{weekCount}</div><div className="text-sm text-gray-600">Last 7 days</div></div>
          <div><div className="text-3xl font-bold">{m.video_open||0}</div><div className="text-sm text-gray-600">Video plays</div></div>
        </div>
      </Section>
      <Section title="Pipeline">
        <ul className="space-y-1">
          {byStatus.map(x=> (<li key={x.s} className="flex justify-between text-sm"><span>{x.s}</span><span className="font-semibold">{x.count}</span></li>))}
        </ul>
      </Section>
      <Section title="Needs attention">
        <ul className="space-y-2 text-sm">
          {enquiries.filter(e=> e.status==='New' || (e.dueDate && new Date(e.dueDate)<new Date())).slice(0,5).map(e=> (
            <li key={e.id} className="flex justify-between"><span>{e.fullName} — {e.projectType}</span><span className="text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</span></li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function SignaturesTab() {
  const [items, setItems] = useState(() => getSignatures());
  const add = () => { const next=[{id:`${Date.now()}`,name:'New Signature',fullName:'Your Name',designation:'Role',signature:'Best regards,'},...items]; setItems(next); setSignatures(next); };
  const update = (id, patch) => { const next=items.map(s=>s.id===id?{...s,...patch}:s); setItems(next); setSignatures(next); };
  const remove = (id) => { const next=items.filter(s=>s.id!==id); setItems(next); setSignatures(next); };
  return (
    <Section title="Signatures" actions={<button onClick={add} className="btn-primary px-3 py-2 rounded-lg text-white">Add</button>}>
      <div className="space-y-4">
        {items.map(s=> (
          <div key={s.id} className="p-4 border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <input className="border rounded px-3 py-2" placeholder="Signature Name" value={s.name} onChange={(e)=>update(s.id,{name:e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Full Name" value={s.fullName} onChange={(e)=>update(s.id,{fullName:e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Designation" value={s.designation} onChange={(e)=>update(s.id,{designation:e.target.value})} />
            <input className="md:col-span-2 border rounded px-3 py-2" placeholder="Closing (e.g., Best regards,)" value={s.signature} onChange={(e)=>update(s.id,{signature:e.target.value})} />
            <div className="text-right md:col-span-1"><button onClick={()=>remove(s.id)} className="text-red-600 text-sm underline">Delete</button></div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function Admin() {
  const [session, setSession] = useState(() => getAdminSession());
  const [tab, setTab] = useState('dashboard');
  const [login, setLogin] = useState({ email: '', password: '' });
  const loggedIn = !!session;

  const doLogin = (e) => {
    e.preventDefault();
    if (login.email === ADMIN_EMAIL && login.password === ADMIN_PASSWORD) {
      const s = { email: login.email, loggedInAt: new Date().toISOString() };
      setAdminSession(s);
      setSession(s);
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    clearAdminSession();
    setSession(null);
  };

  if (!loggedIn) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white border rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
            <form onSubmit={doLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" value={login.email} onChange={(e)=>setLogin({...login, email:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={login.password} onChange={(e)=>setLogin({...login, password:e.target.value})} />
              </div>
              <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo and title only */}
      <div className="border-b bg-[#4c1d95] text-white">
        <div className="container-custom py-4 flex items-center gap-3">
          <img src="/logo.gif" alt="Logo" className="h-16 w-auto" />
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 bg-white border rounded-xl p-3 h-[calc(100vh-11rem)] sticky top-24 overflow-auto">
            <nav className="space-y-1">
              {[
                { key:'dashboard', label:'Overview' },
                { key:'enquiries', label:'Enquiries' },
                { key:'inbox', label:'Inbox' },
                { key:'testimonials', label:'Testimonials' },
                { key:'portfolio', label:'Portfolio' },
                { key:'emails', label:'Emails' },
                { key:'templates', label:'Templates' },
                { key:'signatures', label:'Signatures' },
                { key:'settings', label:'Settings' },
                { key:'seo', label:'SEO' },
                { key:'subscribers', label:'Subscribers' },
                { key:'activity', label:'Activity' },
                { key:'users', label:'Users' },
                { key:'backup', label:'Backup' },
              ].map((item)=> (
                <button
                  key={item.key}
                  onClick={()=>setTab(item.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${tab===item.key ? 'bg-purple-600 text-white border-purple-600' : 'bg-white hover:bg-gray-50'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t">
              <button onClick={logout} className="w-full px-3 py-2 rounded-lg border text-sm">Logout</button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 space-y-6">
            {tab === 'dashboard' && <DashboardTab />}
            {tab === 'enquiries' && <EnquiriesTab />}
            {tab === 'inbox' && <Inbox />}
            {tab === 'testimonials' && <TestimonialsTab />}
            {tab === 'portfolio' && <PortfolioTab />}
            {tab === 'emails' && <EmailsTab />}
            {tab === 'templates' && <TemplatesTab />}
            {tab === 'signatures' && <SignaturesTab />}
            {tab === 'settings' && <SettingsTab />}
            {tab === 'seo' && <SeoTab />}
            {tab === 'subscribers' && <SubscribersTab />}
            {tab === 'activity' && <ActivityTab />}
            {tab === 'users' && <UsersTab />}
            {tab === 'backup' && <BackupTab />}
          </main>
        </div>
      </div>
    </div>
  );
}
