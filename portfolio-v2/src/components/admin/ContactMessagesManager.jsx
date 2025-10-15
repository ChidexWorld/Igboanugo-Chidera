import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDocuments,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import '../../styles/components/admin/CRUDManager.css';

const ContactMessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getAllDocuments('contactSubmissions');
      // Sort by timestamp, newest first
      const sortedData = data.sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB - dateA;
      });
      setMessages(sortedData);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await updateDocument('contactSubmissions', id, { status: 'read' });
      toast.success('Message marked as read');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await updateDocument('contactSubmissions', id, { status: 'unread' });
      toast.success('Message marked as unread');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDocument('contactSubmissions', id);
        toast.success('Message deleted successfully');
        setSelectedMessage(null);
        fetchMessages();
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-manager">
      <div className="manager-header">
        <h2>Contact Messages ({messages.length})</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.8rem 1.5rem',
              background: 'var(--second-bg-color)',
              color: 'var(--white-color)',
              border: '0.2rem solid var(--main-color)',
              borderRadius: '0.8rem',
              fontSize: '1.4rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-envelope"></i>
          <p>No messages yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Messages List */}
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (message.status === 'unread') {
                    handleMarkAsRead(message.id);
                  }
                }}
                style={{
                  padding: '1.5rem',
                  background: message.status === 'unread' ? 'var(--main-color)' : 'var(--second-bg-color)',
                  borderRadius: '0.8rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  border: selectedMessage?.id === message.id ? '0.2rem solid var(--main-color)' : '0.2rem solid transparent',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: message.status === 'unread' ? 'var(--bg-color)' : 'var(--white-color)' }}>
                    {message.name}
                  </h4>
                  {message.status === 'unread' && (
                    <span style={{
                      background: 'var(--bg-color)',
                      color: 'var(--main-color)',
                      padding: '0.2rem 0.8rem',
                      borderRadius: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}>
                      NEW
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '1.4rem', color: message.status === 'unread' ? 'var(--bg-color)' : 'var(--white-color)', opacity: 0.8 }}>
                  {message.subject || 'No subject'}
                </p>
                <p style={{ fontSize: '1.2rem', color: message.status === 'unread' ? 'var(--bg-color)' : 'var(--white-color)', opacity: 0.6, marginTop: '0.5rem' }}>
                  {formatDate(message.timestamp)}
                </p>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          <div style={{
            background: 'var(--second-bg-color)',
            borderRadius: '0.8rem',
            padding: '2rem',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            {selectedMessage ? (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '2.2rem', color: 'var(--main-color)' }}>
                      {selectedMessage.subject || 'No Subject'}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {selectedMessage.status === 'read' ? (
                        <button
                          onClick={() => handleMarkAsUnread(selectedMessage.id)}
                          style={{
                            padding: '0.8rem 1.5rem',
                            background: 'transparent',
                            color: 'var(--main-color)',
                            border: '0.2rem solid var(--main-color)',
                            borderRadius: '0.8rem',
                            fontSize: '1.4rem',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Unread
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        style={{
                          padding: '0.8rem 1.5rem',
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.8rem',
                          fontSize: '1.4rem',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                      <strong>From:</strong> {selectedMessage.name}
                    </p>
                    <p style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--main-color)' }}>
                        {selectedMessage.email}
                      </a>
                    </p>
                    {selectedMessage.phone && (
                      <p style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                        <strong>Phone:</strong>{' '}
                        <a href={`tel:${selectedMessage.phone}`} style={{ color: 'var(--main-color)' }}>
                          {selectedMessage.phone}
                        </a>
                      </p>
                    )}
                    <p style={{ fontSize: '1.4rem', opacity: 0.7, marginTop: '1rem' }}>
                      {formatDate(selectedMessage.timestamp)}
                    </p>
                  </div>

                  <div style={{
                    padding: '2rem',
                    background: 'var(--bg-color)',
                    borderRadius: '0.8rem',
                    borderLeft: '0.4rem solid var(--main-color)'
                  }}>
                    <h4 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--main-color)' }}>
                      Message:
                    </h4>
                    <p style={{ fontSize: '1.6rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                opacity: 0.5
              }}>
                <i className="bx bx-envelope" style={{ fontSize: '8rem', marginBottom: '2rem' }}></i>
                <p style={{ fontSize: '1.8rem' }}>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesManager;
