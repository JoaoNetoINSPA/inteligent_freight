import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";

const AuditFreight = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [uploadStep, setUploadStep] = useState<"upload" | "mapping" | "processing" | "results">("upload");

  const requiredFields = [
    "order_id",
    "customer_city",
    "customer_state",
    "seller_city",
    "seller_state",
    "product_weight_g",
    "freight_value",
    "order_status",
  ];

  const mockExcelColumns = [
    "OrderID",
    "CustomerLocation",
    "CustomerRegion",
    "SellerLocation",
    "SellerRegion",
    "Weight",
    "ShippingCost",
    "Status",
    "Date",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast({
          title: "Invalid File",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setUploadStep("mapping");
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const handleProcessAudit = () => {
    const unmappedFields = requiredFields.filter(field => !mapping[field]);
    
    if (unmappedFields.length > 0) {
      toast({
        title: "Incomplete Mapping",
        description: "Please map all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploadStep("processing");
    
    // Simulate processing
    setTimeout(() => {
      setUploadStep("results");
      toast({
        title: "Audit Complete",
        description: "Freight audit has been completed successfully",
      });
    }, 2000);
  };

  const mockAuditResults = [
    { orderId: "ORD-001", charged: 45.50, expected: 42.30, difference: 3.20, status: "overcharged" },
    { orderId: "ORD-002", charged: 78.20, expected: 78.20, difference: 0, status: "correct" },
    { orderId: "ORD-003", charged: 62.00, expected: 65.50, difference: -3.50, status: "undercharged" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold">Audit Freight</h2>
          <p className="text-muted-foreground mt-1">Upload Excel file to audit freight charges</p>
        </div>

        {/* Upload Step */}
        {uploadStep === "upload" && (
          <Card className="p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Excel File</h3>
                <p className="text-muted-foreground">
                  Upload your freight data in Excel format (.xlsx or .xls)
                </p>
              </div>
              <div className="pt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Mapping Step */}
        {uploadStep === "mapping" && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Map Your Columns</h3>
                <p className="text-muted-foreground">
                  Map your Excel columns to our required fields
                </p>
              </div>

              <div className="space-y-4">
                {requiredFields.map((field) => (
                  <div key={field} className="grid md:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="text-sm font-medium">
                        {field.replace(/_/g, " ").toUpperCase()}
                      </label>
                    </div>
                    <Select value={mapping[field]} onValueChange={(value) => setMapping(prev => ({ ...prev, [field]: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockExcelColumns.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleProcessAudit} className="flex-1">
                  Process Audit
                </Button>
                <Button variant="outline" onClick={() => {
                  setUploadStep("upload");
                  setSelectedFile(null);
                  setMapping({});
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Processing Step */}
        {uploadStep === "processing" && (
          <Card className="p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <FileSpreadsheet className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Processing Audit</h3>
                <p className="text-muted-foreground">
                  Analyzing freight charges and comparing with expected values...
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Results Step */}
        {uploadStep === "results" && (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Audit Results</h3>
                <Button variant="outline" onClick={() => {
                  setUploadStep("upload");
                  setSelectedFile(null);
                  setMapping({});
                }}>
                  New Audit
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-700">Correct</p>
                      <p className="text-2xl font-bold text-green-700">1</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-sm text-red-700">Overcharged</p>
                      <p className="text-2xl font-bold text-red-700">1</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-yellow-700">Undercharged</p>
                      <p className="text-2xl font-bold text-yellow-700">1</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Order ID</th>
                      <th className="text-left p-4 font-semibold">Charged</th>
                      <th className="text-left p-4 font-semibold">Expected</th>
                      <th className="text-left p-4 font-semibold">Difference</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAuditResults.map((result) => (
                      <tr key={result.orderId} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">{result.orderId}</td>
                        <td className="p-4">${result.charged.toFixed(2)}</td>
                        <td className="p-4">${result.expected.toFixed(2)}</td>
                        <td className={`p-4 font-medium ${result.difference > 0 ? "text-red-600" : result.difference < 0 ? "text-yellow-600" : "text-green-600"}`}>
                          {result.difference > 0 ? "+" : ""}{result.difference.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            result.status === "correct" ? "bg-green-100 text-green-700" :
                            result.status === "overcharged" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AuditFreight;
