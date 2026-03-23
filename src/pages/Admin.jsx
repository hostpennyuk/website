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
  getTeamMembers,
  teamRoles,
  getEmailTemplates,
  setEmailTemplates,
  getSignatures,
  setSignatures,
  getEnquiriesAsync,
  updateEnquiryAsync,
  deleteEnquiryAsync,
} from '../store/content';
import Inbox from './Inbox';
import { 
  HiOutlineHome, HiOutlineMail, HiOutlineInbox, HiOutlineChatAlt2, 
  HiOutlineCollection, HiOutlineTemplate, HiOutlinePencilAlt,
  HiOutlineCog, HiOutlineSearch, HiOutlineUsers, HiOutlineChartBar,
  HiOutlineUserGroup, HiOutlineCloudDownload, HiOutlineLogout,
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX,
  HiOutlineCheck, HiOutlineEye, HiOutlineEyeOff, HiOutlineRefresh,
  HiOutlineDocumentText, HiOutlineSave, HiOutlineExternalLink,
  HiOutlineTrendingUp, HiOutlineCalendar, HiOutlineLightBulb,
  HiOutlineBadgeCheck, HiOutlineClipboardList, HiOutlineSparkles
} from 'react-icons/hi';

// Admin credentials - configure via environment variables in production
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'profmendel@gmail.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Gig@50chin';

const Section = ({ title, children, actions, icon: Icon }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-purple-600" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {actions}
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
    success: 'bg-green-50 hover:bg-green-100 text-green-600 border border-green-200',
    ghost: 'hover:bg-gray-100 text-gray-600',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button 
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all ${variants[variant]} ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

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
        const teamMembers = getTeamMembers();
        const currentAssignees = e.assignees || (e.assignee ? [e.assignee] : []);
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={()=>setViewId(null)} />
            <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 m-3 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Enquiry Details</h4>
                  <p className="text-sm text-gray-500 mt-1">Submitted {new Date(e.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={()=>setViewId(null)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              {/* Contact Info Card */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">Contact</div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">{e.fullName}</div>
                    <a href={`mailto:${e.email}`} className="text-sm text-purple-600 hover:underline">{e.email}</a>
                    {e.phone && <div className="text-sm text-gray-600 mt-1">{e.countryCode || ''} {e.phone}</div>}
                  </div>
                  {e.company && (
                    <div>
                      <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">Company</div>
                      <div className="text-lg font-semibold text-gray-900 mt-1">{e.company}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">Status</div>
                    <select
                      value={e.status}
                      onChange={(ev) => onUpdate(e.id, { status: ev.target.value })}
                      className="mt-1 px-3 py-2 border-2 border-purple-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      {crmStatuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Project Type</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">{e.projectType}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Budget</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">{e.budget}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Timeline</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">{e.timeline}</div>
                </div>
              </div>
              
              {/* Project Description */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Project Description</div>
                <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-gray-700">{e.idea}</div>
              </div>
              
              {/* Assignment Section */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <HiOutlineUsers className="w-4 h-4" /> Assign Team Members
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {teamMembers.map(member => {
                    const isAssigned = currentAssignees.includes(member.id);
                    return (
                      <button
                        key={member.id}
                        onClick={() => {
                          const newAssignees = isAssigned 
                            ? currentAssignees.filter(a => a !== member.id)
                            : [...currentAssignees, member.id];
                          onUpdate(e.id, { assignees: newAssignees, assignee: newAssignees[0] || '' });
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                          isAssigned 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {(member.name || member.email || '?')[0].toUpperCase()}
                        </span>
                        <span>{member.name || member.email}</span>
                        <span className="text-xs opacity-70">({member.jobTitle || 'Team'})</span>
                        {isAssigned && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
                {currentAssignees.length === 0 && (
                  <p className="text-sm text-blue-600">Click on team members above to assign them to this project</p>
                )}
              </div>
              
              {/* Management Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input 
                    className="w-full border-2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                    type="date" 
                    defaultValue={e.dueDate||''} 
                    onBlur={(ev)=>onUpdate(e.id,{dueDate:ev.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input 
                    className="w-full border-2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                    placeholder="e.g. B2B | UK | Priority" 
                    defaultValue={(e.tags||[]).join(' | ')} 
                    onBlur={(ev)=>onUpdate(e.id,{tags: ev.target.value? ev.target.value.split('|').map(s=>s.trim()):[]})} 
                  />
                </div>
              </div>
              
              {/* Internal Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
                <textarea 
                  className="w-full h-24 border-2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Add notes about this project..."
                  defaultValue={e.notes||''} 
                  onBlur={(ev)=>onUpdate(e.id,{notes:ev.target.value})} 
                />
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input 
                    type="checkbox" 
                    defaultChecked={!!e.spam} 
                    onChange={(ev)=>onUpdate(e.id,{spam:ev.target.checked})} 
                    className="w-4 h-4 rounded text-red-500"
                  />
                  <span className="text-sm">Mark as spam</span>
                </label>
                <button 
                  onClick={()=>setViewId(null)} 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
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

  const [sending, setSending] = useState(false);
  const [fromEmail, setFromEmail] = useState('hello@hostpenny.co.uk');

  const availableFromEmails = [
    'hello@hostpenny.co.uk',
    'support@hostpenny.co.uk',
    'admin@hostpenny.co.uk',
    'info@hostpenny.co.uk',
    'sales@hostpenny.co.uk',
    'contact@hostpenny.co.uk',
    'notifications@hostpenny.co.uk',
  ];

  const send = async () => {
    if (!form.to || !form.subject) {
      alert('Please fill in recipient email and subject');
      return;
    }
    
    setSending(true);
    try {
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

      // Send via API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: form.to,
          subject: form.subject,
          html: html,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Store in local outbox for record keeping
      const email = { 
        id: `${Date.now()}`, 
        ...form, 
        from: fromEmail,
        html, 
        template: tplSel, 
        templateStyle: styleSel, 
        signature: sigSel, 
        sentAt: new Date().toISOString() 
      };
      addEmail(email);
      setOutbox(getEmails());
      setForm({ to: '', subject: '', preheader: '', ctaLabel: '', ctaUrl: '', body: '' });
      
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
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
    const safeAttr = (s) => (s || '').replace(/"/g, '&quot;');
    const safeBody = (body || '').replace(/\n/g, '<br/>');
    const signatureImageUrl = signature?.imageUrl && /^https?:\/\//i.test(signature.imageUrl.trim())
      ? signature.imageUrl.trim()
      : '';
    const sigBlock = signature ? `
      <div style="margin-top:24px; color:#555;">
        <div>${safe(signature.signature)}</div>
        ${signatureImageUrl ? `<div style="margin-top:12px;"><img src="${safeAttr(signatureImageUrl)}" alt="Signature" style="max-height:80px; width:auto; display:block;"/></div>` : ''}
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
                    <img src="${logoUrl || 'https://hostpenny.co.uk/logo.gif'}" alt="HostPenny" style="height:40px; display:block;"/>
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
                  <td align="center" style="padding:20px 32px; color:#666; font-size:12px; background:#fafafa; line-height:1.8;">
                    <p style="margin:0 0 8px 0; font-weight:600;">HostPenny</p>
                    <p style="margin:0 0 8px 0;">Professional Web Development & Hosting</p>
                    <p style="margin:0 0 12px 0;">United Kingdom</p>
                    <p style="margin:0 0 8px 0;">
                      <a href="https://hostpenny.co.uk" style="color:#667eea; text-decoration:none;">Visit Website</a> | 
                      <a href="https://hostpenny.co.uk/unsubscribe" style="color:#667eea; text-decoration:none;">Unsubscribe</a> | 
                      <a href="https://hostpenny.co.uk/privacy" style="color:#667eea; text-decoration:none;">Privacy Policy</a>
                    </p>
                    <p style="margin:0; color:#999;">© ${new Date().getFullYear()} HostPenny. All rights reserved.</p>
                  </td>
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
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-purple-600 text-xl">✨</div>
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 mb-1">Professional Email Composer</h3>
            <p className="text-sm text-purple-700">
              Create beautiful, branded emails with professional templates, custom styles, and signatures. 
              Perfect for newsletters, announcements, and marketing campaigns. 
              For quick replies to received emails, use the <strong>Inbox</strong> tab.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Compose Email">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">From:</label>
              <select 
                value={fromEmail} 
                onChange={(e)=>setFromEmail(e.target.value)} 
                className="w-full border rounded px-3 py-2"
              >
                {availableFromEmails.map(email => (
                  <option key={email} value={email}>{email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">To:</label>
              <input 
                className="w-full border rounded px-3 py-2" 
                placeholder="recipient@example.com" 
                value={form.to} 
                onChange={(e)=>setForm({...form, to: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Subject:</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Email subject" value={form.subject} onChange={(e)=>setForm({...form, subject: e.target.value})} />
          </div>
          
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Preheader (preview text):</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Shows in inbox preview" value={form.preheader} onChange={(e)=>setForm({...form, preheader: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">CTA Button Label (optional):</label>
              <input className="w-full border rounded px-3 py-2" placeholder="e.g., Get Started" value={form.ctaLabel} onChange={(e)=>setForm({...form, ctaLabel: e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">CTA Button URL (optional):</label>
              <input className="w-full border rounded px-3 py-2" placeholder="https://..." value={form.ctaUrl} onChange={(e)=>setForm({...form, ctaUrl: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Message:</label>
            <textarea className="w-full border rounded px-3 py-2" rows={8} placeholder="Write your email content here..." value={form.body} onChange={(e)=>setForm({...form, body: e.target.value})} />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <HiOutlineLightBulb className="w-4 h-4 text-amber-500" /> Your signature will be automatically added below the message
            </p>
            <button 
              onClick={send} 
              disabled={sending || !form.to || !form.subject}
              className="btn-primary px-6 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? 'Sending...' : <><HiOutlineMail className="w-4 h-4" /> Send Email</>}
            </button>
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
                    <div className="text-xs text-gray-600">
                      From: {m.from || 'hello@hostpenny.co.uk'} → To: {m.to}
                    </div>
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
  const [showPassword, setShowPassword] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null);
  
  const startAdd = () => {
    const newUser = {
      id:`${Date.now()}`,
      email:'',
      name:'',
      role:'Contributor',
      jobTitle:'Web Developer',
      password:'',
      active: true,
      createdAt: new Date().toISOString()
    };
    setFormData(newUser);
    setEditingId('new');
  };
  
  const startEdit = (user) => {
    setFormData({...user});
    setEditingId(user.id);
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };
  
  const saveUser = () => {
    if (!formData.email || !formData.name) {
      alert('Please fill in name and email');
      return;
    }
    if (editingId === 'new') {
      const next = [...users, formData];
      setLocUsers(next);
      setUsers(next);
    } else {
      const next = users.map(u => u.id === editingId ? formData : u);
      setLocUsers(next);
      setUsers(next);
    }
    setEditingId(null);
    setFormData(null);
  };
  
  const remove = (id) => { 
    if (!confirm('Remove this team member?')) return;
    const next = users.filter(u => u.id !== id); 
    setLocUsers(next); 
    setUsers(next); 
  };

  const togglePassword = () => {
    setShowPassword(prev => ({...prev, [editingId]: !prev[editingId]}));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };
  
  const updateForm = (patch) => {
    setFormData(prev => ({...prev, ...patch}));
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-700';
      case 'Contributor': return 'bg-blue-100 text-blue-700';
      case 'Viewer': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Section title="Team Members" icon={HiOutlineUsers} actions={
      editingId === null && (
        <Button variant="primary" onClick={startAdd}>
          <HiOutlinePlus className="w-4 h-4" /> Add Team Member
        </Button>
      )
    }>
      {/* Edit/Add Form */}
      {editingId !== null && formData && (
        <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {editingId === 'new' ? (
                <><HiOutlinePlus className="w-5 h-5 text-purple-600" /> Add New Team Member</>
              ) : (
                <><HiOutlinePencil className="w-5 h-5 text-purple-600" /> Edit Team Member</>
              )}
            </h3>
            <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                placeholder="John Smith" 
                value={formData.name || ''} 
                onChange={(e) => updateForm({name: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                placeholder="john@hostpenny.co.uk" 
                type="email"
                value={formData.email || ''} 
                onChange={(e) => updateForm({email: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                value={formData.jobTitle || 'Web Developer'} 
                onChange={(e) => updateForm({jobTitle: e.target.value})}
              >
                {teamRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                value={formData.role || 'Contributor'} 
                onChange={(e) => updateForm({role: e.target.value})}
              >
                <option value="Admin">Admin (Full Access)</option>
                <option value="Contributor">Contributor (View & Edit)</option>
                <option value="Viewer">Viewer (Read Only)</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Login Password</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type={showPassword[editingId] ? 'text' : 'password'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono" 
                  placeholder="Create password" 
                  value={formData.password || ''} 
                  onChange={(e) => updateForm({password: e.target.value})} 
                />
                <button 
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword[editingId] ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
              <Button variant="secondary" onClick={() => updateForm({password: generatePassword()})}>
                <HiOutlineRefresh className="w-4 h-4" /> Generate
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-purple-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.active !== false} 
                onChange={(e) => updateForm({active: e.target.checked})}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Active member</span>
            </label>
            
            <div className="flex gap-2">
              <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
              <Button variant="success" onClick={saveUser}>
                <HiOutlineSave className="w-4 h-4" /> Save Member
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Team Members List */}
      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <HiOutlineUsers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No team members yet. Add your first team member to get started.</p>
          </div>
        ) : (
          users.map(u => (
            <div 
              key={u.id} 
              className={`p-4 border rounded-xl flex items-center justify-between transition-all hover:shadow-md ${
                u.active !== false ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'
              } ${editingId === u.id ? 'ring-2 ring-purple-500' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                  {(u.name || u.email || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{u.name || 'Unnamed'}</h4>
                    {u.active === false && (
                      <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{u.jobTitle || 'Team Member'}</span>
                    <span className="text-gray-300">•</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(u.role)}`}>
                      {u.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => startEdit(u)}>
                  <HiOutlinePencil className="w-4 h-4" /> Edit
                </Button>
                {u.id !== 'u1' && (
                  <Button variant="danger" onClick={() => remove(u.id)}>
                    <HiOutlineTrash className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
        <HiOutlineDocumentText className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>Quick Tip:</strong> Team members can log in using their email and password. Assign them to projects in the Enquiries tab.
        </p>
      </div>
    </Section>
  );
}

function BackupTab() {
  const doExport = () => {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `hostpenny-backup-${new Date().toISOString().split('T')[0]}.json`; a.click();
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
    <Section title="Backup & Restore" icon={HiOutlineCloudDownload}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <HiOutlineCloudDownload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Export Backup</h3>
              <p className="text-sm text-gray-500">Download all your data</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Create a backup of all your settings, testimonials, portfolio items, templates, and team data.
          </p>
          <Button variant="success" onClick={doExport} className="w-full justify-center">
            <HiOutlineCloudDownload className="w-4 h-4" /> Download Backup
          </Button>
        </div>
        
        {/* Import Card */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <HiOutlineRefresh className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Restore Backup</h3>
              <p className="text-sm text-gray-500">Import a previous backup</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Restore your data from a previously exported backup file. This will overwrite current data.
          </p>
          <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors text-blue-700 font-medium">
            <HiOutlineDocumentText className="w-4 h-4" />
            Select Backup File
            <input type="file" accept="application/json" className="hidden" onChange={onImport}/>
          </label>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
        <HiOutlineDocumentText className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800">
          <strong>Important:</strong> Backup files are stored locally. For cloud backups, download the file and store it in a secure location like Google Drive or Dropbox.
        </div>
      </div>
    </Section>
  );
}

function DashboardTab() {
  const m = getMetrics();
  const enquiries = getEnquiries();
  const teamMembers = getTeamMembers();
  const byStatus = crmStatuses.map(s=> ({ s, count: enquiries.filter(e=>e.status===s).length }));
  const today = new Date(); today.setHours(0,0,0,0);
  const todayCount = enquiries.filter(e=> new Date(e.createdAt) >= today).length;
  const weekAgo = new Date(Date.now()-7*24*3600*1000);
  const weekCount = enquiries.filter(e=> new Date(e.createdAt) >= weekAgo).length;
  const monthAgo = new Date(Date.now()-30*24*3600*1000);
  const monthCount = enquiries.filter(e=> new Date(e.createdAt) >= monthAgo).length;
  const totalValue = enquiries.filter(e => e.status === 'Closed Won').length;
  
  const statusColors = {
    'New': 'from-blue-500 to-blue-600',
    'Qualified': 'from-purple-500 to-purple-600',
    'In Progress': 'from-amber-500 to-amber-600',
    'Proposal Sent': 'from-indigo-500 to-indigo-600',
    'Closed Won': 'from-green-500 to-green-600',
    'Closed Lost': 'from-red-500 to-red-600',
    'On Hold': 'from-gray-500 to-gray-600',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">Welcome back! <HiOutlineSparkles className="w-6 h-6" /></h2>
            <p className="text-purple-100 mt-1">Here's what's happening with your business today.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-200">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <HiOutlineMail className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Today</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{todayCount}</div>
            <div className="text-sm text-gray-500">New Enquiries</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
              <HiOutlineChartBar className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">7 days</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{weekCount}</div>
            <div className="text-sm text-gray-500">This Week</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
              <HiOutlineTrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">30 days</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{monthCount}</div>
            <div className="text-sm text-gray-500">This Month</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
              <HiOutlineBadgeCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Won</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{totalValue}</div>
            <div className="text-sm text-gray-500">Deals Closed</div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {byStatus.slice(0, 4).map(x=> (
              <div key={x.s} className={`bg-gradient-to-br ${statusColors[x.s] || 'from-gray-500 to-gray-600'} rounded-xl p-4 text-white`}>
                <div className="text-2xl font-bold">{x.count}</div>
                <div className="text-sm opacity-90">{x.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {byStatus.slice(4).map(x=> (
              <div key={x.s} className={`bg-gradient-to-br ${statusColors[x.s] || 'from-gray-500 to-gray-600'} rounded-xl p-4 text-white`}>
                <div className="text-2xl font-bold">{x.count}</div>
                <div className="text-sm opacity-90">{x.s}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Team</h3>
          <div className="space-y-3">
            {teamMembers.slice(0, 5).map(member => (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {(member.name || member.email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{member.name || member.email}</div>
                  <div className="text-xs text-gray-500">{member.jobTitle || member.role}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${member.active !== false ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No team members yet. Add your first team member!</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Needs Attention */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">⚡ Needs Attention</h3>
          <span className="text-xs text-gray-500">New & overdue enquiries</span>
        </div>
        <div className="space-y-3">
          {enquiries.filter(e=> e.status==='New' || (e.dueDate && new Date(e.dueDate)<new Date())).slice(0,5).map(e=> (
            <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${e.status === 'New' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                <div>
                  <div className="font-medium text-gray-900">{e.fullName}</div>
                  <div className="text-sm text-gray-500">{e.projectType} • {e.budget}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${e.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {e.status === 'New' ? 'New' : 'Overdue'}
                </div>
                <div className="text-xs text-gray-400 mt-1">{new Date(e.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
          {enquiries.filter(e=> e.status==='New' || (e.dueDate && new Date(e.dueDate)<new Date())).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">✨</div>
              <p>All caught up! No urgent items.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SignaturesTab() {
  const [items, setItems] = useState(() => getSignatures());
  const add = () => { const next=[{id:`${Date.now()}`,name:'New Signature',fullName:'Your Name',designation:'Role',signature:'Best regards,', imageUrl:''},...items]; setItems(next); setSignatures(next); };
  const update = (id, patch) => { const next=items.map(s=>s.id===id?{...s,...patch}:s); setItems(next); setSignatures(next); };
  const remove = (id) => { const next=items.filter(s=>s.id!==id); setItems(next); setSignatures(next); };
  return (
    <Section title="Signatures" icon={HiOutlinePencilAlt} actions={<button onClick={add} className="btn-primary px-3 py-2 rounded-lg text-white">Add</button>}>
      <div className="space-y-4">
        {items.map(s=> (
          <div key={s.id} className="p-4 border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <input className="border rounded px-3 py-2" placeholder="Signature Name" value={s.name} onChange={(e)=>update(s.id,{name:e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Full Name" value={s.fullName} onChange={(e)=>update(s.id,{fullName:e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Designation" value={s.designation} onChange={(e)=>update(s.id,{designation:e.target.value})} />
            <input className="md:col-span-2 border rounded px-3 py-2" placeholder="Closing (e.g., Best regards,)" value={s.signature} onChange={(e)=>update(s.id,{signature:e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Signature image URL (https://...)" value={s.imageUrl || ''} onChange={(e)=>update(s.id,{imageUrl:e.target.value})} />
            {s.imageUrl && (
              <div className="md:col-span-2 border rounded-lg p-3 bg-gray-50">
                <div className="text-xs text-gray-500 mb-2">Image Preview</div>
                <img src={s.imageUrl} alt="Signature preview" className="max-h-16 w-auto" />
              </div>
            )}
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
  const [showPassword, setShowPassword] = useState(false);
  const loggedIn = !!session;

  const doLogin = (e) => {
    e.preventDefault();
    // Check main admin credentials
    if (login.email === ADMIN_EMAIL && login.password === ADMIN_PASSWORD) {
      const s = { email: login.email, name: 'Admin', role: 'Admin', loggedInAt: new Date().toISOString() };
      setAdminSession(s);
      setSession(s);
      return;
    }
    // Check team member credentials
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === login.email.toLowerCase() && u.password === login.password && u.active !== false);
    if (user) {
      const s = { email: user.email, name: user.name, role: user.role, jobTitle: user.jobTitle, loggedInAt: new Date().toISOString() };
      setAdminSession(s);
      setSession(s);
      return;
    }
    alert('Invalid credentials');
  };

  const logout = () => {
    clearAdminSession();
    setSession(null);
  };

  const menuItems = [
    { key:'dashboard', label:'Overview', icon: HiOutlineChartBar },
    { key:'enquiries', label:'Enquiries', icon: HiOutlineMail },
    { key:'inbox', label:'Inbox', icon: HiOutlineInbox },
    { key:'testimonials', label:'Testimonials', icon: HiOutlineChatAlt2 },
    { key:'portfolio', label:'Portfolio', icon: HiOutlineCollection },
    { key:'emails', label:'Emails', icon: HiOutlineDocumentText },
    { key:'templates', label:'Templates', icon: HiOutlineTemplate },
    { key:'signatures', label:'Signatures', icon: HiOutlinePencilAlt },
    { key:'settings', label:'Settings', icon: HiOutlineCog },
    { key:'seo', label:'SEO', icon: HiOutlineSearch },
    { key:'subscribers', label:'Subscribers', icon: HiOutlineUserGroup },
    { key:'activity', label:'Activity', icon: HiOutlineChartBar },
    { key:'users', label:'Team', icon: HiOutlineUsers },
    { key:'backup', label:'Backup', icon: HiOutlineCloudDownload },
  ];

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] bg-purple-600/30 animate-pulse"></div>
          <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] bg-indigo-600/30 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo.gif" alt="HostPenny" className="h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-purple-200 mt-2">Sign in to manage your business</p>
          </div>
          
          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <form onSubmit={doLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                  placeholder="you@example.com"
                  value={login.email} 
                  onChange={(e)=>setLogin({...login, email:e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12" 
                    placeholder="••••••••"
                    value={login.password} 
                    onChange={(e)=>setLogin({...login, password:e.target.value})} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:scale-[1.02]"
              >
                Sign In
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <p className="text-center text-white/40 text-sm mt-6">
            Secure admin access • HostPenny © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="container-custom py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.gif" alt="Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-lg font-bold">HostPenny Admin</h1>
              <p className="text-xs text-purple-200">Manage your business</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{session.name || session.email}</div>
              <div className="text-xs text-purple-200">{session.jobTitle || session.role || 'Admin'}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {(session.name || session.email || 'A')[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="bg-white border rounded-2xl p-4 shadow-sm sticky top-6">
              <nav className="space-y-1">
                {menuItems.map((item)=> {
                  const IconComponent = item.icon;
                  return (
                  <button
                    key={item.key}
                    onClick={()=>setTab(item.key)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                      tab===item.key 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )})}
              </nav>

              <div className="mt-4 pt-4 border-t">
                <button 
                  onClick={logout} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                >
                  <HiOutlineLogout className="w-5 h-5" /> Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
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
