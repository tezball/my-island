import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, isOpen }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            startScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isOpen]);

    const startScanner = async () => {
        setIsStarting(true);
        setError(null);

        try {
            const html5QrCode = new Html5Qrcode('qr-reader');
            scannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                (decodedText) => {
                    // Extract claim ID from URL if present
                    let claimId = decodedText;
                    try {
                        const url = new URL(decodedText);
                        const idParam = url.searchParams.get('id');
                        if (idParam) {
                            claimId = idParam;
                        }
                    } catch {
                        // Not a URL, use as-is
                    }

                    // Stop scanner and call onScan
                    stopScanner();
                    onScan(claimId);
                },
                () => {
                    // QR code not found - ignore
                }
            );
        } catch (err) {
            console.error('Failed to start QR scanner:', err);
            setError('Could not access camera. Please ensure camera permissions are granted.');
        } finally {
            setIsStarting(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err) {
                // Ignore errors when stopping
            }
            scannerRef.current = null;
        }
    };

    const handleClose = () => {
        stopScanner();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black">
            {/* Close button */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors z-10"
            >
                <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Header */}
            <div className="absolute top-4 left-4 z-10">
                <h2 className="text-white text-lg font-bold">Scan Voucher QR</h2>
                <p className="text-white/70 text-sm">Point camera at customer's QR code</p>
            </div>

            {/* Scanner Container */}
            <div className="relative w-full max-w-sm">
                {isStarting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-xl">
                        <div className="flex flex-col items-center gap-4">
                            <div className="inline-block size-10 border-3 border-gray-600 border-t-lime-500 rounded-full animate-spin" />
                            <p className="text-white">Starting camera...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-xl p-6">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-4xl text-red-400 mb-4 block">
                                videocam_off
                            </span>
                            <p className="text-white mb-4">{error}</p>
                            <button
                                onClick={startScanner}
                                className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* QR Reader element - html5-qrcode will inject the video here */}
                <div
                    id="qr-reader"
                    className="rounded-xl overflow-hidden"
                    style={{ width: '100%' }}
                />

                {/* Scanning frame overlay */}
                {!error && !isStarting && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-2 border-lime-500 rounded-xl relative">
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-lime-500 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-lime-500 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-lime-500 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-lime-500 rounded-br-lg" />

                            {/* Scanning line animation */}
                            <div className="absolute inset-x-4 top-1/2 h-0.5 bg-lime-500/50 animate-pulse" />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom hint */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white/60 text-sm">
                    Can't scan? Enter the claim ID manually on the redeem page.
                </p>
            </div>
        </div>
    );
};
