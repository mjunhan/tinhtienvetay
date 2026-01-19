'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PricingSaveBarProps {
    onSave: () => void;
    onReset: () => void;
    isLoading: boolean;
    hasChanges: boolean;
}

export const PricingSaveBar = ({ onSave, onReset, isLoading, hasChanges }: PricingSaveBarProps) => {
    return (
        <AnimatePresence>
            {hasChanges && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between md:justify-center gap-4"
                >
                    <div className="flex items-center gap-4 max-w-7xl mx-auto w-full justify-between md:justify-center">
                        <span className="text-slate-600 font-medium hidden md:inline-block">
                            Bạn có thay đổi chưa được lưu...
                        </span>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={onReset}
                                disabled={isLoading}
                                className="text-slate-600 hover:text-slate-900 border-slate-300"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Hủy bỏ
                            </Button>

                            <Button
                                onClick={onSave}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
