import { useState, useEffect } from 'react';
import { FaEnvelope, FaEnvelopeOpen, FaStar, FaRegStar, FaArchive, FaReply, FaTrash, FaSearch } from 'react-icons/fa';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, starred, archived
  const [searchQuery, setSearchQuery] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, [filter, searchQuery]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter === 'unread') params.append('read', 'false');
      if (filter === 'starred') params.append('starred', 'true');
      if (filter === 'archived') params.append('archived', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/inbound-emails?${params}`);
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEmail = async (email) => {
    setSelectedEmail(email);
    setShowReplyForm(false);
    
    // Mark as read
    if (!email.read) {
      try {
        await fetch(`/api/inbound-emails/${email._id}/read`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        });
        
        setEmails(emails.map(e => 
          e._id === email._id ? { ...e, read: true } : e
        ));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const toggleStar = async (email, e) => {
    e.stopPropagation();
    try {
      await fetch(`/api/inbound-emails/${email._id}/star`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: !email.starred }),
      });
      
      setEmails(emails.map(em => 
        em._id === email._id ? { ...em, starred: !em.starred } : em
      ));
      
      if (selectedEmail?._id === email._id) {
        setSelectedEmail({ ...selectedEmail, starred: !selectedEmail.starred });
      }
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const archiveEmail = async (email) => {
    try {
      await fetch(`/api/inbound-emails/${email._id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });
      
      setEmails(emails.filter(e => e._id !== email._id));
      if (selectedEmail?._id === email._id) {
        setSelectedEmail(null);
      }
    } catch (error) {
      console.error('Failed to archive:', error);
    }
  };

  const deleteEmail = async (email) => {
    if (!confirm('Delete this email permanently?')) return;
    
    try {
      await fetch(`/api/inbound-emails/${email._id}`, {
        method: 'DELETE',
      });
      
      setEmails(emails.filter(e => e._id !== email._id));
      if (selectedEmail?._id === email._id) {
        setSelectedEmail(null);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const sendReply = async () => {
    if (!replyBody.trim() || !selectedEmail) return;
    
    setSending(true);
    try {
      await fetch(`/api/inbound-emails/${selectedEmail._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: replySubject || `Re: ${selectedEmail.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
              ${replyBody.replace(/\n/g, '<br>')}
              <br><br>
              <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px; color: #666;">
                <p><strong>From:</strong> ${selectedEmail.from.name || selectedEmail.from.email}</p>
                <p><strong>Sent:</strong> ${new Date(selectedEmail.receivedAt).toLocaleString()}</p>
                <p><strong>Subject:</strong> ${selectedEmail.subject}</p>
                <div style="margin-top: 10px;">
                  ${selectedEmail.html || selectedEmail.text}
                </div>
              </div>
            </div>
          `,
        }),
      });
      
      alert('Reply sent successfully!');
      setShowReplyForm(false);
      setReplyBody('');
      setReplySubject('');
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const sendNewEmail = async () => {
    if (!composeBody.trim() || !composeTo.trim() || !composeSubject.trim()) {
      alert('Please fill in recipient, subject, and message');
      return;
    }
    
    setSending(true);
    try {
      const { Resend } = await import('resend');
      
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          html: `
            <div style="font-family: Arial, sans-serif;">
              ${composeBody.replace(/\n/g, '<br>')}
            </div>
          `,
        }),
      });
      
      alert('Email sent successfully!');
      setShowComposeForm(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffHours = (now - d) / 3600000;
    
    if (diffHours < 24) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffHours < 168) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Email List */}
      <div className="lg:col-span-1 bg-white border rounded-xl overflow-hidden flex flex-col">
        {/* Search & Filters */}
        <div className="p-4 border-b">
          <button
            onClick={() => {
              setShowComposeForm(true);
              setSelectedEmail(null);
              setShowReplyForm(false);
            }}
            className="w-full mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            ✉️ Compose New Email
          </button>
          
          <div className="relative mb-3">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'unread', 'starred', 'archived'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                  filter === f 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              Loading...
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <FaEnvelope size={32} className="mb-2 opacity-50" />
              <p>No emails found</p>
            </div>
          ) : (
            <div>
              {emails.map(email => (
                <div
                  key={email._id}
                  onClick={() => openEmail(email)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    !email.read ? 'bg-blue-50' : ''
                  } ${selectedEmail?._id === email._id ? 'bg-purple-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!email.read && (
                          <FaEnvelope className="text-blue-600 text-xs flex-shrink-0" />
                        )}
                        <p className={`text-sm truncate ${!email.read ? 'font-bold' : 'font-medium'}`}>
                          {email.from.name || email.from.email}
                        </p>
                      </div>
                      <p className={`text-sm truncate mb-1 ${!email.read ? 'font-semibold' : ''}`}>
                        {email.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {email.text?.substring(0, 60)}...
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(email.receivedAt)}
                      </span>
                      <button
                        onClick={(e) => toggleStar(email, e)}
                        className="text-yellow-500 hover:scale-110 transition-transform"
                      >
                        {email.starred ? <FaStar /> : <FaRegStar />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Content */}
      <div className="lg:col-span-2 bg-white border rounded-xl overflow-hidden flex flex-col">
        {showComposeForm ? (
          <>
            <div className="p-4 border-b bg-purple-50">
              <h2 className="text-xl font-bold">New Email</h2>
              <p className="text-sm text-gray-600">From: hello@hostpenny.co.uk</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                  <input
                    type="email"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                  <input
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="Email subject"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                  <textarea
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    placeholder="Write your message..."
                    rows={12}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={sendNewEmail}
                    disabled={sending || !composeBody.trim() || !composeTo.trim() || !composeSubject.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {sending ? 'Sending...' : 'Send Email'}
                  </button>
                  <button
                    onClick={() => {
                      setShowComposeForm(false);
                      setComposeTo('');
                      setComposeSubject('');
                      setComposeBody('');
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="p-4 border-b">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{selectedEmail.subject}</h2>
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">
                      <strong>From:</strong> {selectedEmail.from.name || selectedEmail.from.email} &lt;{selectedEmail.from.email}&gt;
                    </p>
                    <p className="mb-1">
                      <strong>To:</strong> {selectedEmail.to.map(t => t.email).join(', ')}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(selectedEmail.receivedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowReplyForm(!showReplyForm);
                      setReplySubject(`Re: ${selectedEmail.subject}`);
                    }}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Reply"
                  >
                    <FaReply size={18} />
                  </button>
                  <button
                    onClick={() => toggleStar(selectedEmail, { stopPropagation: () => {} })}
                    className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Star"
                  >
                    {selectedEmail.starred ? <FaStar size={18} /> : <FaRegStar size={18} />}
                  </button>
                  <button
                    onClick={() => archiveEmail(selectedEmail)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Archive"
                  >
                    <FaArchive size={18} />
                  </button>
                  <button
                    onClick={() => deleteEmail(selectedEmail)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {showReplyForm ? (
                <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Write your reply..."
                    rows={8}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={sendReply}
                      disabled={sending || !replyBody.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyBody('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {selectedEmail.html ? (
                <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
              ) : (
                <div className="whitespace-pre-wrap">{selectedEmail.text}</div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FaEnvelopeOpen size={64} className="mb-4 opacity-50" />
            <p className="text-lg">Select an email to read</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
