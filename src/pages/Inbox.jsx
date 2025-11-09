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
  const [composeFrom, setComposeFrom] = useState('hello@hostpenny.co.uk');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);

  const availableEmails = [
    'hello@hostpenny.co.uk',
    'support@hostpenny.co.uk',
    'admin@hostpenny.co.uk',
    'info@hostpenny.co.uk',
    'sales@hostpenny.co.uk',
    'contact@hostpenny.co.uk',
  ];

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
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="white-space: pre-wrap;">
                ${replyBody.replace(/\n/g, '<br>')}
              </div>
              <div style="border-top: 2px solid #e5e7eb; margin: 30px 0 20px 0; padding-top: 20px; color: #666; font-size: 14px;">
                <p style="margin: 0 0 10px 0; color: #999;">--- Original Message ---</p>
                <p style="margin: 5px 0;"><strong>From:</strong> ${selectedEmail.from.name || selectedEmail.from.email}</p>
                <p style="margin: 5px 0;"><strong>Sent:</strong> ${new Date(selectedEmail.receivedAt).toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${selectedEmail.subject}</p>
                <div style="margin-top: 15px; padding: 15px; background: #f9f9f9; border-left: 3px solid #667eea;">
                  ${selectedEmail.html || selectedEmail.text.replace(/\n/g, '<br>')}
                </div>
              </div>
              <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 6px; font-size: 12px; color: #666;">
                <p style="margin: 0 0 5px 0;"><strong>HostPenny</strong></p>
                <p style="margin: 0 0 5px 0;">Professional Web Development & Hosting</p>
                <p style="margin: 0 0 5px 0;">United Kingdom</p>
                <p style="margin: 0;">
                  <a href="https://hostpenny.co.uk" style="color: #667eea; text-decoration: none;">Website</a> | 
                  <a href="mailto:support@hostpenny.co.uk" style="color: #667eea; text-decoration: none;">Support</a>
                </p>
              </div>
            </body>
            </html>
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
          from: composeFrom,
          to: composeTo,
          subject: composeSubject,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="white-space: pre-wrap;">
                ${composeBody.replace(/\n/g, '<br>')}
              </div>
              <div style="margin-top: 40px; padding: 20px; background: #f5f5f5; border-radius: 6px; font-size: 12px; color: #666;">
                <p style="margin: 0 0 5px 0;"><strong>HostPenny</strong></p>
                <p style="margin: 0 0 5px 0;">Professional Web Development & Hosting</p>
                <p style="margin: 0 0 5px 0;">United Kingdom</p>
                <p style="margin: 0;">
                  <a href="https://hostpenny.co.uk" style="color: #667eea; text-decoration: none;">Website</a> | 
                  <a href="mailto:support@hostpenny.co.uk" style="color: #667eea; text-decoration: none;">Support</a>
                </p>
              </div>
            </body>
            </html>
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
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-xl">💡</div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Quick Email Management</h3>
            <p className="text-sm text-blue-700">
              This inbox is for receiving and quickly replying to emails sent to your @hostpenny.co.uk addresses. 
              For sending branded emails with templates, styles, and signatures, use the <strong>Emails</strong> tab in the sidebar.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-18rem)]">
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
              ✉️ Quick Compose
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
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From:</label>
                  <select
                    value={composeFrom}
                    onChange={(e) => setComposeFrom(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {availableEmails.map(email => (
                      <option key={email} value={email}>{email}</option>
                    ))}
                  </select>
                </div>
                
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

                <div className="flex gap-3">
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
    </div>
  );
};

export default Inbox;
