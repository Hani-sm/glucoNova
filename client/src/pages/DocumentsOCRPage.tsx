import { useState, useRef } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, FileText, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DocumentsOCRPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast({ title: 'Uploading document...', description: 'AI is analyzing your medical report' });

    // Simulate OCR processing with AI
    setTimeout(() => {
      const mockData = {
        reportType: 'Lab Results',
        date: '2024-11-20',
        doctor: 'Dr. Sarah Smith',
        extractedFields: {
          'HbA1c': '7.2%',
          'Fasting Glucose': '126 mg/dL',
          'Total Cholesterol': '185 mg/dL',
          'Blood Pressure': '128/82 mmHg',
          'Creatinine': '0.9 mg/dL',
        },
        aiInsights: [
          'HbA1c indicates moderate diabetes control',
          'Fasting glucose slightly elevated - consider medication adjustment',
          'Cholesterol levels are within normal range',
        ],
        confidence: 95,
      };

      setExtractedData(mockData);
      setUploading(false);
      toast({ 
        title: 'Document processed successfully!', 
        description: 'AI has extracted key medical data from your report',
        variant: 'default',
      });
    }, 2000);
  };

  const documents = [
    { id: 1, name: 'Lab Results - Nov 2024', type: 'Lab Report', date: '2024-11-20', status: 'processed' },
    { id: 2, name: 'Prescription - Dr. Smith', type: 'Prescription', date: '2024-11-18', status: 'processed' },
    { id: 3, name: 'Blood Test Results', type: 'Lab Report', date: '2024-11-10', status: 'processing' },
  ];

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '280px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Camera className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Documents & OCR</h2>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Processing...' : 'Upload Document'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </header>
        
        <main className="flex-1 overflow-y-auto" style={{ padding: '24px 32px' }}>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">Medical Documents & OCR</h1>
            <p className="text-muted-foreground">Upload medical reports for AI-powered data extraction and insulin prediction</p>
          </div>

          {extractedData && (
            <Card className="mb-6 border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-primary" />
                  AI-Extracted Data from Latest Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Report Type</p>
                      <p className="font-semibold">{extractedData.reportType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{extractedData.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">AI Confidence</p>
                      <p className="font-semibold text-green-500">{extractedData.confidence}%</p>
                    </div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Extracted Medical Values</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(extractedData.extractedFields).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-2 bg-secondary rounded">
                          <span className="text-sm text-muted-foreground">{key}:</span>
                          <span className="text-sm font-semibold">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-500">AI Insights & Predictions</h4>
                    <ul className="space-y-2">
                      {extractedData.aiInsights.map((insight: string, idx: number) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-green-500">Insulin Prediction Based on Report</h4>
                    <p className="text-sm mb-2">Based on your HbA1c and glucose levels, the AI recommends:</p>
                    <div className="flex items-center gap-4">
                      <div className="text-center p-3 bg-background/50 rounded">
                        <p className="text-2xl font-bold text-primary">12 units</p>
                        <p className="text-xs text-muted-foreground">Basal insulin (daily)</p>
                      </div>
                      <div className="text-center p-3 bg-background/50 rounded">
                        <p className="text-2xl font-bold text-primary">1:10</p>
                        <p className="text-xs text-muted-foreground">Insulin-to-carb ratio</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      ⚠️ This is an AI prediction. Please consult your healthcare provider before making changes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-all">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-semibold">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.type} • {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {doc.status === 'processed' ? (
                        <span className="flex items-center gap-1 text-sm text-green-500">
                          <CheckCircle className="w-4 h-4" />
                          Processed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-yellow-500">
                          <AlertCircle className="w-4 h-4" />
                          Processing
                        </span>
                      )}
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
