import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlineMail, HiOutlineTrash, HiOutlineReply, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi";
import AdminLayout from "../components/AdminLayout";

const AdminContat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
  const [readFilter, setReadFilter] = useState("all");
  const [replyFilter, setReplyFilter] = useState("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/contact/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/contact/messages/read/${id}`);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === id ? { ...message, is_readed: true } : message
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleReplyChange = (id, value) => {
    setReplyDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/contact/messages/${id}`);
      setMessages((prev) => prev.filter((message) => message.id !== id));
      setActionMessage({ text: "Message deleted successfully.", type: "success" });
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error deleting message:", error);
      setActionMessage({ text: "Failed to delete message.", type: "error" });
    }
  };

  const sendReply = async (id) => {
    const replyMessage = replyDrafts[id]?.trim();
    if (!replyMessage) {
      setActionMessage({ text: "Please enter a reply message.", type: "error" });
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/contact/messages/reply/${id}`, {
        replyMessage,
      });
      setMessages((prev) =>
        prev.map((message) =>
          message.id === id
            ? { ...message, is_replyed: true, is_readed: true }
            : message
        )
      );
      setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
      setActionMessage({ text: "Reply sent successfully.", type: "success" });
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error sending reply:", error);
      setActionMessage({ text: "Failed to send reply.", type: "error" });
    }
  };

  const filteredMessages = messages.filter((message) => {
    const readMatch =
      readFilter === "all" ||
      (readFilter === "read" && message.is_readed) ||
      (readFilter === "unread" && !message.is_readed);

    const replyMatch =
      replyFilter === "all" ||
      (replyFilter === "replied" && message.is_replyed) ||
      (replyFilter === "pending" && !message.is_replyed);

    return readMatch && replyMatch;
  });

  return (
    <AdminLayout title="Contact Messages">
      {actionMessage.text && (
        <div className={`fixed top-24 right-8 z-50 p-4 rounded-2xl shadow-lg border animate-in slide-in-from-right-full ${
          actionMessage.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? <HiOutlineCheckCircle className="w-5 h-5" /> : <HiOutlineExclamation className="w-5 h-5" />}
            <p className="font-medium">{actionMessage.text}</p>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Read Status</label>
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="all">All Messages</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Reply Status</label>
          <select
            value={replyFilter}
            onChange={(e) => setReplyFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="all">All Replies</option>
            <option value="replied">Replied</option>
            <option value="pending">Awaiting Reply</option>
          </select>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-6 py-2.5 rounded-xl text-sm text-blue-700 font-medium">
          Showing {filteredMessages.length} of {messages.length} messages
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineMail className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No messages found</h3>
          <p className="text-slate-400">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMessages.map((message) => (
            <div key={message.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all">
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                      {message.first_name?.[0]}{message.last_name?.[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {message.first_name} {message.last_name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span className="hover:text-blue-600 transition-colors cursor-pointer">{message.email}</span>
                        <span>•</span>
                        <span>{message.country || "Unknown Location"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      message.is_readed ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {message.is_readed ? <HiOutlineCheckCircle className="w-4 h-4" /> : <HiOutlineClock className="w-4 h-4" />}
                      {message.is_readed ? 'Read' : 'Unread'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      message.is_replyed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {message.is_replyed ? <HiOutlineReply className="w-4 h-4" /> : <HiOutlineClock className="w-4 h-4" />}
                      {message.is_replyed ? 'Replied' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="relative mb-8">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                  <div className="pl-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Message Content</p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg italic font-serif">
                      "{message.message}"
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-slate-50">
                  <div className="flex flex-wrap gap-4 items-center">
                    {!message.is_readed && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 text-sm"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="text-slate-500 hover:text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                      Delete
                    </button>
                  </div>

                  <div className="relative group">
                    <textarea
                      value={replyDrafts[message.id] || ''}
                      onChange={(e) => handleReplyChange(message.id, e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-500 transition-all min-h-[120px] shadow-inner"
                    />
                    <button
                      onClick={() => sendReply(message.id)}
                      className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center gap-2 text-sm"
                    >
                      <HiOutlineReply className="w-5 h-5" />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContat;
