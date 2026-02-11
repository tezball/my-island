import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminLeadService } from '../../services/adminService';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/shared/AdminConfirmModal';
import type { Lead, LeadInteraction, InteractionType, LeadStatus } from '../../types/admin';

const INTERACTION_ICONS: Record<string, string> = {
    CALL: 'call', EMAIL: 'email', MEETING: 'groups', NOTE: 'note',
};

const STATUS_ORDER: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

export const AdminLeadDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [lead, setLead] = useState<Lead | null>(null);
    const [interactions, setInteractions] = useState<LeadInteraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editStatus, setEditStatus] = useState<LeadStatus>('NEW');
    const [editNotes, setEditNotes] = useState('');
    const [editFollowUp, setEditFollowUp] = useState('');
    const [editTags, setEditTags] = useState('');
    const [saving, setSaving] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [newInterType, setNewInterType] = useState<InteractionType>('NOTE');
    const [newInterContent, setNewInterContent] = useState('');
    const [addingInter, setAddingInter] = useState(false);

    const fetchLead = () => {
        if (!id) return;
        setLoading(true);
        adminLeadService.get(Number(id))
            .then(({ lead: l, interactions: i }) => {
                setLead(l);
                setInteractions(i);
                setEditStatus(l.status);
                setEditNotes(l.notes || '');
                setEditFollowUp(l.scheduledFollowUp ? l.scheduledFollowUp.slice(0, 16) : '');
                setEditTags(l.tags || '');
            })
            .catch(() => navigate('/admin/leads'))
            .finally(() => setLoading(false));
    };

    useEffect(fetchLead, [id, navigate]);

    const handleSave = async () => {
        if (!lead) return;
        setSaving(true);
        try {
            const updated = await adminLeadService.update(lead.id, {
                status: editStatus, notes: editNotes,
                scheduledFollowUp: editFollowUp || undefined,
                tags: editTags || undefined,
            });
            setLead(updated);
            setEditing(false);
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!lead) return;
        await adminLeadService.remove(lead.id);
        navigate('/admin/leads');
    };

    const handleAddInteraction = async () => {
        if (!lead || !newInterContent.trim()) return;
        setAddingInter(true);
        try {
            await adminLeadService.addInteraction(lead.id, { type: newInterType, content: newInterContent });
            setNewInterContent('');
            fetchLead();
        } finally { setAddingInter(false); }
    };

    if (loading || !lead) {
        return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <button onClick={() => navigate('/admin/leads')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Leads
            </button>

            {/* Lead Info */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white">{lead.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <AdminStatusBadge status={lead.status} />
                            <AdminStatusBadge status={lead.businessType === 'OWNER' ? 'CONFIRMED' : 'TRIALING'} label={lead.businessType} />
                            <span className="text-xs text-gray-400">Score: {lead.score}/100</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20">Delete</button>
                        {!editing && <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600">Edit</button>}
                    </div>
                </div>

                {editing ? (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Status</label>
                            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as LeadStatus)} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white">
                                {STATUS_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Notes</label>
                            <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Follow-up Date</label>
                            <input type="datetime-local" value={editFollowUp} onChange={(e) => setEditFollowUp(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Tags (comma-separated)</label>
                            <input value={editTags} onChange={(e) => setEditTags(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-xs text-gray-400 mb-1">Email</p><p className="text-sm text-[#111418] dark:text-white">{lead.email || '-'}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Phone</p><p className="text-sm text-[#111418] dark:text-white">{lead.phone || '-'}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Source</p><p className="text-sm text-[#111418] dark:text-white">{lead.source || '-'}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Follow-up</p><p className={`text-sm ${lead.scheduledFollowUp && new Date(lead.scheduledFollowUp) < new Date() ? 'text-red-500 font-medium' : 'text-[#111418] dark:text-white'}`}>{lead.scheduledFollowUp ? new Date(lead.scheduledFollowUp).toLocaleString() : '-'}</p></div>
                        {lead.tags && <div className="col-span-2"><p className="text-xs text-gray-400 mb-1">Tags</p><div className="flex flex-wrap gap-1">{lead.tags.split(',').map((t) => <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400">{t.trim()}</span>)}</div></div>}
                        {lead.notes && <div className="col-span-2"><p className="text-xs text-gray-400 mb-1">Notes</p><p className="text-sm text-[#111418] dark:text-white whitespace-pre-wrap">{lead.notes}</p></div>}
                    </div>
                )}
            </div>

            {/* Add Interaction */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-3">Add Interaction</h3>
                <div className="flex gap-3">
                    <select value={newInterType} onChange={(e) => setNewInterType(e.target.value as InteractionType)} className="px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white">
                        <option value="NOTE">Note</option>
                        <option value="CALL">Call</option>
                        <option value="EMAIL">Email</option>
                        <option value="MEETING">Meeting</option>
                    </select>
                    <input value={newInterContent} onChange={(e) => setNewInterContent(e.target.value)} placeholder="Interaction details..." className="flex-1 px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                    <button onClick={handleAddInteraction} disabled={!newInterContent.trim() || addingInter} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50">
                        {addingInter ? '...' : 'Add'}
                    </button>
                </div>
            </div>

            {/* Interaction Timeline */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-4">Interaction Timeline</h3>
                {interactions.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No interactions yet</p>
                ) : (
                    <div className="space-y-3">
                        {interactions.map((i) => (
                            <div key={i.id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                                <div className="size-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-red-500 text-sm">{INTERACTION_ICONS[i.type] || 'note'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-[#111418] dark:text-white">{i.type}</span>
                                        <span className="text-xs text-gray-400">{new Date(i.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{i.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AdminConfirmModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
                title="Delete Lead" message={`Delete lead "${lead.name}"? This will also delete all interactions.`} confirmLabel="Delete" isDestructive />
        </div>
    );
};
