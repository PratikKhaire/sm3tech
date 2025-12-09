'use client'
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import FileUpload from "../file-upload";
import { FileText, Download, UploadCloud, Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { getUser, getAgenciesByUser, updateSafetyAudit } from "@/lib/queries";

const AUDIT_REPORT_URL = "/docs/Audit reports_Ultimate.docx"; // Place your docx file in public/docs/

const SafetyAuditReport = () => {
    const { toast } = useToast();
    const [uploadedFile, setUploadedFile] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [agencyId, setAgencyId] = useState<string | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUser();
                if (!user?._id) {
                    toast({ title: 'Error', description: 'Please login first', variant: 'destructive' });
                    return;
                }
                const agencies = await getAgenciesByUser(user._id);
                if (agencies && agencies.length > 0) {
                    setAgencyId(agencies[0]._id);
                    if (agencies[0].safetyAudit?.auditReport) {
                        setUploadedFile(agencies[0].safetyAudit.auditReport);
                    }
                } else {
                    toast({ title: 'No Agency Found', description: 'Please create an agency first', variant: 'destructive' });
                }
            } catch (error) {
                console.error('Error:', error);
                toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        if (!agencyId) {
            toast({ title: 'Error', description: 'No agency found. Please create an agency first.', variant: 'destructive' });
            return;
        }
        if (!uploadedFile) {
            toast({ title: 'Error', description: 'Please upload a file first', variant: 'destructive' });
            return;
        }
        setSaving(true);
        try {
            await updateSafetyAudit(agencyId, { auditReport: uploadedFile });
            toast({ title: 'Success', description: 'Safety Audit Report saved successfully!' });
        } catch (error) {
            console.error('Error saving:', error);
            toast({ title: 'Error', description: 'Failed to save document', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-8 font-sora">
            {/* Decorative elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -left-4 top-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
                <div className="absolute right-10 bottom-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-lg shadow-xl border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-full" />

                <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold font-sora text-gray-900">
                                Safety Audit Report
                            </CardTitle>
                            <p className="text-gray-600 text-sm mt-1">
                                Download, review, and re-upload your completed safety audit report.
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col items-center gap-6 py-6">
                        {/* Download Button */}
                        <a
                            href={AUDIT_REPORT_URL}
                            download
                            className="w-full"
                        >
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 font-semibold rounded-lg shadow transition-all"
                            >
                                <Download className="h-5 w-5" />
                                Download Audit Report Template
                            </Button>
                        </a>

                        {/* Divider */}
                        <div className="w-full border-t border-blue-100 my-4"></div>

                        {/* Re-upload Section */}
                        <div className="w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <UploadCloud className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-gray-800">Re-upload Completed Audit Report</span>
                            </div>
                            <FileUpload
                                apiEndpoint="pdfUploader"
                                onChange={(url?: string) => setUploadedFile(url ?? "")}
                                value={uploadedFile}
                            />
                        </div>

                        {/* Save Button */}
                        <Button
                            type="button"
                            disabled={saving || !agencyId || !uploadedFile}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={handleSave}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                'Save Audit Report'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SafetyAuditReport;