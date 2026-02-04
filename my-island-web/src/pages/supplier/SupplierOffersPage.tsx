import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supplierService, type Offer, type OfferCategory } from '../../services/supplierService';
import { OfferFormModal } from '../../components/supplier/offers/OfferFormModal';
import { useSubscription } from '../../context/SubscriptionContext';

const CATEGORY_LABELS: Record<OfferCategory, string> = {
    FOOD: 'Food & Drink',
    ACTIVITIES: 'Activities',
    GEAR: 'Gear Rental',
    ATTRACTIONS: 'Attractions',
    TRANSPORT: 'Transport'
};

export const SupplierOffersPage: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const { subscription, isLoading: subscriptionLoading } = useSubscription();

    const supplierId = 'supplier-green-acres'; // TODO: Get from auth context
    const hasActiveSubscription = subscription?.hasActiveSubscription ?? false;

    useEffect(() => {
        loadOffers();
    }, []);

    const loadOffers = async () => {
        setIsLoading(true);
        try {
            const data = await supplierService.getOffers(supplierId);
            setOffers(data);
        } catch (error) {
            console.error('Failed to load offers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (offerData: Omit<Offer, 'id' | 'claimCount' | 'createdAt'>) => {
        if (editingOffer) {
            await supplierService.updateOffer(editingOffer.id, offerData);
        } else {
            await supplierService.addOffer(offerData);
        }
        await loadOffers();
        setIsModalOpen(false);
        setEditingOffer(null);
    };

    const handleEdit = (offer: Offer) => {
        setEditingOffer(offer);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this offer?')) {
            await supplierService.deleteOffer(id);
            await loadOffers();
        }
    };

    const handleToggleActive = async (offer: Offer) => {
        await supplierService.updateOffer(offer.id, { active: !offer.active });
        await loadOffers();
    };

    const filteredOffers = offers.filter(offer => {
        if (filter === 'active') return offer.active;
        if (filter === 'inactive') return !offer.active;
        return true;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Subscription Warning */}
            {!subscriptionLoading && !hasActiveSubscription && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">warning</span>
                        <div className="flex-1">
                            <h3 className="font-medium text-amber-800 dark:text-amber-200">Subscription Required</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                You need an active subscription to create new offers. Subscribe now to start promoting your business to guests.
                            </p>
                            <Link
                                to="/supplier/settings"
                                className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                            >
                                Go to Settings
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Offers</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Manage your promotional offers for guests
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingOffer(null);
                        setIsModalOpen(true);
                    }}
                    disabled={!hasActiveSubscription}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                        hasActiveSubscription
                            ? 'bg-lime-500 text-white hover:bg-lime-600'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                    title={hasActiveSubscription ? 'Create a new offer' : 'Subscribe to create offers'}
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Create Offer
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'active', 'inactive'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === f
                                ? 'bg-lime-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Offers Grid */}
            {filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredOffers.map((offer) => (
                        <OfferCard
                            key={offer.id}
                            offer={offer}
                            onEdit={() => handleEdit(offer)}
                            onDelete={() => handleDelete(offer.id)}
                            onToggleActive={() => handleToggleActive(offer)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">local_offer</span>
                    <h3 className="text-lg font-medium text-[#111418] dark:text-white mb-2">No offers yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {hasActiveSubscription
                            ? 'Create your first offer to attract guests'
                            : 'Subscribe to start creating offers for guests'}
                    </p>
                    {hasActiveSubscription ? (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Create Offer
                        </button>
                    ) : (
                        <Link
                            to="/supplier/settings"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">credit_card</span>
                            Subscribe Now
                        </Link>
                    )}
                </div>
            )}

            {/* Modal */}
            <OfferFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingOffer(null);
                }}
                offer={editingOffer}
                onSave={handleSave}
                supplierId={supplierId}
            />
        </div>
    );
};

const OfferCard: React.FC<{
    offer: Offer;
    onEdit: () => void;
    onDelete: () => void;
    onToggleActive: () => void;
}> = ({ offer, onEdit, onDelete, onToggleActive }) => {
    const navigate = useNavigate();
    const isExpired = new Date(offer.validUntil) < new Date();
    const claimsRemaining = offer.maxClaims ? offer.maxClaims - offer.claimCount : null;

    const handleCardClick = () => {
        navigate(`/supplier/offers/${offer.id}`);
    };

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer hover:border-lime-300 dark:hover:border-lime-700 hover:shadow-md transition-all"
        >
            {/* Image */}
            {offer.imageUrl && (
                <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${offer.imageUrl})` }}
                />
            )}

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white truncate">
                            {offer.title}
                        </h3>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {CATEGORY_LABELS[offer.category]}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {offer.discountPercent > 0 && (
                            <span className="text-lg font-bold text-lime-600 dark:text-lime-400">
                                {offer.discountPercent}% OFF
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {offer.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-lg">redeem</span>
                        <span>{offer.claimCount} claimed</span>
                        {claimsRemaining !== null && (
                            <span className="text-gray-400">({claimsRemaining} left)</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-lg">event</span>
                        <span>
                            {new Date(offer.validFrom).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
                            {' - '}
                            {new Date(offer.validUntil).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            isExpired
                                ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                : offer.active
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                            {isExpired ? 'Expired' : offer.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => handleActionClick(e, onToggleActive)}
                            disabled={isExpired}
                            className="p-2 text-gray-500 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={offer.active ? 'Deactivate' : 'Activate'}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {offer.active ? 'toggle_off' : 'toggle_on'}
                            </span>
                        </button>
                        <button
                            onClick={(e) => handleActionClick(e, onEdit)}
                            className="p-2 text-gray-500 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button
                            onClick={(e) => handleActionClick(e, onDelete)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
